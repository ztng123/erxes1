import { IContext } from '../../connectionResolver';
import { IInternalNoteDocument } from '../../models/definitions/internalNotes';

export default {
  createdUser(note: IInternalNoteDocument, _args, { coreModels }: IContext) {
    return coreModels.Users.findOne({ _id: note.createdUserId });
  }
};
