import { unitField } from '@erxes/ui/src/team/graphql/queries';

const fileFields = `
  _id
  contentType
  contentTypeId
  createdAt
  createdUserId
  documentId
  folderId
  info
  name
  permissionUnitId
  permissionUserIds
  relatedFiles {
   _id
   name
   info
   folderId
   documentId
   type
   url
  }
  relatedFileIds
  sharedUsers {
    _id
    username
    email
    details {
      firstName
      lastName
      fullName
      avatar
    }
  }
  type
  url
`;

const filemanagerFiles = `
  query filemanagerFiles($folderId: String!, $search: String, $type: String, $contentType: String, $contentTypeId: String, $createdAtFrom: String, $createdAtTo: String, $sortField: String, $sortDirection: Int) {
    filemanagerFiles(folderId: $folderId, search: $search, type: $type, contentType: $contentType, contentTypeId: $contentTypeId, createdAtFrom: $createdAtFrom, createdAtTo: $createdAtTo, sortField: $sortField, sortDirection: $sortDirection) {
      ${fileFields}
    }
  }
`;

const filemanagerFoldersTree = `
  query filemanagerFolders($parentId: String, $isTree: Boolean) {
    filemanagerFolders(parentId: $parentId, isTree: $isTree) {
      _id
      parentId
      name
      order
    }
  }
`;

const filemanagerFolders = `
  query filemanagerFolders($parentId: String, $isTree: Boolean) {
    filemanagerFolders(parentId: $parentId, isTree: $isTree) {
      _id
      createdAt
      createdUserId
      parentId
      name
      hasChild
      parent {
        _id
        createdAt
        name
        parentId
      }
    }
  }
`;

const filemanagerFileDetail = `
  query filemanagerFileDetail($_id: String!) {
    filemanagerFileDetail(_id: $_id) {
      ${fileFields}
    }
  }
`;

const filemanagerFolderDetail = `
  query filemanagerFolderDetail($_id: String!) {
    filemanagerFolderDetail(_id: $_id) {
      _id
      createdAt
      createdUserId
      parentId
      name
      hasChild
      parent {
        _id
        createdAt
        name
        parentId
      }
      sharedUsers {
        _id
        username
        email
        details {
          firstName
          lastName
          fullName
          avatar
        }
      }
    }
  }
`;

const filemanagerLogs = `
  query filemanagerLogs($contentTypeId: String!) {
    filemanagerLogs(contentTypeId: $contentTypeId) {
      _id
      contentType
      contentTypeId
      createdAt
      userId
      user {
        _id
        username
        email
        details {
          firstName
          lastName
          fullName
          avatar
        }
      }
      description
    }
  }
`;

const documents = `
  query documents($page: Int, $perPage: Int, $contentType: String, $limit: Int) {
    documents(page: $page, perPage: $perPage, contentType: $contentType, limit: $limit) {
      _id
      contentType
      name
      createdAt
    }
  }
`;

const units = `
  query units ($searchValue:String) {
    units (searchValue:$searchValue) {
      ${unitField}
    }
  }
`;

const filemanagerGetAccessRequests = `
  query filemanagerGetAccessRequests($fileId: String!) {
    filemanagerGetAccessRequests(fileId: $fileId) {
      _id
      createdAt
      description
      fileId
      fromUserId
      status
    }
  }
`;

const filemanagerGetAckRequestByUser = `
  query filemanagerGetAckRequestByUser($fileId: String!) {
    filemanagerGetAckRequestByUser(fileId: $fileId) {
      _id
      createdAt
      description
      fileId
      fromUserId
      toUserId
      status
    }
  }
`;

const filemanagerGetAckRequests = `
  query filemanagerGetAckRequests($fileId: String!) {
    filemanagerGetAckRequests(fileId: $fileId) {
      _id
      createdAt
      description
      fileId
      fromUserId
      toUserId
      status
    }
  }
`;

export default {
  filemanagerFiles,
  filemanagerFolders,
  filemanagerFoldersTree,
  filemanagerLogs,
  filemanagerFileDetail,
  filemanagerFolderDetail,
  filemanagerGetAccessRequests,
  filemanagerGetAckRequestByUser,
  filemanagerGetAckRequests,
  documents,
  units
};
