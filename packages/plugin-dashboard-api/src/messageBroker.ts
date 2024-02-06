import { ISendMessageArgs, sendMessage } from '@erxes/api-utils/src/core';
import { serviceDiscovery } from './configs';
import { Dashboards } from './models';

let client;

export const initBroker = async cl => {
  client = cl;

  const { consumeQueue, consumeRPCQueue } = client;

  consumeQueue('dashboard:send', async ({ data }) => {
    Dashboards.send(data);

    return {
      status: 'success'
    };
  });

  consumeRPCQueue('dashboard:find', async ({ data }) => {
    return {
      status: 'success',
      data: await Dashboards.find({})
    };
  });
};

export const sendCommonMessage = async (
  args: ISendMessageArgs & { serviceName: string }
) => {
  return sendMessage({
    serviceDiscovery,
    client,
    ...args
  });
};

export default function() {
  return client;
}
