import React from 'react';

import Button from "modules/common/components/Button";
import DataWithLoader from 'modules/common/components/DataWithLoader';
import EmptyState from 'modules/common/components/EmptyState';
import Wrapper from 'modules/layout/components/Wrapper';
import ModalTrigger from "modules/common/components/ModalTrigger";
import Pagination from 'modules/common/components/pagination/Pagination';
import Table from 'modules/common/components/table';
import { __ } from 'modules/common/utils';
import AppRow from './AppRow';
import AppForm from './AppForm';
import { IApp, IAppAddEditParams } from '../types';

const breadcrumb = [
  { title: 'Settings', link: '/settings' },
  { title: __('Apps') }
];

type Props = {
  apps: IApp[];
  isLoading: boolean;
  count: number;
  errorMessage: string;
  userGroups: any[];
  addApp: (doc: IAppAddEditParams) => void;
  editApp: (_id: string, doc: IAppAddEditParams) => void;
  removeApp: (_id: string) => void;
}

export default class AppList extends React.Component<Props> {
  renderObjects() {
    const { apps, removeApp } = this.props;
    const rows: JSX.Element[] = [];

    if (!apps) {
      return rows;
    }

    for (const app of apps) {
      rows.push(<AppRow key={app._id} app={app} removeApp={removeApp} />);
    }

    return rows;
  }

  renderContent() {
    return (
      <Table whiteSpace="wrap" hover={true} bordered={true} condensed={true}>
        <thead>
          <tr>
            <th>{__('Date')}</th>
            <th>{__('Name')}</th>
            <th>{__('User group')}</th>
            <th>{__('Action')}</th>
          </tr>
        </thead>
        <tbody>{this.renderObjects()}</tbody>
      </Table>
    );
  }

  render() {
    const { isLoading, count, errorMessage, userGroups, addApp, editApp } = this.props;

    if (errorMessage.indexOf('Permission required') !== -1) {
      return (
        <EmptyState
          text={__('Permission denied')}
          image="/images/actions/21.svg"
        />
      );
    }

    const trigger = (
      <Button
        id={"new-app-btn"}
        btnStyle="success"
        block={true}
        icon="plus-circle"
      >
        Add New App
      </Button>
    );

    const content = (props) => (
      <AppForm
        {...props}
        extended={true}
        userGroups={userGroups}
        addApp={addApp}
        editApp={editApp}
      />
    );

    const righActionBar = (
      <ModalTrigger
        size="lg"
        title="New App"
        autoOpenKey="showAppAddModal"
        trigger={trigger}
        content={content}
      />
    );

    return (
      <Wrapper
        header={<Wrapper.Header title={__('Apps')} breadcrumb={breadcrumb} />}
        footer={<Pagination count={count} />}
        actionBar={
          <Wrapper.ActionBar right={righActionBar} />
        }
        content={
          <DataWithLoader
            data={this.renderContent()}
            loading={isLoading}
            count={count}
            emptyText={__('There are no apps')}
            emptyImage="/images/actions/21.svg"
          />
        }
      />
    );
  }
}
