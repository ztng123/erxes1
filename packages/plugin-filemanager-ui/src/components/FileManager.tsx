import React, { useState } from 'react';

import { BarItems } from '@erxes/ui/src/layout';
import BreadCrumb from '@erxes/ui/src/components/breadcrumb/BreadCrumb';
import Button from '@erxes/ui/src/components/Button';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import EmptyState from '@erxes/ui/src/components/EmptyState';
import FileFormContainer from '../containers/file/FileForm';
import FileList from '../containers/file/FileList';
import FolderForm from '../containers/folder/FolderForm';
import FolderList from '../containers/folder/FolderList';
import FormControl from '@erxes/ui/src/components/form/Control';
import { IFolder } from '../types';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import ShareForm from '../containers/ShareForm';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __ } from 'coreui/utils';

type Props = {
  queryParams: any;
  currentFolder: IFolder;
  filemanagerFolders: IFolder[];
  folderQueryLoading: boolean;
};

function FileManager({
  queryParams,
  currentFolder,
  filemanagerFolders,
  folderQueryLoading
}: Props) {
  console.log('cccc', currentFolder);
  const [parentId, setParentId] = useState(
    queryParams._id ? queryParams._id : ''
  );

  const breadcrumb = [{ title: __('File Managers') }];

  const fileBreadcrumb = [
    // {
    //   title: __(`${currentFolder.name} `),
    //   link: `/filemanager?_id=${currentFolder._id}`,
    // },
    {
      title: __(`Files`)
    }
  ];

  const trigger = (
    <Button btnStyle="success" icon="plus-circle" size="small">
      Add File
    </Button>
  );

  const folderTrigger = (
    <Button btnStyle="primary" icon="plus-circle" size="small">
      Add Sub Folder
    </Button>
  );

  const shareTrigger = (
    <Button btnStyle="primary" icon="share-alt" type="button">
      {__('Share')}
    </Button>
  );

  const shareContent = props => <ShareForm {...props} item={{}} />;

  const content = props => (
    <FileFormContainer {...props} queryParams={queryParams} />
  );

  const folderContent = props => (
    <FolderForm {...props} queryParams={queryParams} />
  );

  const actionBarRight = (
    <BarItems>
      <FormControl
        type="text"
        placeholder={__('Type to search')}
        // onChange={this.search}
        // value={this.state.searchValue}
        // onFocus={this.moveCursorAtTheEnd}
      />

      <ModalTrigger
        title="Share Folder"
        trigger={shareTrigger}
        content={shareContent}
        centered={true}
        enforceFocus={false}
      />

      <ModalTrigger
        title="Add Sub Folder"
        trigger={folderTrigger}
        content={folderContent}
        centered={true}
        enforceFocus={false}
      />

      <ModalTrigger
        title="Add File"
        trigger={trigger}
        hideHeader={true}
        content={content}
        centered={true}
        enforceFocus={false}
      />
    </BarItems>
  );

  return (
    <Wrapper
      header={
        <Wrapper.Header title={__('FileManager')} breadcrumb={breadcrumb} />
      }
      leftSidebar={
        <FolderList
          queryParams={queryParams}
          parentFolderId={parentId}
          setParentId={setParentId}
          filemanagerFolders={filemanagerFolders}
          loading={folderQueryLoading}
        />
      }
      actionBar={
        <Wrapper.ActionBar
          left={<BreadCrumb breadcrumbs={fileBreadcrumb} />}
          right={actionBarRight}
        />
      }
      content={
        <DataWithLoader
          data={
            <FileList
              queryParams={queryParams}
              // currentFolderId={currentFolder._id}
            />
          }
          loading={false}
          count={100}
          emptyContent={
            <EmptyState
              image="/images/actions/5.svg"
              text="No folders at the moment!"
            />
          }
        />
      }
      transparent={true}
      hasBorder={true}
    />
  );
}

export default FileManager;
