import { Documents, Types } from '../../models';
import { IContext } from "@erxes/api-utils/src/types"

const documentMutations = {
  /**
   * Creates a new document
   */
  async documentsAdd(_root, doc, _context: IContext) {
    return Documents.createDocument(doc);
  },
  /**
   * Edits a new document
   */
  async documentsEdit(
    _root,
    { _id, ...doc },
    _context: IContext
  ) {
    return Documents.updateDocument(_id, doc);
  },
  /**
   * Removes a single document
   */
  async documentsRemove(_root, { _id }, _context: IContext) {
    return Documents.removeDocument(_id);
  },

  /**
   * Creates a new type for document
   */
  async documentTypesAdd(_root, doc, _context: IContext) {
    return Types.createType(doc);
  },

  async documentTypesRemove(_root, { _id }, _context: IContext) {
    return Types.removeType(_id);
  },

  async documentTypesEdit(
    _root,
    { _id, ...doc },
    _context: IContext
  ) {
  return Types.updateType(_id, doc);
  }
};

export default documentMutations;
