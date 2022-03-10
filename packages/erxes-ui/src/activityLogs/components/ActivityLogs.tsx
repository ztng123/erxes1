import React from 'react';
import gql from 'graphql-tag';

import client from '@erxes/ui/src/apolloClient';
import { IUser } from '../../auth/types';
import DataWithLoader from '../../components/DataWithLoader';
import { Tabs, TabTitle } from '../../components/tabs';
import { ActivityContent } from '../../styles/main';
import { __ } from '../../utils';
import { queries } from '../graphql';
import { IActivityLog } from '../types';
import { hasAnyActivity } from '../utils';
import ActivityList from './ActivityList';

type Props = {
  activityLogs: IActivityLog[];
  currentUser: IUser;
  target?: string;
  loadingLogs: boolean;
  extraTabs: Array<{ name: string; label: string }>;
  activityRenderItem?: (
    activity: IActivityLog,
    currentUser?: IUser
  ) => React.ReactNode;
  contentId: string;
  contentType: string;
};

type State = {
  currentTab: string;
  activityLogs: IActivityLog[];
};

class ActivityLogs extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: 'activity',
      activityLogs: props.activityLogs
    };
  }

  onTabClick = (currentTab: string) => {
    const { contentId, contentType } = this.props;

    switch (currentTab) {
      case 'internal_note':
        client.query({
          query: gql(queries.internalNotesAsLogs),
          fetchPolicy: 'network-only',
          variables: { contentTypeId: contentId }
        }).then(({ data }) => {
          this.setState({ activityLogs: data.internalNotesAsLogs, currentTab });
        });

        break;
      case 'task':
        client.query({
          query: gql(queries.tasksAsLogs),
          fetchPolicy: 'network-only',
          variables: { contentId, contentType }
        }).then(({ data }) => {
          this.setState({ activityLogs: data.tasksAsLogs, currentTab });
        });

        break;
      case 'email':
        client.query({
          query: gql(queries.emailDeliveriesAsLogs),
          fetchPolicy: 'network-only',
          variables: { contentId }
        }).then(({ data }) => {
          this.setState({ activityLogs: data.emailDeliveriesAsLogs, currentTab });
        });

        break;
      default:
        client.query({
          query: gql(queries.activityLogs),
          fetchPolicy: 'network-only',
          variables: { contentId, contentType, activityType: currentTab }
        }).then(({ data }) => {
          this.setState({ activityLogs: data.activityLogs, currentTab });
        });

        break;
    }
  };

  renderTabContent() {
    const { currentTab, activityLogs } = this.state;
    const {
      currentUser,
      loadingLogs,
      target,
      activityRenderItem
    } = this.props;

    const hasActivity = hasAnyActivity(activityLogs);

    return (
      <ActivityContent isEmpty={!hasActivity}>
        <DataWithLoader
          loading={loadingLogs}
          count={!loadingLogs && hasActivity ? 1 : 0}
          data={
            <ActivityList
              user={currentUser}
              activities={activityLogs}
              target={target}
              type={currentTab}
              activityRenderItem={activityRenderItem}
            />
          }
          emptyText="No Activities"
          emptyImage="/images/actions/19.svg"
        />
      </ActivityContent>
    );
  }

  renderExtraTabs = () => {
    const { currentTab } = this.state;
    const { extraTabs } = this.props;

    return extraTabs.map(({ name, label }) => {
      return (
        <TabTitle
          key={Math.random()}
          className={currentTab === name ? 'active' : ''}
          onClick={this.onTabClick.bind(this, name)}
        >
          {__(label)}
        </TabTitle>
      );
    });
  };

  render() {
    const { currentTab } = this.state;

    return (
      <div>
        <Tabs grayBorder={true}>
          <TabTitle
            className={currentTab === 'activity' ? 'active' : ''}
            onClick={this.onTabClick.bind(this, 'activity')}
          >
            {__('Activity')}
          </TabTitle>
          <TabTitle
            className={currentTab === 'internal_note' ? 'active' : ''}
            onClick={this.onTabClick.bind(this, 'internal_note')}
          >
            {__('Notes')}
          </TabTitle>
          {this.renderExtraTabs()}
        </Tabs>

        {this.renderTabContent()}
      </div>
    );
  }
}

export default ActivityLogs;
