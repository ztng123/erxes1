import { Dashboards, Types } from '../../models';
import { IContext } from '@erxes/api-utils/src/types';

const dashboardMutations = {
  /**
   * Creates a new dashboard
   */
  async dashboardsAdd(_root, doc, _context: IContext) {
    return Dashboards.createDashboard(doc);
  },
  /**
   * Edits a new dashboard
   */
  async dashboardsEdit(_root, { _id, ...doc }, _context: IContext) {
    return Dashboards.updateDashboard(_id, doc);
  },
  /**
   * Removes a single dashboard
   */
  async dashboardsRemove(_root, { _id }, _context: IContext) {
    return Dashboards.removeDashboard(_id);
  },

  /**
   * Creates a new type for dashboard
   */
  async dashboardTypesAdd(_root, doc, _context: IContext) {
    return Types.createType(doc);
  },

  async dashboardTypesRemove(_root, { _id }, _context: IContext) {
    return Types.removeType(_id);
  },

  async dashboardTypesEdit(_root, { _id, ...doc }, _context: IContext) {
    return Types.updateType(_id, doc);
  }
};

export default dashboardMutations;
