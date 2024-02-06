import { Dashboards, Types } from '../../models';
import { IContext } from '@erxes/api-utils/src/types';

const dashboardQueries = {
  dashboards(_root, { typeId }, _context: IContext) {
    const selector: any = {};

    if (typeId) {
      selector.typeId = typeId;
    }

    return Dashboards.find(selector).sort({ order: 1, name: 1 });
  },

  dashboardTypes(_root, _args, _context: IContext) {
    return Types.find({});
  },

  dashboardsTotalCount(_root, _args, _context: IContext) {
    return Dashboards.find({}).countDocuments();
  }
};

export default dashboardQueries;
