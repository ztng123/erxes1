import { Menus, Types } from '../../models';
import { IContext } from '@erxes/api-utils/src/types';

const menuMutations = {
  /**
   * Creates a new menu
   */
  async menusAdd(
    _root,
    { title, content, parentId, ...doc },
    _context: IContext
  ) {
    const newDoc = {
      ...doc,
      title,
      content,
      parentId
      // 기타 필요한 필드 추가
    };

    return Menus.createMenu(newDoc);
  },
  /**
   * Edits a new menu
   */
  async menusEdit(
    _root,
    { _id, title, content, parentId, ...doc },
    _context: IContext
  ) {
    const updateDoc = {
      ...doc,
      title,
      content,
      parentId
      // 기타 필요한 필드 추가
    };

    return Menus.updateMenu(_id, updateDoc);
  },
  /**
   * Removes a single menu
   */
  async menusRemove(_root, { _id }, _context: IContext) {
    return Menus.removeMenu(_id);
  },

  /**
   * Creates a new type for menu
   */
  async menuTypesAdd(_root, doc, _context: IContext) {
    return Types.createType(doc);
  },

  async menuTypesRemove(_root, { _id }, _context: IContext) {
    return Types.removeType(_id);
  },

  async menuTypesEdit(_root, { _id, ...doc }, _context: IContext) {
    return Types.updateType(_id, doc);
  }
};

export default menuMutations;
