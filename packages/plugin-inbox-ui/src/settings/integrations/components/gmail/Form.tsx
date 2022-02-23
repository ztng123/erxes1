import Button from '@erxes/ui/src/components/Button';
import FormControl from '@erxes/ui/src/components/form/Control';
import Form from '@erxes/ui/src/components/form/Form';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import Info from '@erxes/ui/src/components/Info';
import { Step, Steps } from '@erxes/ui/src/components/step';
import {
  ControlWrapper,
  FlexItem,
  Indicator,
  LeftItem,
  Preview,
  StepWrapper
} from '@erxes/ui/src/components/step/styles';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import { __ } from 'coreui/utils';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import * as React from 'react';
import { Link } from 'react-router-dom';
import Accounts from '../../containers/Accounts';
import SelectBrand from '@erxes/ui-settings/src/integrations/containers/SelectBrand';
import SelectChannels from '@erxes/ui-settings/src/integrations/containers/SelectChannels';
import { Content } from '@erxes/ui-settings/src/integrations/styles';
import { ImageWrapper, MessengerPreview, TextWrapper } from '@erxes/ui-inbox/src/settings/integrations/styles';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  onAccountSelect: (accountId?: string) => void;
  onRemoveAccount: (accountId: string) => void;
  callBack: () => void;
  accountId: string;
  email: string;
};

type State = {
  channelIds: string[];
};

class Gmail extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      channelIds: []
    };
  }

  generateDoc = (values: { name: string; brandId: string }) => {
    const { accountId, email } = this.props;

    return {
      ...values,
      kind: 'gmail',
      accountId,
      channelIds: this.state.channelIds,
      data: { email }
    };
  };

  channelOnChange = (values: string[]) => {
    this.setState({ channelIds: values } as Pick<State, keyof State>);
  };

  renderContent = (formProps: IFormProps) => {
    const { onRemoveAccount, onAccountSelect, renderButton } = this.props;
    const { values, isSubmitted } = formProps;

    return (
      <>
        <Steps active={1}>
          <Step img='/images/icons/erxes-01.svg' title='Connect Account'>
            <FlexItem>
              <LeftItem>
                <FormGroup>
                  <Info>
                    <strong>
                      {__('Email add account description question')}
                    </strong>
                    <br />
                    {__('Email add account description')}
                  </Info>
                </FormGroup>

                <Accounts
                  kind='gmail'
                  addLink='gmail/login'
                  onSelect={onAccountSelect}
                  onRemove={onRemoveAccount}
                  formProps={formProps}
                />
              </LeftItem>
            </FlexItem>
          </Step>

          <Step
            img='/images/icons/erxes-16.svg'
            title='Integration Setup'
            noButton={true}
          >
            <FlexItem>
              <LeftItem>
                <FormGroup>
                  <ControlLabel required={true}>Integration Name</ControlLabel>
                  <p>
                    {__('Name this integration to differentiate from the rest')}
                  </p>
                  <FormControl
                    {...formProps}
                    name='name'
                    required={true}
                    autoFocus={true}
                  />
                </FormGroup>

                <SelectBrand
                  isRequired={true}
                  formProps={formProps}
                  description={__(
                    'Which specific Brand does this integration belong to?'
                  )}
                />

                <SelectChannels
                  defaultValue={this.state.channelIds}
                  isRequired={true}
                  onChange={this.channelOnChange}
                />
              </LeftItem>
            </FlexItem>
          </Step>
        </Steps>
        <ControlWrapper>
          <Indicator>
            {__('You are creating')}
            <strong> {__('Gmail')}</strong> {__('integration')}
          </Indicator>
          <Button.Group>
            <Link to='/settings/integrations'>
              <Button btnStyle='simple' icon='times-circle'>
                Cancel
              </Button>
            </Link>
            {renderButton({
              name: 'integration',
              values: this.generateDoc(values),
              isSubmitted,
              callback: this.props.callBack
            })}
          </Button.Group>
        </ControlWrapper>
      </>
    );
  };

  renderForm = () => {
    return <Form renderContent={this.renderContent} />;
  };

  render() {
    const title = __('Gmail');

    const breadcrumb = [
      { title: __('Settings'), link: '/settings' },
      { title: __('App store'), link: '/settings/integrations' },
      { title }
    ];

    return (
      <StepWrapper>
        <Wrapper.Header title={title} breadcrumb={breadcrumb} />
        <Content>
          {this.renderForm()}

          <MessengerPreview>
            <Preview fullHeight={true}>
              <ImageWrapper>
                <TextWrapper>
                  <h1>
                    {__('Connect your')} {title}
                  </h1>
                  <p>
                    {__(
                      'Connect your Gmail to start receiving emails in your team inbox'
                    )}
                  </p>
                  <img alt={title} src='/images/previews/facebook.png' />
                </TextWrapper>
              </ImageWrapper>
            </Preview>
          </MessengerPreview>
        </Content>
      </StepWrapper>
    );
  }
}

export default Gmail;
