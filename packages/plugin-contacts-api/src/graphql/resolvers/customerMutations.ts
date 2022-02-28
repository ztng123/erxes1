import Customers from '../../models/Customers';
import { ICustomer } from '../../models/definitions/customers';
import messageBroker from '../../messageBroker';
import { MODULE_NAMES } from '../../constants';
import { putCreateLog, putDeleteLog, putUpdateLog } from '../../logUtils';
import { checkPermission } from '@erxes/api-utils/src/permissions';
import { IContext } from '@erxes/api-utils/src';
import { validateBulk } from '../../verifierUtils';
import { sendMessage } from '../../messageBroker';

interface ICustomersEdit extends ICustomer {
  _id: string;
}

const customerMutations = {
  /**
   * Create new customer also adds Customer registration log
   */
  async customersAdd(_root, doc: ICustomer, { user, docModifier }: IContext) {
    const modifiedDoc = docModifier(doc);

    const customer = await Customers.createCustomer(modifiedDoc, user);

    await putCreateLog(
      {
        type: MODULE_NAMES.CUSTOMER,
        newData: modifiedDoc,
        object: customer
      },
      user
    );

    sendMessage('registerOnboardHistory', {
      type: `${customer.state}Create`,
      user
    });

    return customer;
  },

  /**
   * Updates a customer
   */
  async customersEdit(
    _root,
    { _id, ...doc }: ICustomersEdit,
    { user }: IContext
  ) {
    const customer = await Customers.getCustomer(_id);
    const updated = await Customers.updateCustomer(_id, doc);

    await putUpdateLog(
      {
        type: MODULE_NAMES.CUSTOMER,
        object: customer,
        newData: doc,
        updatedDocument: updated
      },
      user
    );

    return updated;
  },

  /**
   * Change state
   */
  async customersChangeState(_root, args: { _id: string; value: string }) {
    return Customers.changeState(args._id, args.value);
  },

  /**
   * Merge customers
   */
  async customersMerge(
    _root,
    {
      customerIds,
      customerFields
    }: { customerIds: string[]; customerFields: ICustomer },
    { user }: IContext
  ) {
    return Customers.mergeCustomers(customerIds, customerFields, user);
  },

  /**
   * Remove customers
   */
  async customersRemove(
    _root,
    { customerIds }: { customerIds: string[] },
    { user }: IContext
  ) {
    const customers = await Customers.find({
      _id: { $in: customerIds }
    }).lean();

    await Customers.removeCustomers(customerIds);

    await messageBroker().sendMessage('erxes-api:integrations-notification', {
      type: 'removeCustomers',
      customerIds
    });

    for (const customer of customers) {
      await putDeleteLog(
        { type: MODULE_NAMES.CUSTOMER, object: customer },
        user
      );

      if (customer.mergedIds) {
        await messageBroker().sendMessage(
          'erxes-api:integrations-notification',
          {
            type: 'removeCustomers',
            customerIds: customer.mergedIds
          }
        );
      }
    }

    return customerIds;
  },

  async customersVerify(
    _root,
    { verificationType }: { verificationType: string }
  ) {
    await validateBulk(verificationType);
  },

  async customersChangeVerificationStatus(
    _root,
    args: { customerIds: [string]; type: string; status: string }
  ) {
    return Customers.updateVerificationStatus(
      args.customerIds,
      args.type,
      args.status
    );
  }
};

checkPermission(customerMutations, 'customersAdd', 'customersAdd');
checkPermission(customerMutations, 'customersEdit', 'customersEdit');
checkPermission(customerMutations, 'customersMerge', 'customersMerge');
checkPermission(customerMutations, 'customersRemove', 'customersRemove');
checkPermission(
  customerMutations,
  'customersChangeState',
  'customersChangeState'
);

export default customerMutations;
