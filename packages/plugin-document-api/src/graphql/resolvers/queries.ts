import { Documents, Types } from "../../models";
import { IContext } from "@erxes/api-utils/src/types"

const documentQueries = {
  documents(
    _root,
    {
      typeId
    },
    _context: IContext
  ) {

    const selector: any = {};

    if (typeId) {
      selector.typeId = typeId;
    }

    return Documents.find(selector).sort({ order: 1, name: 1 });
  },

  documentTypes(_root, _args, _context: IContext) {
    return Types.find({});
  },

  documentsTotalCount(_root, _args, _context: IContext) {
    return Documents.find({}).countDocuments();
  }
};

export default documentQueries;
