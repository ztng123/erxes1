import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ModalTrigger, Button } from 'modules/common/components';
import { Wrapper } from 'modules/layout/components';
import { PropertyGroupForm, PropertyForm } from '../containers';
import { Sidebar, PropertyRow } from './';
import { PropertyList } from '../styles';

const propTypes = {
  queryParams: PropTypes.object,
  refetch: PropTypes.func,
  fieldsgroups: PropTypes.array,
  currentType: PropTypes.string,
  loading: PropTypes.bool,
  removePropertyGroup: PropTypes.func
};

class Properties extends Component {
  constructor(props) {
    super(props);

    this.renderProperties = this.renderProperties.bind(this);
  }

  renderProperties() {
    const { fieldsgroups, queryParams, removePropertyGroup } = this.props;

    return (
      <PropertyList>
        {fieldsgroups.map(group => {
          return (
            <PropertyRow
              key={group._id}
              group={group}
              queryParams={queryParams}
              remove={removePropertyGroup}
            />
          );
        })}
      </PropertyList>
    );
  }

  renderTrigger(text) {
    return (
      <Button btnStyle="success" size="small" icon="plus">
        {text}
      </Button>
    );
  }

  renderActionBar() {
    const { queryParams } = this.props;

    return (
      <div>
        <ModalTrigger
          title="Add Group"
          trigger={this.renderTrigger('Add Property Group')}
          size="lg"
        >
          <PropertyGroupForm queryParams={queryParams} />
        </ModalTrigger>
        <ModalTrigger
          title="Add Property"
          trigger={this.renderTrigger('Add Property')}
          size="lg"
        >
          <PropertyForm queryParams={queryParams} />
        </ModalTrigger>
      </div>
    );
  }

  render() {
    const { currentType } = this.props;

    const breadcrumb = [
      { title: 'Settings', link: '/settings' },
      { title: 'Properties', link: '/settings/properties' },
      { title: `${currentType}` }
    ];

    return (
      <Wrapper
        actionBar={<Wrapper.ActionBar right={this.renderActionBar()} />}
        header={<Wrapper.Header breadcrumb={breadcrumb} />}
        leftSidebar={<Sidebar />}
        content={this.renderProperties()}
      />
    );
  }
}

Properties.propTypes = propTypes;

export default Properties;
