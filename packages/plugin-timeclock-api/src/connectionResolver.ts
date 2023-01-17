import * as mongoose from 'mongoose';

import { IContext as IMainContext } from '@erxes/api-utils/src';
import { createGenerateModels } from '@erxes/api-utils/src/core';
import {
  IAbsenceModel,
  ITimeModel,
  IScheduleModel,
  IShiftModel,
  IPayDateModel,
  loadAbsenceClass,
  loadAbsenceTypeClass,
  loadTimeClass,
  loadScheduleClass,
  loadShiftClass,
  IAbsenceTypeModel,
  loadPayDateClass,
  IScheduleConfigModel,
  loadScheduleConfigClass
} from './models/Timeclock';
import {
  IAbsenceDocument,
  IAbsenceTypeDocument,
  IPayDateDocument,
  IScheduleConfigDocument,
  IScheduleDocument,
  IShiftDocument,
  ITimeClockDocument
} from './models/definitions/timeclock';

export interface IModels {
  Timeclocks: ITimeModel;
  Absences: IAbsenceModel;
  AbsenceTypes: IAbsenceTypeModel;
  Schedules: IScheduleModel;
  Shifts: IShiftModel;
  PayDates: IPayDateModel;
  ScheduleConfigs: IScheduleConfigModel;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export let models: IModels | null = null;

export const loadClasses = (db: mongoose.Connection): IModels => {
  models = {} as IModels;

  models.Timeclocks = db.model<ITimeClockDocument, ITimeModel>(
    'timeclock',
    loadTimeClass(models)
  );

  models.Absences = db.model<IAbsenceDocument, IAbsenceModel>(
    'timeclock_absence',
    loadAbsenceClass(models)
  );

  models.AbsenceTypes = db.model<IAbsenceTypeDocument, IAbsenceTypeModel>(
    'timeclock_absence_type',
    loadAbsenceTypeClass(models)
  );

  models.Schedules = db.model<IScheduleDocument, IScheduleModel>(
    'timeclock_schedule',
    loadScheduleClass(models)
  );

  models.Shifts = db.model<IShiftDocument, IShiftModel>(
    'timeclock_schedule_shifts',
    loadShiftClass(models)
  );

  models.PayDates = db.model<IPayDateDocument, IPayDateModel>(
    'timeclock_pay_date',
    loadPayDateClass(models)
  );

  models.ScheduleConfigs = db.model<
    IScheduleConfigDocument,
    IScheduleConfigModel
  >('timeclock_schedule_config', loadScheduleConfigClass(models));

  return models;
};

export const generateModels = createGenerateModels<IModels>(
  models,
  loadClasses
);
