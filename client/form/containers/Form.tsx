import * as React from 'react';
import { graphql, ChildProps } from 'react-apollo';
import gql from 'graphql-tag';
import { Form as DumbForm } from '../components';
import { AppConsumer } from './AppContext';
import { ICurrentStatus, IForm } from '../types';
import { IEmailParams, IIntegration } from '../../types';

const Form = (props: ChildProps<Props, QueryResponse>) => {
  const data = props.data;

  if (!data || data.loading) {
    return null;
  }

  if (!data.form) {
    return null;
  }

  const extendedProps = {
    ...props,
    form: data.form,
  };

  return <DumbForm {...extendedProps} />;
};

type QueryResponse = {
  form: IForm
}

interface Props {
  integration: IIntegration,
  form: IForm,
  currentStatus: ICurrentStatus,
  onSubmit: (e: React.FormEvent<HTMLButtonElement>) => void,
  onCreateNew: () => void,
  setHeight: () => void,
  sendEmail: (params: IEmailParams) => void,
}

const FormWithData = graphql<Props, QueryResponse>(
  gql`
    query form($formId: String) {
      form(formId: $formId) {
        title
        description
        buttonText
        themeColor

        fields {
          _id
          formId
          name
          type
          check
          text
          description
          options
          isRequired
          order
          validation
        }
      }
    }
  `,

  {
    options: ({ form }) => ({
      fetchPolicy: 'network-only',
      variables: {
        formId: form._id,
      },
    }),
  },
)(Form);

const WithContext = () => (
  <AppConsumer>
    {({ currentStatus, saveForm, createNew, sendEmail, setHeight, getIntegration, getForm }) => {
      const integration = getIntegration();
      const form = getForm();

      return (
        <FormWithData
          currentStatus={currentStatus}
          onSubmit={saveForm}
          onCreateNew={createNew}
          sendEmail={sendEmail}
          setHeight={setHeight}
          form={form}
          integration={integration}
        />
      );
    }
    }
  </AppConsumer>
)

export default WithContext;