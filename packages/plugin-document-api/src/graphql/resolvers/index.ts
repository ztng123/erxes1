import customScalars from '@erxes/api-utils/src/customScalars';

import mutations from './mutations';
import queries from './queries';
import { Types } from '../../models';

const Document = {
  currentType(document, _args) {
    return Types.findOne({ _id: document.typeId });
  }
};

const resolvers: any = async (_serviceDiscovery) => ({
  ...customScalars,
  Document,
  Mutation: {
    ...mutations
  },
  Query: {
    ...queries
  }
});

export default resolvers;
