import TaggerPopover from '@erxes/ui/src/tags/components/TaggerPopover';
import React from 'react';
import { refetchSidebarConversationsOptions } from '@erxes/ui-inbox/src/inbox/utils';
import { InboxManagementActionConsumer } from './InboxCore';
import { TAG_TYPES } from '@erxes/ui/src/tags/constants';

const Tagger = props => {
  const { refetchQueries } = refetchSidebarConversationsOptions();

  return (
    <InboxManagementActionConsumer>
      {({ notifyConsumersOfManagementAction }) => (
        <TaggerPopover
          {...props}
          type={TAG_TYPES.CONVERSATION}
          refetchQueries={refetchQueries}
          successCallback={notifyConsumersOfManagementAction}
        />
      )}
    </InboxManagementActionConsumer>
  );
};

export default Tagger;
