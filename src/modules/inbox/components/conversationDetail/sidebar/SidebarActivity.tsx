import { ActivityList } from 'modules/activityLogs/components';
import { IUser } from 'modules/auth/types';
import { DataWithLoader } from 'modules/common/components';
import { __ } from 'modules/common/utils';
import { ICustomer } from 'modules/customers/types';
import { hasAnyActivity } from 'modules/customers/utils';
import { Form as NoteForm } from 'modules/internalNotes/containers';
import * as React from 'react';
import { ActivityLogContent, ActivityNote } from './styles';

type Props = {
  customer: ICustomer;
  loadingLogs: boolean;
  activityLogsCustomer: any[];
  currentSubTab: string;
  currentUser: IUser;
};

class SidebarActivity extends React.Component<Props> {
  render() {
    const {
      customer,
      activityLogsCustomer,
      loadingLogs,
      currentUser,
      currentSubTab
    } = this.props;
    const hasActivity = hasAnyActivity(activityLogsCustomer);

    return (
      <React.Fragment>
        <ActivityNote>
          <span>{__('New note') as string}:</span>
          <NoteForm contentType="customer" contentTypeId={customer._id} />
        </ActivityNote>

        <ActivityLogContent isEmpty={!hasActivity}>
          <DataWithLoader
            loading={loadingLogs}
            count={!loadingLogs && hasActivity ? 1 : 0}
            data={
              <ActivityList
                user={currentUser}
                activities={activityLogsCustomer}
                target={customer.firstName}
                type={currentSubTab} // show logs filtered by type
              />
            }
            emptyText="No Activities"
            emptyImage="/images/robots/robot-03.svg"
          />
        </ActivityLogContent>
      </React.Fragment>
    );
  }
}

export default SidebarActivity;
