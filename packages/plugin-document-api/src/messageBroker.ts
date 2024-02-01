
import { ISendMessageArgs, sendMessage } from "@erxes/api-utils/src/core";
import { serviceDiscovery } from "./configs";
import { Documents } from "./models";

let client;

export const initBroker = async cl => {
  client = cl;

  const { consumeQueue, consumeRPCQueue } = client;

  consumeQueue('document:send', async ({ data }) => {
    Documents.send(data);

    return {
      status: 'success',
    };
  });

  consumeRPCQueue('document:find', async ({ data }) => {
    return {
      status: 'success',
      data: await Documents.find({})
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