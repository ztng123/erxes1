import { sendMessage } from '@erxes/api-utils/src/core';
import { fieldsCombinedByContentType } from './utils';
import { serviceDiscovery } from './configs';
import { generateModels } from './connectionResolver';

let client;

export const initBroker = async cl => {
  client = cl;

  const { consumeRPCQueue, consumeQueue } = client;

  consumeRPCQueue(
    'forms:validate',
    async ({ subdomain, data: { formId, submissions } }) => {
      const models = await generateModels(subdomain);

      return {
        status: 'success',
        data: await models.Forms.validate(formId, submissions)
      };
    }
  );

  consumeRPCQueue('forms:rpc_queue:duplicate', async ({ subdomain, data: { formId } }) => {
    const models = await generateModels(subdomain);

    return {
      status: 'success',
      data: await models.Forms.duplicate(formId)
    };
  }
);

  consumeQueue('forms:removeForm', async ({ subdomain, data: { formId } }) => {
    const models = await generateModels(subdomain);

    return {
      status: 'success',
      data: await models.Forms.removeForm(formId)
    }

  }
);

  consumeRPCQueue(
    'forms:fields.prepareCustomFieldsData',
    async ({ subdomain, data }) => {
      const models = await generateModels(subdomain);
      return {
        status: 'success',
        data: await models.Fields.prepareCustomFieldsData(data)
      };
    }
  );

  consumeRPCQueue(
    'forms:fields.generateCustomFieldsData',
<<<<<<< HEAD
    async ({ data: { customData, contentType } }) => {
=======
    async ({ subdomain, data: { customData, contentType }}) => {
      const models = await generateModels(subdomain);

>>>>>>> 5c454d32d42d25c0d28deaf32c9006664613eaf5
      return {
        status: 'success',
        data: await models.Fields.generateCustomFieldsData(customData, contentType)
      };
    }
  );

  consumeQueue('forms:updateGroup', async ({ subdomain, data: { groupId, fieldsGroup } }) => {
    const models = await generateModels(subdomain);
    
    return {
    status: 'success',
    data: await models.FieldsGroups.updateGroup(groupId, fieldsGroup)
    }

});

  consumeRPCQueue(
    'forms:fields.find',
<<<<<<< HEAD
    async ({ data: { query, projection, sort } }) => {
=======
    async ({ subdomain, data: { query, projection, sort }}) => {
      const models = await generateModels(subdomain);

>>>>>>> 5c454d32d42d25c0d28deaf32c9006664613eaf5
      return {
        status: 'success',
        data: await models.Fields.find(query, projection)
          .sort(sort)
          .lean()
      };
    }
  );

  consumeRPCQueue('forms:fieldsCombinedByContentType', async ({ subdomain, data }) => {
    const models = await generateModels(subdomain); 
    
    return {
      status: 'success',
      data: await fieldsCombinedByContentType(models, data)
    };
  });
};

export const fetchService = async (
  contentType: string,
  action: string,
  data,
  defaultValue?
) => {
  const [serviceName, type] = contentType.split(':');

  return sendMessage({
    subdomain: 'os',
    serviceDiscovery,
    client,
    isRPC: true,
    serviceName,
    action: `fields.${action}`,
    data: {
      ...data,
      type
    },
    defaultValue
  });
};

export default function() {
  return client;
}
