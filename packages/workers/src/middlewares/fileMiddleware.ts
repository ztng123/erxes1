import { receiveImportCreate } from '../worker/utils';
import { getFileUploadConfigs } from '../messageBroker';

export const importer = async (
  contentTypes,
  files,
  columnsConfig,
  importHistoryId,
  associatedContentType,
  associatedField,
  user
) => {
  try {
    const { UPLOAD_SERVICE_TYPE } = await getFileUploadConfigs();

    await receiveImportCreate({
      action: 'createImport',
      contentTypes,
      files,
      uploadType: UPLOAD_SERVICE_TYPE,
      columnsConfig,
      user,
      importHistoryId,
      associatedContentType,
      associatedField
    });
  } catch (e) {
    console.log(e);
    // throw new Error();
  }
};
