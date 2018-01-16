import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Pagination,
  ModalTrigger,
  Button,
  DataWithLoader
} from 'modules/common/components';
import { Header, PageContent, ActionBar } from 'modules/layout/components';

const propTypes = {
  objects: PropTypes.array.isRequired,
  remove: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  totalCount: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired
};

class List extends Component {
  constructor(props) {
    super(props);

    this.renderObjects = this.renderObjects.bind(this);
  }

  renderObjects() {
    const { objects, remove, save, refetch } = this.props;

    return objects.map(object =>
      this.renderRow({
        key: object._id,
        object,
        remove,
        refetch,
        save
      })
    );
  }

  render() {
    const { totalCount, save, loading } = this.props;

    const trigger = (
      <Button btnStyle="success" size="small" icon="plus">
        {this.title}
      </Button>
    );

    const actionBarLeft = (
      <ModalTrigger title={this.title} size={this.size} trigger={trigger}>
        {this.renderForm({ save })}
      </ModalTrigger>
    );

    return [
      <Header key="breadcrumb" breadcrumb={this.breadcrumb()} />,
      <PageContent
        key="settings-content"
        actionBar={<ActionBar right={actionBarLeft} />}
        footer={<Pagination count={totalCount} />}
        transparent={false}
      >
        <DataWithLoader
          data={this.renderContent()}
          loading={loading}
          count={totalCount}
          emptyText="There is no data."
          emptyImage="/images/robots/robot-05.svg"
        />
      </PageContent>
    ];
  }
}

List.propTypes = propTypes;

export default List;
