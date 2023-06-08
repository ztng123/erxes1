import { generateModels, IModels } from './connectionResolver';
import { sendCoreMessage } from './messageBroker';
import {
  IDeviceConfigDocument,
  IScheduleDocument,
  ITimeClock,
  ITimeClockDocument,
  ITimeLog,
  ITimeLogDocument
} from './models/definitions/timeclock';
import * as dayjs from 'dayjs';
import { fixDate, getEnv } from '@erxes/api-utils/src';
import { Sequelize, QueryTypes } from 'sequelize';

const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'HH:mm';
import {
  findBranchUsers,
  findDepartmentUsers,
  returnUnionOfUserIds
} from './graphql/resolvers/utils';
import { IUserDocument } from '@erxes/api-utils/src/types';

const customFixDate = (date?: Date) => {
  // get date, return date with 23:59:59
  const getDate = new Date(date || '').toLocaleDateString();
  const returnDate = new Date(getDate + ' 23:59:59');
  return returnDate;
};

const createMsSqlConnection = () => {
  const MYSQL_HOST = getEnv({ name: 'MYSQL_HOST' });
  const MYSQL_DB = getEnv({ name: 'MYSQL_DB' });
  const MYSQL_USERNAME = getEnv({ name: 'MYSQL_USERNAME' });
  const MYSQL_PASSWORD = getEnv({ name: 'MYSQL_PASSWORD' });

  // create connection
  const sequelize = new Sequelize(MYSQL_DB, MYSQL_USERNAME, MYSQL_PASSWORD, {
    host: MYSQL_HOST,
    port: 1433,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        useUTC: false,
        cryptoCredentialsDetails: {
          minVersion: 'TLSv1'
        }
      }
    }
  });

  return sequelize;
};

const findAllTeamMembersWithEmpId = (subdomain: string) => {
  return sendCoreMessage({
    subdomain,
    action: 'users.find',
    data: {
      query: { employeeId: { $exists: true } }
    },
    isRPC: true,
    defaultValue: []
  });
};

const findTeamMembers = (subdomain: string, userIds: string[]) => {
  return sendCoreMessage({
    subdomain,
    action: 'users.find',
    data: {
      query: { employeeId: { $exists: true }, _id: { $in: userIds } }
    },
    isRPC: true,
    defaultValue: []
  });
};

const returnNewTimeLogsFromEmpData = async (
  empData: any[],
  teamMembersObj: any,
  existingTimeLogs: ITimeLogDocument[]
) => {
  const returnData: ITimeLog[] = [];

  for (const empDataRow of empData) {
    const currEmpEmpId = parseInt(empDataRow.ID, 10);
    const currEmpUserId = teamMembersObj[currEmpEmpId];

    const newTimeLog = {
      userId: currEmpUserId,
      timelog: new Date(empDataRow.authDateTime),
      deviceSerialNo: empDataRow.deviceSerialNo && empDataRow.deviceSerialNo
    };

    const checkTimeLogAlreadyExists = existingTimeLogs.find(
      existingTimeLog =>
        existingTimeLog.userId === newTimeLog.userId &&
        existingTimeLog.timelog === newTimeLog.timelog
    );

    if (!checkTimeLogAlreadyExists) {
      returnData.push(newTimeLog);
    }
  }

  return returnData;
};

const createTimelogs = async (
  models: IModels,
  startDate: string,
  endDate: string,
  queryData: any,
  teamMembersObj: any
) => {
  const existingTimeLogs = await models.TimeLogs.find({
    timelog: {
      $gte: fixDate(startDate),
      $lte: customFixDate(new Date(endDate))
    }
  });

  const totalTimeLogs: ITimeLog[] = [];

  let currentEmpId;

  let i = 0;

  for (const queryRow of queryData) {
    i++;

    const currEmpId = queryRow.ID;

    if (currEmpId === currentEmpId) {
      continue;
    }

    const currEmpNumber = parseInt(currEmpId, 10);

    if (currEmpNumber) {
      currentEmpId = currEmpId;
      const currEmpData = queryData.filter(row => row.ID === currEmpId);
      totalTimeLogs.push(
        ...(await returnNewTimeLogsFromEmpData(
          currEmpData,
          teamMembersObj,
          existingTimeLogs
        ))
      );
    }
  }

  return await models.TimeLogs.insertMany(totalTimeLogs);
};

const connectAndQueryTimeLogsFromMsSql = async (
  subdomain: string,
  startDate: string,
  endDate: string
) => {
  const MYSQL_TABLE = getEnv({ name: 'MYSQL_TABLE' });
  const sequelize = createMsSqlConnection();
  const models = await generateModels(subdomain);

  let returnData;

  try {
    const teamMembers = await findAllTeamMembersWithEmpId(subdomain);
    const teamMembersObject = {};
    const teamEmployeeIds: string[] = [];

    for (const teamMember of teamMembers) {
      if (!teamMember.employeeId) {
        continue;
      }
      teamMembersObject[teamMember.employeeId] = teamMember._id;
      teamEmployeeIds.push(teamMember.employeeId);
    }

    const query = `SELECT * FROM ${MYSQL_TABLE} WHERE authDateTime >= '${startDate}' AND authDateTime <= '${endDate}' AND ISNUMERIC(ID)=1 AND ID IN (${teamEmployeeIds}) ORDER BY ID, authDateTime`;

    const queryData = await sequelize.query(query, {
      type: QueryTypes.SELECT
    });

    returnData = await createTimelogs(
      models,
      startDate,
      endDate,
      queryData,
      teamMembersObject
    );
  } catch (err) {
    console.error(err);
  }

  return returnData;
};

const connectAndQueryFromMsSql = async (
  subdomain: string,
  params: any
): Promise<ITimeClockDocument[]> => {
  const {
    startDate,
    endDate,
    extractAll,
    branchIds,
    departmentIds,
    userIds
  } = params;

  const sequelize = createMsSqlConnection();
  const MYSQL_TABLE = getEnv({ name: 'MYSQL_TABLE' });

  let teamMembers;

  if (extractAll) {
    teamMembers = await findAllTeamMembersWithEmpId(subdomain);
  } else {
    const getUserIds = await returnUnionOfUserIds(
      branchIds,
      departmentIds,
      userIds,
      subdomain
    );
    teamMembers = await findTeamMembers(subdomain, getUserIds);
  }

  // find team members with employee Id
  const models: IModels = await generateModels(subdomain);

  let returnData: ITimeClockDocument[];

  sequelize
    .authenticate()
    .then(async () => {
      console.log('Connected to MSSQL');
    })
    .catch(err => {
      console.error(err);
      return err;
    });

  // query by employee Id
  try {
    const teamMembersObject = {};
    const teamEmployeeIds: string[] = [];
    const teamMemberIds: string[] = [];

    for (const teamMember of teamMembers) {
      if (!teamMember.employeeId) {
        continue;
      }
      teamMembersObject[teamMember._id] = teamMember.employeeId;
      teamMembersObject[teamMember.employeeId] = teamMember._id;

      teamEmployeeIds.push(teamMember.employeeId);
      teamMemberIds.push(teamMember._id);
    }
    const devicesList = await models.DeviceConfigs.find({
      serialNo: { $exists: true },
      extractRequired: true
    });

    const deviceSerialNumbers = devicesList.map(device => device.serialNo);

    const query = `SELECT * FROM ${MYSQL_TABLE} WHERE authDateTime >= '${startDate}' AND authDateTime <= '${endDate}' AND ISNUMERIC(ID)=1 AND ID IN (${teamEmployeeIds}) AND deviceSerialNo IN (${deviceSerialNumbers.map(
      serialNo => `'${serialNo}'`
    )}) ORDER BY ID, authDateTime`;

    const queryData = await sequelize.query(query, {
      type: QueryTypes.SELECT
    });

    returnData = await importDataAndCreateTimeclock(
      subdomain,
      queryData,
      teamMembersObject,
      teamMemberIds,
      startDate,
      endDate
    );
  } catch (err) {
    console.error(err);
    return err;
  }

  return returnData;
};

const importDataAndCreateTimeclock = async (
  subdomain: string,
  queryData: any,
  teamMembersObj: any,
  teamMemberIds: string[],
  startDate: string,
  endDate: string
) => {
  const models: IModels = await generateModels(subdomain);

  const returnData: ITimeClock[] = [];

  const empSchedulesObj = await createScheduleObjOfMembers(
    models,
    teamMemberIds,
    startDate,
    endDate
  );

  const existingTimeclocks = await models.Timeclocks.find({
    userId: { $in: teamMemberIds },
    $or: [
      {
        shiftStart: {
          $gte: fixDate(startDate),
          $lte: customFixDate(new Date(endDate))
        }
      },
      {
        shiftEnd: {
          $gte: fixDate(startDate),
          $lte: customFixDate(new Date(endDate))
        }
      }
    ]
  });

  const devicesList: IDeviceConfigDocument[] = await models.DeviceConfigs.find({
    serialNo: { $exists: true }
  });

  const devicesDictionary: any = {};

  for (const device of devicesList) {
    devicesDictionary[device.serialNo] = device.deviceName;
  }

  const newQueryData = await findAndUpdateUnfinishedShifts(
    models,
    teamMemberIds,
    teamMembersObj,
    queryData,
    empSchedulesObj,
    devicesDictionary
  );

  // {empId : [employee Data]}
  const queryDataDictionary: { [employeeId: string]: any[] } = {};

  for (const queryRow of newQueryData) {
    const getTeamMemberId = parseFloat(queryRow.ID);

    if (getTeamMemberId in queryDataDictionary) {
      const existingData = queryDataDictionary[getTeamMemberId];
      queryDataDictionary[getTeamMemberId] = [...existingData, queryRow];
      continue;
    }

    queryDataDictionary[getTeamMemberId] = [queryRow];
  }

  const existingTimeclocksDict: { [key: string]: ITimeClockDocument[] } = {};

  for (const timeclock of existingTimeclocks) {
    if (timeclock.userId in existingTimeclocksDict) {
      existingTimeclocksDict[timeclock.userId] = [
        ...existingTimeclocksDict[timeclock.userId],
        timeclock
      ];
      continue;
    }

    existingTimeclocksDict[timeclock.userId] = [timeclock];
  }

  for (const teamMemberId of Object.keys(empSchedulesObj)) {
    const currEmployeeId = parseFloat(teamMembersObj[teamMemberId]);

    const existingTimeclocksOfEmployee = existingTimeclocksDict[teamMemberId];

    const currentEmpData = queryDataDictionary[currEmployeeId];

    if (!currentEmpData) {
      continue;
    }

    returnData.push(
      ...(await createUserTimeclock(
        currentEmpData,
        currEmployeeId,
        teamMembersObj,
        empSchedulesObj[teamMembersObj[currEmployeeId]],
        existingTimeclocksOfEmployee,
        devicesDictionary
      ))
    );
  }

  return await models.Timeclocks.insertMany(returnData);
};

const createUserTimeclock = async (
  empData: any,
  empId: number,
  teamMembersObj: any,
  empSchedulesObj: any,
  existingTimeclocks: ITimeClockDocument[],
  devicesDictionary: any
) => {
  const returnUserData: ITimeClock[] = [];

  for (const scheduledDay of Object.keys(empSchedulesObj)) {
    // if there's more than one config for one scheduled day
    if (Array.isArray(empSchedulesObj[scheduledDay])) {
      for (const scheduleObj of empSchedulesObj[scheduledDay]) {
        const [shiftStartIdx, shiftEndReverseIdx] = getShiftStartAndEndIdx(
          scheduleObj,
          scheduledDay,
          empData,
          empId
        );

        if (shiftStartIdx === -1) {
          continue;
        }
        const newTime = createNewTimeClock(
          empData,
          shiftStartIdx,
          shiftEndReverseIdx,
          teamMembersObj[empId],
          existingTimeclocks,
          devicesDictionary
        );

        if (newTime) {
          returnUserData.push(newTime);
        }
      }

      continue;
    }

    const [getShiftStartIdx, getShiftEndReverseIdx] = getShiftStartAndEndIdx(
      empSchedulesObj[scheduledDay],
      scheduledDay,
      empData,
      empId
    );

    const newTimeclock = createNewTimeClock(
      empData,
      getShiftStartIdx,
      getShiftEndReverseIdx,
      teamMembersObj[empId],
      existingTimeclocks,
      devicesDictionary
    );

    if (newTimeclock) {
      returnUserData.push(newTimeclock);
    }
  }

  if (!existingTimeclocks) {
    return returnUserData;
  }

  const checkExistingTimeclocksAndFilter = filterExistingTimeclocks(
    returnUserData,
    existingTimeclocks
  );

  return checkExistingTimeclocksAndFilter;
};

const createNewTimeClock = (
  empData: any,
  getShiftStartIdx: number,
  getShiftEndReverseIdx: number,
  userId: string,
  existingTimeclocks: ITimeClockDocument[],
  devicesDictionary: any
) => {
  if (getShiftStartIdx !== -1) {
    const getShiftStart = dayjs(
      empData[getShiftStartIdx].authDateTime
    ).toDate();

    const getShiftEndIdx = empData.length - 1 - getShiftEndReverseIdx;
    let getDeviceName;

    // if both shift start and end exist, shift is ended
    if (getShiftEndReverseIdx !== -1) {
      const deviceSerialNo = empData[getShiftEndIdx].deviceSerialNo;
      getDeviceName =
        devicesDictionary[deviceSerialNo] || empData[getShiftEndIdx].deviceName;
      const getShiftEnd = dayjs(empData[getShiftEndIdx].authDateTime).toDate();

      const newTimeclock = {
        shiftStart: getShiftStart,
        shiftEnd: getShiftEnd,
        shiftActive: false,
        userId,
        deviceName: getDeviceName,
        deviceType: 'faceTerminal'
      };

      // if (!checkTimeClockAlreadyExists(newTimeclock, existingTimeclocks)) {
      //   return newTimeclock;
      // }

      return newTimeclock;
    }

    const deviceSerial = empData[getShiftStartIdx].deviceSerialNo;
    getDeviceName =
      devicesDictionary[deviceSerial] || empData[getShiftStartIdx].deviceName;

    // else shift is still active
    const newTime = {
      shiftStart: getShiftStart,
      shiftActive: true,
      userId,
      deviceName: getDeviceName,
      deviceType: 'faceTerminal'
    };

    // if (!checkTimeClockAlreadyExists(newTime, existingTimeclocks)) {
    //   return newTime;
    // }
    return newTime;
  }
};

// get schedule config of a day return shift start/end idx from empData
const getShiftStartAndEndIdx = (
  empScheduleDayObj: any,
  scheduledDay: string,
  empData: any,
  empId: number,
  unfinishedShiftStart?: Date
) => {
  let getShiftEndIdx;
  let checkInStart;
  let checkInEnd;
  let checkOutStart;
  let checkOutEnd;
  let getShiftStartIdx;

  // shift start of an unfinished shift
  const getShiftStart = dayjs(unfinishedShiftStart);

  const nextDay = dayjs(scheduledDay)
    .add(1, 'day')
    .format(dateFormat);

  // if there's no schedule config, compare empData with schedule start/end
  if (!('validCheckIn' in empScheduleDayObj)) {
    checkInStart = dayjs(scheduledDay + ' ' + empScheduleDayObj.shiftStart).add(
      -3,
      'hour'
    );

    checkInEnd = dayjs(scheduledDay + ' ' + empScheduleDayObj.shiftStart).add(
      3,
      'hour'
    );
  } else {
    checkInStart = dayjs(
      scheduledDay + ' ' + empScheduleDayObj.validCheckIn.configShiftStart
    );

    checkInEnd = dayjs(
      (empScheduleDayObj.validCheckIn.overnight ? nextDay : scheduledDay) +
        ' ' +
        empScheduleDayObj.validCheckIn.configShiftEnd
    );
  }

  getShiftStartIdx = unfinishedShiftStart
    ? empData.findIndex(
        timeLog =>
          parseInt(timeLog.ID, 10) === empId &&
          dayjs(timeLog.authDateTime) >= getShiftStart
      )
    : empData.findIndex(
        timeLog =>
          dayjs(timeLog.authDateTime) >= checkInStart &&
          dayjs(timeLog.authDateTime) <= checkInEnd
      );

  // if overnight shift, look from next day's time logs
  const overnightShift = empScheduleDayObj.overnight;

  if (!('validCheckout' in empScheduleDayObj)) {
    checkOutStart = dayjs(
      overnightShift ? nextDay : scheduledDay + ' ' + empScheduleDayObj.shiftEnd
    ).add(-3, 'hour');

    checkOutEnd = dayjs(
      overnightShift ? nextDay : scheduledDay + ' ' + empScheduleDayObj.shiftEnd
    ).add(3, 'hour');
  } else {
    // if valid check out interval itself is overnight start from scheduled day end at next day
    if (empScheduleDayObj.validCheckout.overnight) {
      checkOutStart = dayjs(
        scheduledDay + ' ' + empScheduleDayObj.validCheckout.configShiftStart
      );

      checkOutEnd = dayjs(
        nextDay + ' ' + empScheduleDayObj.validCheckout.configShiftEnd
      );
    }
    // valid check out inverval is not overnight, but in case shift itself is overnight
    else {
      checkOutStart = dayjs(
        (overnightShift ? nextDay : scheduledDay) +
          ' ' +
          empScheduleDayObj.validCheckout.configShiftStart
      );
      checkOutEnd = dayjs(
        (overnightShift ? nextDay : scheduledDay) +
          ' ' +
          empScheduleDayObj.validCheckout.configShiftEnd
      );
    }
  }

  const getReverseData = empData.slice().reverse();

  getShiftEndIdx = unfinishedShiftStart
    ? getReverseData.findIndex(
        timeLog =>
          parseInt(timeLog.ID, 10) === empId &&
          dayjs(timeLog.authDateTime) >= checkOutStart &&
          dayjs(timeLog.authDateTime) <= checkOutEnd
      )
    : getReverseData.findIndex(
        timeLog =>
          dayjs(timeLog.authDateTime) >= checkOutStart &&
          dayjs(timeLog.authDateTime) <= checkOutEnd
      );

  return [getShiftStartIdx, getShiftEndIdx];
};

const checkTimeClockAlreadyExists = (
  userData: ITimeClock,
  existingTimeclocks?: ITimeClockDocument[]
) => {
  let alreadyExists = false;

  // find duplicates and not include them in new timeclock data
  const findExistingTimeclock =
    existingTimeclocks &&
    existingTimeclocks.find(
      existingShift =>
        existingShift.shiftStart.getTime() === userData.shiftStart?.getTime() ||
        existingShift.shiftEnd?.getTime() === userData.shiftEnd?.getTime()
    );

  if (findExistingTimeclock) {
    alreadyExists = true;
  }

  return alreadyExists;
};

const filterExistingTimeclocks = (
  userData: ITimeClock[],
  existingTimeclocks: ITimeClock[]
) => {
  const existingTimeclocksDict: any = {};

  for (const existingTimeclock of existingTimeclocks) {
    existingTimeclocksDict[
      existingTimeclock.shiftStart.getTime()
    ] = existingTimeclock;

    if (existingTimeclock.shiftEnd) {
      existingTimeclocksDict[
        existingTimeclock.shiftEnd.getTime()
      ] = existingTimeclock;
    }
  }

  const returnNewTimeclocks: ITimeClock[] = userData.filter(timeclock => {
    if (
      timeclock.shiftStart.getTime() in existingTimeclocksDict ||
      (timeclock.shiftEnd &&
        timeclock.shiftEnd.getTime() in existingTimeclocksDict)
    ) {
      return;
    }
    return timeclock;
  });

  return returnNewTimeclocks;
};

const findAndUpdateUnfinishedShifts = async (
  models: IModels,
  teamMemberIds: string[],
  teamMembersObj: any,
  empData: any,
  empSchedulesObj: any,
  devicesDictionary: any
) => {
  const newEmpData = empData.slice();

  // find unfinished shifts
  const unfinishedTimeclocks = await models?.Timeclocks.find({
    shiftActive: true,
    userId: { $in: teamMemberIds }
  });

  const bulkWriteOps: any[] = [];

  unfinishedTimeclocks.forEach(async unfinishedTimeclock => {
    let getShiftEndIdx;

    const teamMemberId = unfinishedTimeclock.userId || '';
    const empId = parseInt(teamMembersObj[teamMemberId || ''], 10);

    const shiftStart = unfinishedTimeclock.shiftStart;
    const getScheduledDay = dayjs(shiftStart).format(dateFormat);

    // if there's no schedule config for that shift
    if (
      !(teamMemberId in empSchedulesObj) ||
      !(getScheduledDay in empSchedulesObj[teamMemberId])
    ) {
      return;
    }

    // for each config of a scheduled day shift  / max 2 configs per scheduled day/
    for (const empScheduledayObj of empSchedulesObj[teamMemberId][
      getScheduledDay
    ]) {
      const [getShiftStartIdx, getShiftEndReverseIdx] = getShiftStartAndEndIdx(
        empScheduledayObj,
        getScheduledDay,
        newEmpData,
        empId,
        shiftStart
      );

      // if shift end is found
      if (getShiftEndReverseIdx !== -1) {
        getShiftEndIdx = newEmpData.length - 1 - getShiftEndReverseIdx;

        const getShiftEnd = dayjs(
          newEmpData[getShiftEndIdx].authDateTime
        ).toDate();

        const getDeviceName =
          devicesDictionary[newEmpData[getShiftEndIdx].deviceSerialNo] ||
          newEmpData[getShiftEndIdx].deviceName;

        const updateTimeClock = {
          shiftStart: unfinishedTimeclock.shiftStart,
          shiftEnd: getShiftEnd,
          userId: teamMemberId,
          shiftActive: false,
          deviceName: getDeviceName,
          deviceType: unfinishedTimeclock.deviceType + ' x faceTerminal'
        };

        const updateTimeclockOperation = {
          updateOne: {
            filter: {
              _id: unfinishedTimeclock._id
            },
            update: {
              ...updateTimeClock
            }
          }
        };

        // if shiftEnd of unfinished timeclock found, insert into bulkWrite and remove data from query data
        bulkWriteOps.push(updateTimeclockOperation);

        const deleteCount = getShiftEndIdx - getShiftStartIdx + 1;
        await newEmpData.splice(getShiftStartIdx, deleteCount);

        break;
      }
    }
  });

  //  update unfinished timeclocks
  if (bulkWriteOps.length) {
    await models.Timeclocks.bulkWrite(bulkWriteOps);
  }

  return newEmpData;
};

const createScheduleObjOfMembers = async (
  models: IModels,
  teamMemberIds: string[],
  startDate: string,
  endDate: string
) => {
  const totalEmployeesSchedulesObject: {
    [userId: string]: IScheduleDocument;
  } = {};

  const totalSchedules = await models.Schedules.find({
    userId: { $in: teamMemberIds },
    status: { $regex: /Approved/, $options: 'gi' },
    $or: [{ createdByRequest: { $exists: false } }, { createdByRequest: false }]
  });

  const totalScheduleIds = totalSchedules.map(schedule => schedule._id);

  const totalScheduleShifts = await models.Shifts.find({
    $and: [
      { scheduleId: { $in: totalScheduleIds } },
      {
        shiftStart: {
          $gte: fixDate(startDate),
          $lte: customFixDate(new Date(endDate))
        },
        shiftEnd: {
          $gte: fixDate(startDate),
          $lte: customFixDate(new Date(endDate))
        }
      }
    ]
  });

  const totalScheduleConfigIds: string[] = [];

  totalScheduleShifts.forEach(scheduleShift => {
    if (scheduleShift.scheduleConfigId) {
      totalScheduleConfigIds.push(scheduleShift.scheduleConfigId);
    }
  });

  const totalScheduleConfigShifts = await models.Shifts.find({
    scheduleConfigId: {
      $in: totalScheduleConfigIds
    },
    scheduleId: { $exists: false }
  });

  const totalScheduleConfigs = await models.ScheduleConfigs.find({
    _id: { $in: [...totalScheduleConfigIds] }
  });

  for (const teamMemberId of teamMemberIds) {
    const empSchedulesDict: any = {};

    const currEmployeeSchedules = totalSchedules.filter(
      schedule => schedule.userId === teamMemberId
    );

    for (const empSchedule of currEmployeeSchedules) {
      const currEmployeeScheduleShifts = totalScheduleShifts.filter(
        scheduleShift => scheduleShift.scheduleId === empSchedule._id
      );

      for (const scheduleShift of currEmployeeScheduleShifts) {
        const shift_date_key = dayjs(scheduleShift.shiftStart).format(
          dateFormat
        );

        // if schedule shift has a config
        if (scheduleShift.scheduleConfigId) {
          // add ValidCheckin ValidCheckout
          let currEmpScheduleConfig = {};

          const getScheduleConfig = totalScheduleConfigs.find(
            scheduleConfig =>
              scheduleConfig._id === scheduleShift.scheduleConfigId
          );

          const scheduleConfigShifts =
            getScheduleConfig &&
            totalScheduleConfigShifts.filter(
              scheduleConfigShift =>
                scheduleConfigShift.configShiftStart &&
                scheduleConfigShift.configShiftEnd &&
                scheduleConfigShift.scheduleConfigId === getScheduleConfig._id
            );

          scheduleConfigShifts?.forEach(scheduleConfigShift => {
            currEmpScheduleConfig[scheduleConfigShift.configName || ''] = {
              configShiftStart: scheduleConfigShift.configShiftStart,
              configShiftEnd: scheduleConfigShift.configShiftEnd,
              overnight:
                dayjs(
                  new Date().toLocaleDateString() +
                    ' ' +
                    scheduleConfigShift.configShiftStart
                ) >
                dayjs(
                  new Date().toLocaleDateString() +
                    ' ' +
                    scheduleConfigShift.configShiftEnd
                )
            };
          });

          currEmpScheduleConfig = {
            ...currEmpScheduleConfig,
            shiftStart:
              getScheduleConfig?.shiftStart ||
              dayjs(scheduleShift.shiftStart).format(timeFormat),
            shiftEnd:
              getScheduleConfig?.shiftEnd ||
              dayjs(scheduleShift.shiftEnd).format(timeFormat),
            overnight:
              dayjs(
                new Date().toLocaleDateString() +
                  ' ' +
                  getScheduleConfig?.shiftStart ||
                  dayjs(scheduleShift.shiftStart).format(timeFormat)
              ) >
              dayjs(
                new Date().toLocaleDateString() +
                  ' ' +
                  getScheduleConfig?.shiftEnd ||
                  dayjs(scheduleShift.shiftEnd).format(timeFormat)
              )
          };
          // if there're config(s) already, put all in array
          if (shift_date_key in empSchedulesDict) {
            const existingSchedules = empSchedulesDict[shift_date_key];
            empSchedulesDict[shift_date_key] = [
              ...existingSchedules,
              currEmpScheduleConfig
            ];
            continue;
          }

          empSchedulesDict[shift_date_key] = [currEmpScheduleConfig];
        }
        // else compare with schedule shift start, shift end
        else {
          const getShiftStartTime = dayjs(scheduleShift.shiftStart).format(
            timeFormat
          );

          const getShiftEndTime = dayjs(scheduleShift.shiftEnd).format(
            timeFormat
          );

          const currEmpSchedule = {
            shiftStart: getShiftStartTime,
            shiftEnd: getShiftEndTime,
            overnight:
              dayjs(new Date().toLocaleDateString() + ' ' + getShiftStartTime) >
              dayjs(new Date().toLocaleDateString() + ' ' + getShiftEndTime)
          };

          // if there're config(s) already, put all in array
          if (shift_date_key in empSchedulesDict) {
            const existingSchedules = empSchedulesDict[shift_date_key];
            empSchedulesDict[shift_date_key] = [
              ...existingSchedules,
              currEmpSchedule
            ];
            continue;
          }
          empSchedulesDict[shift_date_key] = [currEmpSchedule];
        }
      }
    }

    if (!Object.keys(empSchedulesDict).length) {
      continue;
    }

    totalEmployeesSchedulesObject[teamMemberId] = empSchedulesDict;
  }

  return totalEmployeesSchedulesObject;
};

const createTeamMembersObject = async (subdomain: any, userIds: string[]) => {
  const teamMembersObject = {};

  const teamMembers = await sendCoreMessage({
    subdomain,
    action: 'users.find',
    data: {
      query: { _id: { $in: userIds } }
    },
    isRPC: true,
    defaultValue: []
  });

  for (const teamMember of teamMembers) {
    if (!teamMember.employeeId) {
      continue;
    }

    teamMembersObject[teamMember._id] = {
      employeeId: teamMember.employeeId,
      lastName: teamMember.details.lastName,
      firstName: teamMember.details.firstName,
      position: teamMember.details.position
    };
  }

  return teamMembersObject;
};

const returnSupervisedUsers = async (
  currentUserId: string,
  subdomain: string
) => {
  const supervisedDepartmenIds = (
    await sendCoreMessage({
      subdomain,
      action: `departments.find`,
      data: {
        supervisorId: currentUserId
      },
      isRPC: true,
      defaultValue: []
    })
  ).map(dept => dept._id);

  const supervisedBranchIds = (
    await sendCoreMessage({
      subdomain,
      action: `branches.find`,
      data: {
        supervisorId: currentUserId
      },
      isRPC: true,
      defaultValue: []
    })
  ).map(branch => branch._id);

  const findTotalSupervisedUsers: string[] = [];

  findTotalSupervisedUsers.push(
    ...(await findDepartmentUsers(subdomain, supervisedDepartmenIds)).map(
      departmentUser => departmentUser._id
    ),
    currentUserId
  );

  return findTotalSupervisedUsers;
};

const generateFilter = async (
  params: any,
  subdomain: string,
  type: string,
  user: IUserDocument
) => {
  const {
    departmentIds,
    branchIds,
    userIds,
    startDate,
    endDate,
    scheduleStatus,
    isCurrentUserAdmin
  } = params;

  const totalUserIds: string[] = await generateCommonUserIds(
    subdomain,
    userIds,
    branchIds,
    departmentIds
  );

  const models = await generateModels(subdomain);

  let scheduleFilter = {};

  const totalSupervisedUsers = !isCurrentUserAdmin
    ? await returnSupervisedUsers(user._id, subdomain)
    : [];

  if (!isCurrentUserAdmin) {
    scheduleFilter = {
      userId: { $in: totalSupervisedUsers }
    };
  }

  if (type === 'schedule' && !scheduleStatus) {
    return [scheduleFilter, false];
  }

  if (scheduleStatus) {
    if (scheduleStatus.toLowerCase() === 'pending') {
      scheduleFilter = { ...scheduleFilter, solved: false };
    }

    if (
      scheduleStatus.toLowerCase() === 'approved' ||
      scheduleStatus.toLowerCase() === 'rejected'
    ) {
      scheduleFilter = { ...scheduleFilter, status: scheduleStatus };
    }
  }
  const scheduleShiftSelector = {
    shiftStart: {
      $gte: fixDate(startDate),
      $lte: customFixDate(endDate)
    },
    shiftEnd: {
      $gte: fixDate(startDate),
      $lte: customFixDate(endDate)
    }
  };

  // check non empty schedule shifts for schedulesMainQuery
  const scheduleShifts = await models.Shifts.find(scheduleShiftSelector);

  const scheduleIds = new Set(
    scheduleShifts.map(scheduleShift => scheduleShift.scheduleId)
  );

  let returnFilter: any = { _id: { $in: [...scheduleIds] }, ...scheduleFilter };
  let userIdsGiven: boolean = false;
  let commonUserFound: boolean = true;

  const timeFields = returnTimeFieldsFilter(type, params);

  if (branchIds || departmentIds || userIds) {
    userIdsGiven = true;
  }

  if (totalUserIds.length > 0) {
    if (type === 'schedule') {
      returnFilter = { ...returnFilter, userId: { $in: [...totalUserIds] } };
    } else {
      returnFilter = {
        $and: [{ $or: timeFields }, { userId: { $in: [...totalUserIds] } }]
      };
    }
  }

  if (!userIdsGiven && type !== 'schedule') {
    returnFilter = {};
    if (!isCurrentUserAdmin) {
      returnFilter = { userId: { $in: totalSupervisedUsers } };
    }
    returnFilter = {
      ...returnFilter,
      $or: timeFields
    };
  }

  // user Ids given but no related data was found
  if (userIdsGiven && !totalUserIds.length) {
    commonUserFound = false;
  }

  return [returnFilter, commonUserFound];
};

const returnTimeFieldsFilter = (type: string, queryParams: any) => {
  const startDate = queryParams.startDate;
  const endDate = queryParams.endDate;

  switch (type) {
    case 'schedule':
      return [];
    case 'timeclock':
      return [
        {
          shiftStart:
            startDate && endDate
              ? {
                  $gte: fixDate(startDate),
                  $lte: customFixDate(endDate)
                }
              : startDate
              ? {
                  $gte: fixDate(startDate)
                }
              : { $lte: customFixDate(endDate) }
        },
        {
          shiftEnd:
            startDate && endDate
              ? {
                  $gte: fixDate(startDate),
                  $lte: customFixDate(endDate)
                }
              : startDate
              ? {
                  $gte: fixDate(startDate)
                }
              : { $lte: customFixDate(endDate) }
        }
      ];
    case 'absence':
      return [
        {
          startTime:
            startDate && endDate
              ? {
                  $gte: fixDate(startDate),
                  $lte: customFixDate(endDate)
                }
              : startDate
              ? {
                  $gte: fixDate(startDate)
                }
              : { $lte: customFixDate(endDate) }
        },
        {
          endTime:
            startDate && endDate
              ? {
                  $gte: fixDate(startDate),
                  $lte: customFixDate(endDate)
                }
              : startDate
              ? {
                  $gte: fixDate(startDate)
                }
              : { $lte: customFixDate(endDate) }
        }
      ];
    case 'timelog':
      return [
        {
          timelog:
            startDate && endDate
              ? {
                  $gte: fixDate(startDate),
                  $lte: customFixDate(endDate)
                }
              : startDate
              ? {
                  $gte: fixDate(startDate)
                }
              : { $lte: customFixDate(endDate) }
        }
      ];
  }
};

const generateCommonUserIds = async (
  subdomain: string,
  userIds: string[],
  branchIds?: string[],
  departmentIds?: string[]
) => {
  const totalUserIds: string[] = [];

  const branchUsers =
    branchIds && (await findBranchUsers(subdomain, branchIds));

  const departmentUsers =
    departmentIds && (await findDepartmentUsers(subdomain, departmentIds));

  const branchUserIds =
    branchUsers && branchUsers.map(branchUser => branchUser._id);

  const departmentUserIds =
    departmentUsers &&
    departmentUsers.map(departmentUser => departmentUser._id);

  // if both branch and department are given find common users between them
  if (branchIds && departmentIds) {
    const intersectionOfUserIds = branchUserIds.filter(branchUserId =>
      departmentUserIds.includes(branchUserId)
    );

    return intersectionOfUserIds;
  }

  // if no branch/department was given return userIds
  if (userIds && !branchUserIds && !departmentUserIds) {
    return userIds;
  }

  // if both branch, userIds were given
  if (branchUserIds) {
    if (!userIds) {
      return branchUserIds;
    }

    for (const userId of userIds) {
      if (branchUserIds.includes(userId)) {
        totalUserIds.push(userId);
      }
    }
  }

  // if both department, userIds were given
  if (departmentUserIds) {
    if (!userIds) {
      return departmentUserIds;
    }

    for (const userId of userIds) {
      if (departmentUserIds.includes(userId)) {
        totalUserIds.push(userId);
      }
    }
  }

  return totalUserIds;
};

export {
  connectAndQueryFromMsSql,
  connectAndQueryTimeLogsFromMsSql,
  generateFilter,
  generateCommonUserIds,
  findAllTeamMembersWithEmpId,
  createTeamMembersObject,
  customFixDate,
  returnSupervisedUsers
};
