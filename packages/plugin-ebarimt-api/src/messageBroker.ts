import { generateModels } from "./connectionResolver";
import { ISendMessageArgs, sendMessage } from "@erxes/api-utils/src/core";
import { serviceDiscovery } from "./configs";
import { afterMutationHandlers } from "./afterMutations";

let client;

export const initBroker = async (cl) => {
  client = cl;

  const { consumeQueue } = client;

  consumeQueue("syncEbarmit:afterMutation", async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);
    await afterMutationHandlers(subdomain, data, models);
    return;
  });
};

export const sendNotificationsMessage = async (
  args: ISendMessageArgs
): Promise<any> => {
  return sendMessage({
    client,
    serviceDiscovery,
    serviceName: "notifications",
    ...args,
  });
};

export const sendCoreMessage = async (args: ISendMessageArgs): Promise<any> => {
  return sendMessage({
    client,
    serviceDiscovery,
    serviceName: "core",
    ...args,
  });
};

export const sendCommonMessage = async (
  args: ISendMessageArgs & { serviceName: string }
): Promise<any> => {
  return sendMessage({
    serviceDiscovery,
    client,
    ...args,
  });
};

export default function() {
  return client;
}
