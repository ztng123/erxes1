import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Wrapper } from 'modules/layout/components';
import { BarItems } from 'modules/layout/styles';
import {
  Button,
  Table,
  Pagination,
  FormControl,
  DataWithLoader,
  CountsByTag
} from 'modules/common/components';
import { TaggerPopover } from 'modules/tags/components';
import { Row } from '/';

const propTypes = {
  integrations: PropTypes.array.isRequired,
  tags: PropTypes.array,
  bulk: PropTypes.array.isRequired,
  isAllSelected: PropTypes.bool,
  emptyBulk: PropTypes.func.isRequired,
  totalCount: PropTypes.number,
  tagsCount: PropTypes.object,
  toggleBulk: PropTypes.func.isRequired,
  toggleAll: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  remove: PropTypes.func
};

class List extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    const { toggleAll, integrations } = this.props;
    toggleAll(integrations, 'integrations');
  }

  renderRow() {
    const { integrations, remove, bulk, toggleBulk } = this.props;

    return integrations.map(integration => (
      <Row
        key={integration._id}
        isChecked={bulk.includes(integration)}
        toggleBulk={toggleBulk}
        integration={integration}
        remove={remove}
      />
    ));
  }

  render() {
    const {
      totalCount,
      tagsCount,
      loading,
      tags,
      bulk,
      emptyBulk,
      isAllSelected
    } = this.props;

    const { __ } = this.context;

    let actionBarLeft = null;

    if (bulk.length > 0) {
      const tagButton = (
        <Button btnStyle="simple" size="small" icon="downarrow">
          Tag
        </Button>
      );

      actionBarLeft = (
        <BarItems>
          <TaggerPopover
            type="integration"
            successCallback={emptyBulk}
            targets={bulk}
            trigger={tagButton}
          />
        </BarItems>
      );
    }

    const actionBarRight = (
      <Link to="/forms/create">
        <Button btnStyle="success" size="small" icon="add">
          {__('Create lead')}
        </Button>
      </Link>
    );

    const actionBar = (
      <Wrapper.ActionBar right={actionBarRight} left={actionBarLeft} />
    );

    const sidebar = (
      <Wrapper.Sidebar>
        <CountsByTag
          tags={tags}
          manageUrl={'tags/integration'}
          counts={tagsCount}
          loading={false}
        />;
      </Wrapper.Sidebar>
    );

    const content = (
      <Table whiteSpace="nowrap" hover>
        <thead>
          <tr>
            <th>
              <FormControl
                componentClass="checkbox"
                checked={isAllSelected}
                onChange={this.onChange}
              />
            </th>
            <th>{__('Name')}</th>
            <th>{__('Brand')}</th>
            <th>{__('Views')}</th>
            <th>{__('Conversion rate')}</th>
            <th>{__('Contacts gathered')}</th>
            <th>{__('Created at')}</th>
            <th>{__('Created by')}</th>
            <th>{__('Tags')}</th>
            <th>{__('Actions')}</th>
          </tr>
        </thead>
        <tbody id="integrations">{this.renderRow()}</tbody>
      </Table>
    );

    return (
      <Wrapper
        header={<Wrapper.Header breadcrumb={[{ title: __('Leads') }]} />}
        leftSidebar={sidebar}
        actionBar={actionBar}
        footer={<Pagination count={totalCount} />}
        content={
          <DataWithLoader
            data={content}
            loading={loading}
            count={totalCount}
            emptyText="There is no lead."
            emptyImage="/images/robots/robot-03.svg"
          />
        }
      />
    );
  }
}

List.propTypes = propTypes;
List.contextTypes = {
  __: PropTypes.func
};

export default List;
