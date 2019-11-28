import gql from 'graphql-tag';
import Spinner from 'modules/common/components/Spinner';
import { Alert, withProps } from 'modules/common/utils';
import { queries as messageQueries } from 'modules/inbox/graphql';
import { IMail } from 'modules/inbox/types';
import { mutations, queries } from 'modules/settings/integrations/graphql';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import MailForm from '../../components/mail/MailForm';
import { IntegrationsQueryResponse } from '../../types';
import {
  defaultCustomerFields,
  defaultMailFields,
  defaultMessageFields
} from './constants';

type Props = {
  integrationId?: string;
  conversationId?: string;
  refetchQueries?: string[];
  fromEmail?: string;
  kind: string;
  mailData?: IMail;
  isReply?: boolean;
  toggleReply?: () => void;
  closeModal?: () => void;
  closeReply?: () => void;
};

type FinalProps = {
  sendMailMutation: any;
  integrationsQuery: IntegrationsQueryResponse;
} & Props;

const MailFormContainer = (props: FinalProps) => {
  const {
    mailData,
    integrationId,
    integrationsQuery,
    fromEmail,
    kind,
    conversationId,
    isReply,
    toggleReply,
    closeModal,
    closeReply,
    sendMailMutation
  } = props;

  if (integrationsQuery.loading) {
    return <Spinner objective={true} />;
  }

  const integrations = integrationsQuery.integrations || [];

  const save = ({
    variables,
    optimisticResponse,
    update
  }: {
    variables: any;
    optimisticResponse?: any;
    update?: any;
  }) => {
    return sendMailMutation({ variables, optimisticResponse, update })
      .then(() => {
        Alert.success('You have successfully sent a email');

        if (closeModal) {
          closeModal();
        }
      })
      .catch(e => {
        Alert.error(e);

        if (closeModal) {
          closeModal();
        }
      });
  };

  const sendMail = ({ variables }: { variables: any }) => {
    if (!isReply) {
      return save({ variables });
    }

    const email = mailData ? mailData.integrationEmail : '';

    const integrationSendMail = {
      _id: Math.round(Math.random() * -1000000),
      ...defaultMessageFields,
      conversationId,
      content: variables.body,
      customer: {
        ...defaultCustomerFields,
        firstName: email,
        primaryEmail: email
      },
      mailData: {
        ...defaultMailFields,
        bcc: [{ __typename: 'Email', email: variables.bcc }],
        to: [{ __typename: 'Email', email: variables.to }],
        from: [{ __typename: 'Email', email: variables.to }],
        cc: [{ __typename: 'Email', email: variables.cc }],
        body: variables.body,
        subject: variables.subject,
        attachments: variables.attachments,
        integrationEmail: variables.from
      }
    };

    const optimisticResponse = { __typename: 'Mutation', integrationSendMail };

    const update = store => {
      const selector = {
        query: gql(messageQueries.conversationMessages),
        variables: { conversationId, limit: 10 }
      };

      // Read the data from our cache for this query.
      try {
        const data = store.readQuery(selector);
        const messages = data.conversationMessages || [];

        messages.push(integrationSendMail);

        // Write our data back to the cache.
        store.writeQuery({ ...selector, data });

        if (closeReply) {
          closeReply();
        }
      } catch (e) {
        Alert.error(e);
        return;
      }
    };

    // Invoke mutation
    return save({ variables, optimisticResponse, update });
  };

  const updatedProps = {
    sendMail,
    integrations,
    integrationId,
    fromEmail,
    closeModal,
    kind,
    isReply,
    toggleReply,
    mailData
  };

  return <MailForm {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, IntegrationsQueryResponse, { kind: string }>(
      gql(queries.integrations),
      {
        name: 'integrationsQuery',
        options: ({ kind }) => {
          return {
            variables: { kind },
            fetchPolicy: 'network-only'
          };
        }
      }
    ),
    graphql<Props>(gql(mutations.integrationSendMail), {
      name: 'sendMailMutation'
    })
  )(MailFormContainer)
);
