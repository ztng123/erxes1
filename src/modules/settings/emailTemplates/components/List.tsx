import { Table } from 'modules/common/components';
import { __ } from 'modules/common/utils';
import * as React from 'react';
import styled from 'styled-components';
import { List, RowActions } from '../../common/components';
import { ICommonListProps } from '../../common/types';
import Form from './Form';

const IframePreview = styled.div`
  width: 140px;
  height: 100px;
  overflow: hidden;
  border: 1px solid #ddd;
  border-radius: 4px;

  iframe {
    transform: scale(0.2);
    transform-origin: 0 0;
    pointer-events: none;
    width: 510%;
    height: 500%;
    border: 0;
  }
`;

class EmailTemplateList extends React.Component<ICommonListProps> {
  renderForm = props => {
    return <Form {...props} />;
  };

  renderRows({ objects }) {
    return objects.map((object, index) => (
      <tr key={index}>
        <td>
          <IframePreview>
            <iframe title="content-iframe" srcDoc={object.content} />
          </IframePreview>
        </td>
        <td>{object.name}</td>

        <RowActions
          {...this.props}
          object={object}
          renderForm={this.renderForm}
        />
      </tr>
    ));
  }

  renderContent = props => {
    return (
      <Table>
        <thead>
          <tr>
            <th />
            <th>{__('Name')}</th>
            <th>{__('Actions')}</th>
          </tr>
        </thead>
        <tbody>{this.renderRows(props)}</tbody>
      </Table>
    );
  };

  render() {
    return (
      <List
        title="New email template"
        breadcrumb={[
          { title: __('Settings'), link: '/settings' },
          { title: __('Email templates') }
        ]}
        renderActionBarLeft={[
          {
            title: 'Email templates',
            icon: '/images/actions/22.svg',
            description: `It's all about thinking ahead for your customers. Team members will be able to choose from email templates and send out one message to multiple recipients. You can use the email templates to send out a Mass email for leads/customers or you can send to other team members.`
          }
        ]}
        renderForm={this.renderForm}
        renderContent={this.renderContent}
        center={true}
        {...this.props}
      />
    );
  }
}

export default EmailTemplateList;
