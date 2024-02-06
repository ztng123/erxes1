import customScalars from '@erxes/api-utils/src/customScalars';

import mutations from './mutations';
import queries from './queries';
import { Types } from '../../models';

const Dashboard = {
  currentType(dashboard, _args) {
    return Types.findOne({ _id: dashboard.typeId });
  }
};

const resolvers: any = async _serviceDiscovery => ({
  ...customScalars,
  Dashboard,
  Mutation: {
    ...mutations
  },
  Query: {
    ...queries
  }
});

export default resolvers;
