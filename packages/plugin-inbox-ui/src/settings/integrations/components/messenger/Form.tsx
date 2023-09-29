import { Alert, __ } from '@erxes/ui/src/utils';
import { Appearance, Availability, Greeting, Intro, Options } from './steps';
import {
  Content,
  LeftContent,
  MessengerPreview
} from '@erxes/ui-inbox/src/settings/integrations/styles';
import {
  ControlWrapper,
  Indicator,
  Preview,
  StepWrapper
} from '@erxes/ui/src/components/step/styles';
import {
  IIntegration,
  IMessages,
  IMessengerApps,
  IMessengerData,
  ISkillData,
  IUiOptions
} from '@erxes/ui-inbox/src/settings/integrations/types';
import { Step, Steps } from '@erxes/ui/src/components/step';

import AddOns from '../../containers/messenger/AddOns';
import Button from '@erxes/ui/src/components/Button';
import CommonPreview from './widgetPreview/CommonPreview';
import Connection from './steps/Connection';
import { IBrand } from '@erxes/ui/src/brands/types';
import { IUser } from '@erxes/ui/src/auth/types';
import { LANGUAGES } from '@erxes/ui-settings/src/general/constants';
import { Link } from 'react-router-dom';
import React from 'react';
import { SmallLoader } from '@erxes/ui/src/components/ButtonMutate';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { linkify } from '@erxes/ui-inbox/src/inbox/utils';

type Props = {
  teamMembers: IUser[];
  integration?: IIntegration;
  messengerApps?: IMessengerApps;
  brands: IBrand[];
  save: (params: {
    name: string;
    brandId: string;
    languageCode: string;
    channelIds?: string[];
    messengerData: IMessengerData;
    uiOptions: IUiOptions;
    messengerApps: IMessengerApps;
  }) => void;
  isLoading: boolean;
};

type State = {
  title: string;
  botEndpointUrl?: string;
  botShowInitialMessage?: boolean;
  skillData?: ISkillData;
  brandId: string;
  channelIds: string[];
  languageCode: string;
  color: string;
  textColor: string;
  wallpaper: string;
  notifyCustomer: boolean;
  supporterIds: string[];
  availabilityMethod: string;
  isOnline: boolean;
  timezone: string;
  responseRate: string;
  showTimezone: boolean;
  onlineHours: any;
  logo: string;
  logoPreviewStyle: any;
  logoPreviewUrl: string;
  facebook: string;
  twitter: string;
  youtube: string;
  messages: IMessages;
  isStepActive?: boolean;
  activeStep?: string;
  requireAuth?: boolean;
  showChat?: boolean;
  showLauncher?: boolean;
  hideWhenOffline?: boolean;
  forceLogoutWhenResolve?: boolean;
  showVideoCallRequest?: boolean;
  messengerApps: IMessengerApps;
};

class CreateMessenger extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const integration = props.integration || ({} as IIntegration);
    const languageCode = integration.languageCode || 'en';
    const configData = integration.messengerData || {
      skillData: undefined,
      notifyCustomer: false,
      requireAuth: true,
      showChat: true,
      showLauncher: true,
      hideWhenOffline: false,
      forceLogoutWhenResolve: false,
      showVideoCallRequest: false,
      botEndpointUrl: '',
      botShowInitialMessage: false
    };
    const links = configData.links || {};
    const messages = configData.messages || {};
    const uiOptions = integration.uiOptions || {};
    const channels = integration.channels || [];
    const messengerApps = props.messengerApps || {};

    this.state = {
      title: integration.name,
      botEndpointUrl: configData.botEndpointUrl,
      botShowInitialMessage: configData.botShowInitialMessage,
      skillData: configData.skillData,
      brandId: integration.brandId || '',
      languageCode,
      channelIds: channels.map(item => item._id) || [],
      color: uiOptions.color || '#6569DF',
      textColor: uiOptions.textColor || '#fff',
      wallpaper: uiOptions.wallpaper || '1',
      notifyCustomer: configData.notifyCustomer || false,
      requireAuth: configData.requireAuth,
      showChat: configData.showChat,
      showLauncher: configData.showLauncher,
      hideWhenOffline: configData.hideWhenOffline,
      forceLogoutWhenResolve: configData.forceLogoutWhenResolve,
      supporterIds: configData.supporterIds || [],
      availabilityMethod: configData.availabilityMethod || 'manual',
      isOnline: configData.isOnline || false,
      timezone: configData.timezone || '',
      responseRate: configData.responseRate || 'A few minutes',
      showTimezone: configData.showTimezone || false,
      onlineHours: (configData.onlineHours || []).map(h => ({
        _id: Math.random(),
        ...h
      })),
      showVideoCallRequest: configData.showVideoCallRequest,
      logo: uiOptions.logo || '',
      logoPreviewStyle: {},
      logoPreviewUrl: uiOptions.logo || '/images/erxes.png',
      facebook: links.facebook || '',
      twitter: links.twitter || '',
      youtube: links.youtube || '',
      messages: { ...this.generateMessages(messages) },
      messengerApps
    };
  }

  generateMessages(integrationMessages) {
    const messages = {};

    LANGUAGES.forEach(item => {
      const message = integrationMessages[item.value] || {};

      messages[item.value] = {
        greetings: {
          title:
            message && message.greetings ? message.greetings.title || '' : '',
          message:
            message && message.greetings ? message.greetings.message || '' : ''
        },
        welcome: message.welcome || '',
        away: message.away || '',
        thank: message.thank || ''
      };
    });

    return messages;
  }

  onChange = <T extends keyof State>(key: T, value: State[T]) => {
    this.setState(({ [key]: value } as unknown) as Pick<State, keyof State>);
  };

  handleMessengerApps = (messengerApps: IMessengerApps) => {
    this.setState({ messengerApps });
  };

  save = e => {
    e.preventDefault();

    const {
      title,
      botEndpointUrl,
      botShowInitialMessage,
      brandId,
      languageCode,
      channelIds,
      messages,
      facebook,
      twitter,
      youtube,
      requireAuth,
      showChat,
      showLauncher,
      hideWhenOffline,
      forceLogoutWhenResolve,
      showVideoCallRequest,
      messengerApps,
      skillData
    } = this.state;

    if (!languageCode) {
      return Alert.error('Set language');
    }

    if (!title) {
      return Alert.error('Insert integration name');
    }

    if (!brandId) {
      return Alert.error('Choose a brand');
    }

    if (channelIds.length < 1) {
      return Alert.error('Choose a channel');
    }

    if (messengerApps.websites && messengerApps.websites.length > 0) {
      for (const website of messengerApps.websites) {
        if (website.url === '') return Alert.error(`Set Website URL`);
        if (website.description === '')
          return Alert.error(`Set Website Description`);
        if (website.buttonText === '')
          return Alert.error(`Set Website Button Text`);
      }
    }

    if (skillData && Object.keys(skillData).length !== 0) {
      const skillOptions = (skillData as ISkillData).options || [];

      if (skillOptions.length === 0) {
        return Alert.error('Please add skill options');
      }

      if (skillOptions.length === 1) {
        return Alert.error('Please add more than one skill option');
      }

      for (const option of skillOptions) {
        if (!option.label || !option.skillId) {
          return Alert.error('Please select skill or enter label');
        }
      }
    }

    const links = {
      facebook: linkify(facebook),
      twitter: linkify(twitter),
      youtube: linkify(youtube)
    };

    this.props.save({
      name: title,
      brandId,
      channelIds,
      languageCode: this.state.languageCode,
      messengerData: {
        skillData,
        botEndpointUrl,
        botShowInitialMessage,
        notifyCustomer: this.state.notifyCustomer,
        availabilityMethod: this.state.availabilityMethod,
        isOnline: this.state.isOnline,
        timezone: this.state.timezone,
        responseRate: this.state.responseRate,
        showTimezone: this.state.showTimezone,
        onlineHours: (this.state.onlineHours || []).map(oh => ({
          day: oh.day,
          from: oh.from,
          to: oh.to
        })),
        supporterIds: this.state.supporterIds,
        messages,
        requireAuth,
        showChat,
        showLauncher,
        hideWhenOffline,
        forceLogoutWhenResolve,
        showVideoCallRequest,
        links
      },
      uiOptions: {
        color: this.state.color,
        textColor: this.state.textColor,
        wallpaper: this.state.wallpaper,
        logo: this.state.logo
      },
      messengerApps
    });
  };

  onStepClick = name => {
    this.setState({
      isStepActive:
        name === 'greeting' || name === 'hours' || name === 'addon'
          ? true
          : false,
      activeStep: name
    });
  };

  renderButtons() {
    const { isLoading } = this.props;

    const cancelButton = (
      <Link to="/settings/integrations">
        <Button btnStyle="simple" icon="times-circle">
          Cancel
        </Button>
      </Link>
    );

    return (
      <Button.Group>
        {cancelButton}
        <Button
          disabled={isLoading}
          btnStyle="success"
          icon={isLoading ? undefined : 'check-circle'}
          onClick={this.save}
        >
          {isLoading && <SmallLoader />}
          Save
        </Button>
      </Button.Group>
    );
  }

  render() {
    const {
      title,
      botEndpointUrl,
      botShowInitialMessage,
      supporterIds,
      isOnline,
      availabilityMethod,
      onlineHours,
      timezone,
      responseRate,
      showTimezone,
      color,
      textColor,
      logoPreviewUrl,
      wallpaper,
      brandId,
      languageCode,
      notifyCustomer,
      logoPreviewStyle,
      facebook,
      twitter,
      youtube,
      messages,
      isStepActive,
      activeStep,
      requireAuth,
      showChat,
      showLauncher,
      hideWhenOffline,
      forceLogoutWhenResolve,
      showVideoCallRequest,
      channelIds,
      skillData,
      messengerApps
    } = this.state;

    const { integration } = this.props;
    const message = messages[languageCode];

    const breadcrumb = [
      { title: __('Settings'), link: '/settings' },
      { title: __('Integrations'), link: '/settings/integrations' },
      { title: __('Messenger') }
    ];

    return (
      <StepWrapper>
        <Wrapper.Header title={__('Messenger')} breadcrumb={breadcrumb} />
        <Content>
          <LeftContent>
            <Steps>
              <Step
                img="/images/icons/erxes-04.svg"
                title="Appearance"
                onClick={this.onStepClick.bind(null, 'appearance')}
              >
                <Appearance
                  onChange={this.onChange}
                  color={color}
                  textColor={textColor}
                  logoPreviewUrl={logoPreviewUrl}
                  wallpaper={wallpaper}
                />
              </Step>

              <Step
                img="/images/icons/erxes-09.svg"
                title="Greeting"
                onClick={this.onStepClick.bind(null, 'greeting')}
              >
                <Greeting
                  teamMembers={this.props.teamMembers}
                  onChange={this.onChange}
                  supporterIds={supporterIds}
                  messages={messages}
                  facebook={facebook}
                  languageCode={languageCode}
                  twitter={twitter}
                  youtube={youtube}
                />
              </Step>

              <Step
                img="/images/icons/erxes-07.svg"
                title="Intro"
                onClick={this.onStepClick.bind(null, 'intro')}
              >
                <Intro
                  skillData={skillData}
                  onChange={this.onChange}
                  messages={messages}
                  languageCode={languageCode}
                />
              </Step>

              <Step
                img="/images/icons/erxes-03.svg"
                title={__('Hours & Availability')}
                onClick={this.onStepClick.bind(null, 'hours')}
              >
                <Availability
                  onChange={this.onChange}
                  isOnline={isOnline}
                  availabilityMethod={availabilityMethod}
                  timezone={timezone}
                  responseRate={responseRate}
                  showTimezone={showTimezone}
                  onlineHours={onlineHours}
                  hideWhenOffline={hideWhenOffline}
                />
              </Step>

              <Step
                img="/images/icons/erxes-06.svg"
                title="Default Settings"
                onClick={this.onStepClick.bind(null, 'default')}
              >
                <Options
                  onChange={this.onChange}
                  notifyCustomer={notifyCustomer}
                  languageCode={languageCode}
                  requireAuth={requireAuth}
                  showChat={showChat}
                  showLauncher={showLauncher}
                  forceLogoutWhenResolve={forceLogoutWhenResolve}
                  showVideoCallRequest={showVideoCallRequest}
                />
              </Step>

              <Step
                img="/images/icons/erxes-16.svg"
                title={__('Integration Setup')}
                onClick={this.onStepClick.bind(null, 'setup')}
              >
                <Connection
                  title={title}
                  botEndpointUrl={botEndpointUrl}
                  botShowInitialMessage={botShowInitialMessage}
                  channelIds={channelIds}
                  brandId={brandId}
                  onChange={this.onChange}
                />
              </Step>
              <Step
                img="/images/icons/erxes-15.svg"
                title={__('Add Ons')}
                onClick={this.onStepClick.bind(null, 'addon')}
                noButton={true}
              >
                <AddOns
                  selectedBrand={brandId}
                  websiteMessengerApps={
                    integration && integration.websiteMessengerApps
                  }
                  leadMessengerApps={
                    integration && integration.leadMessengerApps
                  }
                  knowledgeBaseMessengerApps={
                    integration && integration.knowledgeBaseMessengerApps
                  }
                  handleMessengerApps={this.handleMessengerApps}
                />
              </Step>
            </Steps>
            <ControlWrapper>
              <Indicator>
                {__('You are')}{' '}
                {this.props.integration ? 'editing' : 'creating'}{' '}
                <strong>{title}</strong> {__('integration')}
              </Indicator>
              {this.renderButtons()}
            </ControlWrapper>
          </LeftContent>

          <MessengerPreview>
            <Preview fullHeight={true}>
              <CommonPreview
                teamMembers={this.props.teamMembers}
                message={message}
                supporterIds={supporterIds}
                isOnline={isOnline}
                wallpaper={wallpaper}
                color={color}
                textColor={textColor}
                skillData={skillData}
                brands={this.props.brands}
                brandId={brandId}
                timezone={timezone}
                showTimezone={showTimezone}
                responseRate={responseRate}
                logoPreviewStyle={logoPreviewStyle}
                logoPreviewUrl={logoPreviewUrl}
                showChatPreview={isStepActive}
                activeStep={activeStep}
                showVideoCallRequest={showVideoCallRequest}
                messengerApps={messengerApps}
                facebook={facebook}
                twitter={twitter}
                youtube={youtube}
              />
            </Preview>
          </MessengerPreview>
        </Content>
      </StepWrapper>
    );
  }
}

export default CreateMessenger;
