import { Menus, Types } from '../../models';
import { IContext } from '@erxes/api-utils/src/types';

const menuQueries = {
  menus(_root, { typeId, parentId }, _context: IContext) {
    const selector: any = {};

    if (typeId) {
      selector.typeId = typeId;
    }
    if (parentId) {
      selector.parentId = parentId; // parentId에 따른 쿼리 추가
    }

    return Menus.find(selector).sort({ order: 1, name: 1 });
  },

  menuTypes(_root, _args, _context: IContext) {
    return Types.find({});
  },

  menusTotalCount(_root, _args, _context: IContext) {
    return Menus.find({}).countDocuments();
  }
};

export default menuQueries;
