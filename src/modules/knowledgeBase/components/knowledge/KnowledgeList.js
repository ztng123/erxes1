import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  ModalTrigger,
  EmptyState,
  Spinner
} from 'modules/common/components';
import { Sidebar } from 'modules/layout/components';
import { SidebarList } from 'modules/layout/styles';
import { RightButton } from 'modules/settings/styles';
import { KnowledgeForm } from '../../containers';
import { KnowledgeRow } from './';

const propTypes = {
  queryParams: PropTypes.object,
  currentCategoryId: PropTypes.string,
  currentTopic: PropTypes.object,
  save: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  count: PropTypes.number,
  loading: PropTypes.bool.isRequired,
  topics: PropTypes.array
};

class KnowledgeList extends Component {
  constructor(props) {
    super(props);

    this.renderSidebarList = this.renderSidebarList.bind(this);
  }

  renderForm(props) {
    return <KnowledgeForm {...props} />;
  }

  renderSidebarList() {
    const { topics, remove, save, currentCategoryId, queryParams } = this.props;

    return topics.map(topic => (
      <KnowledgeRow
        currentCategoryId={currentCategoryId}
        key={topic._id}
        topic={topic}
        queryParams={queryParams}
        remove={remove}
        save={save}
      />
    ));
  }

  renderSidebarHeader() {
    const { Header } = Sidebar;
    const { save } = this.props;

    const trigger = (
      <RightButton>
        <Icon icon="plus" />
      </RightButton>
    );

    return (
      <Header bold uppercase>
        Knowledge base
        <ModalTrigger title="Add Knowledge base" trigger={trigger}>
          {this.renderForm({ save })}
        </ModalTrigger>
      </Header>
    );
  }

  render() {
    const { count, loading } = this.props;
    return (
      <Sidebar wide header={this.renderSidebarHeader()}>
        <Sidebar.Section noBackground>
          <SidebarList>{this.renderSidebarList()}</SidebarList>
          {loading && <Spinner />}
          {count === 0 && (
            <EmptyState icon="briefcase" text="There is no channel" />
          )}
        </Sidebar.Section>
      </Sidebar>
    );
  }
}

KnowledgeList.propTypes = propTypes;

export default KnowledgeList;
