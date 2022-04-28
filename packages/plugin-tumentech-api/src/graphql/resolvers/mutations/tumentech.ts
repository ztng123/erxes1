import {
    checkPermission,
  } from "@erxes/api-utils/src/permissions";
  // import { orderDeleteToErkhet, orderToErkhet } from "../../../utils";
  // import messageBroker, { sendCoreMessage, sendPosMessage, sendEbarimtMessage } from '../../../messageBroker';
  // import { getConfig } from "../../../utils";
  import { IContext } from "../../../connectionResolver";
import { putCreateLog } from "@erxes/api-utils/src/logUtils";
  
  const mutations = {
    // carsAdd: async (_root,
    //   doc,
    //   { user, docModifier, models, checkPermission, messageBroker }) => {
    //     await checkPermission('manageCars', user);
    //     const car = await models.Cars.createCar(models, docModifier(doc), user);
    //     await putCreateLog(
    //       messageBroker,
    //       gatherDescriptions,
    //       {
    //         type: 'car',
    //         newData: doc,
    //         object: car,
    //         extraParams: { models }
    //       },
    //       user
    //     );
  
    //     return car;    
    // },
  
    posEdit: async (
      _root,
      { _id, params },
      { models, subdomain }: IContext
    ) => {
      const object = await models.Pos.getPos({ _id });
      const updatedDocument = await models.Pos.posEdit(_id, params);
  
      const adminUsers = await sendCoreMessage({
        subdomain,
        action: 'users.find',
        data: {
          query: {
            _id: { $in: updatedDocument.adminIds },
          }
        },
        isRPC: true,
        defaultValue: []
      })
  
      const cashierUsers = await sendCoreMessage({
        subdomain,
        action: 'users.find',
        data: {
          query: {
            _id: { $in: updatedDocument.cashierIds }
          }
        },
        isRPC: true,
        defaultValue: []
      })
  
  
      await sendPosMessage(
        models,
        messageBroker,
        "pos:crudData",
        {
          type: "pos",
          action: "update",
          object,
          updatedDocument,
          adminUsers,
          cashierUsers,
        },
        object
      );
  
      return updatedDocument;
    },
  
    posRemove: async ( _root, { _id }: { _id: string }, { models } ) => {
      return await models.Pos.posRemove(_id);
    },
  
    productGroupsBulkInsert: async (
      _root,
      { posId, groups }: { posId: string; groups: any[] },
      { models }
    ) => {
      const dbGroups = await models.ProductGroups.groups(posId);
      const groupsToAdd = [] as any;
      const groupsToUpdate = [] as any;
      for (const group of groups) {
        if (group._id.includes("temporaryId")) {
          delete group._id;
          groupsToAdd.push({ ...group, posId });
        } else {
          groupsToUpdate.push(group);
          await models.ProductGroups.groupsEdit(group._id, group);
        }
      }
      const groupsToRemove = dbGroups.filter((el) => {
        const index = groupsToUpdate.findIndex((g) => g._id === el._id);
        if (index === -1) {
          return el._id;
        }
      });
      if (groupsToRemove.length > 0) {
        await models.ProductGroups.deleteMany({ _id: { $in: groupsToRemove } });
      }
      await models.ProductGroups.insertMany(groupsToAdd);
      return models.ProductGroups.groups(posId);
    },
  
    posOrderSyncErkhet: async (
      _root,
      { _id }: { _id: string },
      { models, subdomain }: IContext
    ) => {
      const order = await models.PosOrders.findOne({ _id }).lean();
      if (!order) {
        throw new Error("not found order");
      }
      const pos = await models.Pos.findOne({ token: order.posToken }).lean();
  
      const putRes = await sendEbarimtMessage({
        subdomain,
        action: 'putresponses.putHistories',
        data: {
          contentType: "pos",
          contentId: _id,
        },
        isRPC: true
      })
  
      if (!pos) {
        throw new Error("not found pos");
      }
      if (!putRes) {
        throw new Error("not found put response");
      }
      await orderToErkhet(models, messageBroker, subdomain, pos, _id, putRes);
      return await models.PosOrders.findOne({ _id }).lean();
    },
  
    posOrderReturnBill: async (
      _root,
      { _id }: { _id: string },
      { models,  subdomain }: IContext
    ) => {
      const order = await models.PosOrders.findOne({ _id }).lean();
      if (!order) {
        throw new Error("not found order");
      }
      const pos = await models.Pos.findOne({ token: order.posToken }).lean();
      if (!pos) {
        throw new Error("not found pos");
      }
      const ebarimtMainConfig = await getConfig(subdomain, "EBARIMT", {});
  
      await sendEbarimtMessage({
        subdomain,
        action: 'putresponses.returnBill',
        data: {
          contentType: "pos", contentId: _id,
          config: { ...pos.ebarimtConfig, ...ebarimtMainConfig }
        },
        isRPC: true
      })
  
      if (order.syncedErkhet) {
        await orderDeleteToErkhet(models, messageBroker, subdomain, pos, _id);
      }
      return await models.PosOrders.deleteOne({ _id });
    },
    posOrderChangePayments: async (_root, { _id, cashAmount, cardAmount, mobileAmount }, { models }) => {
      const order = await models.PosOrders.findOne({ _id }).lean();
      if (!order) {
        throw new Error('not found order');
      }
  
      if (order.totalAmount !== cashAmount + cardAmount + mobileAmount) {
        throw new Error('not balanced');
      }
  
      await models.PosOrders.updateOne({ _id }, { $set: { cashAmount, cardAmount, mobileAmount } });
      return models.PosOrders.findOne({ _id }).lean();
    }
  };
  
  checkPermission(mutations, "posAdd", "managePos");
  checkPermission(mutations, "posEdit", "managePos");
  checkPermission(mutations, "posRemove", "managePos");
  
  export default mutations;
  