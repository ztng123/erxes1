import Button from 'modules/common/components/Button';
import ConditionsRule from 'modules/common/components/rule/ConditionsRule';
import { Step, Steps } from 'modules/common/components/step';
import {
  ControlWrapper,
  Indicator,
  StepWrapper
} from 'modules/common/components/step/styles';
import { IConditionsRule } from 'modules/common/types';
import { Alert } from 'modules/common/utils';
import { __ } from 'modules/common/utils';
import Wrapper from 'modules/layout/components/Wrapper';
import { ILeadData, ILeadIntegration } from '../types';

import React from 'react';
import { Link } from 'react-router-dom';

import { SmallLoader } from 'modules/common/components/ButtonMutate';
import { IFormData } from 'modules/forms/types';
import {
  Content,
  LeftContent,
  MessengerPreview
} from 'modules/settings/integrations/styles';
import { IField } from 'modules/settings/properties/types';
import {
  CallOut,
  ChooseType,
  FormStep,
  FullPreview,
  OptionStep,
  SuccessStep
} from './step';

type Props = {
  integration?: ILeadIntegration;
  loading?: boolean;
  isActionLoading: boolean;
  isReadyToSaveForm: boolean;
  afterFormDbSave: (formId: string) => void;
  save: (params: {
    name: string;
    brandId: string;
    languageCode?: string;
    leadData: ILeadData;
  }) => void;
};

type State = {
  type: string;
  brand?: string;
  language?: string;
  title?: string;
  calloutTitle?: string;
  bodyValue?: string;
  calloutBtnText?: string;
  theme: string;
  isRequireOnce?: boolean;
  logoPreviewUrl?: string;
  isSkip?: boolean;
  color: string;
  logoPreviewStyle?: { opacity?: string };
  defaultValue: { [key: string]: boolean };
  logo?: string;
  rules?: IConditionsRule[];
  isStepActive: boolean;
  formData: IFormData;

  successAction?: string;
  fromEmail?: string;
  userEmailTitle?: string;
  userEmailContent?: string;
  adminEmails?: string[];
  adminEmailTitle?: string;
  adminEmailContent?: string;
  thankContent?: string;
  redirectUrl?: string;
  carousel: string;
};

class Lead extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const integration = props.integration || ({} as ILeadIntegration);

    const { leadData = {} as ILeadData } = integration;
    const callout = leadData.callout || {};
    const form = integration.form || {};

    this.state = {
      type: leadData.loadType || 'shoutbox',
      successAction: leadData.successAction || '',
      fromEmail: leadData.fromEmail || '',
      userEmailTitle: leadData.userEmailTitle || '',
      userEmailContent: leadData.userEmailContent || '',
      adminEmails: leadData.adminEmails || [],
      adminEmailTitle: leadData.adminEmailTitle || '',
      adminEmailContent: leadData.adminEmailContent || '',
      thankContent: leadData.thankContent || 'Thank you.',
      redirectUrl: leadData.redirectUrl || '',
      rules: leadData.rules || [],
      isStepActive: false,

      brand: integration.brandId,
      language: integration.languageCode,
      title: integration.name,
      calloutTitle: callout.title || 'Title',
      bodyValue: callout.body || '',
      calloutBtnText: callout.buttonText || 'Start',
      color: '',
      logoPreviewStyle: {},
      defaultValue: {},
      logo: '',
      formData: {
        title: form.title || '',
        desc: form.description || '',
        btnText: form.buttonText || 'Send',
        fields: [],
        type: form.type || ''
      },
      theme: leadData.themeColor || '#6569DF',
      isRequireOnce: leadData.isRequireOnce,
      logoPreviewUrl: callout.featuredImage,
      isSkip: callout.skip && true,
      carousel: 'callout'
    };
  }

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { brand, calloutTitle, title, rules, formData } = this.state;

    if (!title) {
      return Alert.error('Enter a Pop up name');
    }

    if (!formData.title) {
      return Alert.error('Enter a Form title');
    }

    if (!brand) {
      return Alert.error('Choose a Brand');
    }

    const doc = {
      name: title,
      brandId: brand,
      languageCode: this.state.language,
      leadData: {
        loadType: this.state.type,
        successAction: this.state.successAction,
        fromEmail: this.state.fromEmail,
        userEmailTitle: this.state.userEmailTitle,
        userEmailContent: this.state.userEmailContent,
        adminEmails: this.state.adminEmails,
        adminEmailTitle: this.state.adminEmailTitle,
        adminEmailContent: this.state.adminEmailContent,
        thankContent: this.state.thankContent,
        redirectUrl: this.state.redirectUrl,
        themeColor: this.state.theme || this.state.color,
        callout: {
          title: calloutTitle,
          body: this.state.bodyValue,
          buttonText: this.state.calloutBtnText,
          featuredImage: this.state.logoPreviewUrl,
          skip: this.state.isSkip
        },
        rules: (rules || []).filter(rule => rule.condition && rule.value),
        isRequireOnce: this.state.isRequireOnce
      }
    };

    this.props.save(doc);
  };

  onChange = (key: string, value: any) => {
    this.setState({ [key]: value } as any);
  };

  onFormDocChange = formData => {
    this.setState({ formData });
  };

  onFormInit = (fields: IField[]) => {
    const formData = this.state.formData;
    formData.fields = fields;

    this.setState({ formData });
  };

  onStepClick = carousel => {
    return this.setState({ carousel });
  };

  renderButtons = () => {
    const { isActionLoading } = this.props;

    const cancelButton = (
      <Link to="/leads">
        <Button btnStyle="simple" icon="times-circle" uppercase={false}>
          Cancel
        </Button>
      </Link>
    );

    return (
      <Button.Group>
        {cancelButton}

        <Button
          disabled={isActionLoading}
          btnStyle="success"
          uppercase={false}
          icon={isActionLoading ? undefined : 'check-circle'}
          onClick={this.handleSubmit}
        >
          {isActionLoading && <SmallLoader />}
          Save
        </Button>
      </Button.Group>
    );
  };

  render() {
    const {
      calloutTitle,
      type,
      calloutBtnText,
      bodyValue,
      color,
      theme,
      logoPreviewUrl,
      thankContent,
      carousel,
      language,
      title,
      successAction,
      isSkip,
      rules,
      formData,
      isRequireOnce
    } = this.state;

    const { integration } = this.props;
    const leadData = integration && integration.leadData;
    const brand = integration && integration.brand;
    const breadcrumb = [{ title: __('Pop Ups'), link: '/leads' }];
    const constant = isSkip ? 'form' : carousel;

    return (
      <StepWrapper>
        <Wrapper.Header title={__('Pop ups')} breadcrumb={breadcrumb} />
        <Content>
          <LeftContent>
            <Steps>
              <Step
                img="/images/icons/erxes-04.svg"
                title="Type"
                onClick={this.onStepClick.bind(null, 'callout')}
              >
                <ChooseType
                  onChange={this.onChange}
                  type={type}
                  calloutTitle={calloutTitle}
                  calloutBtnText={calloutBtnText}
                  color={color}
                  theme={theme}
                />
              </Step>
              <Step
                img="/images/icons/erxes-03.svg"
                title="CallOut"
                onClick={this.onStepClick.bind(null, 'callout')}
              >
                <CallOut
                  onChange={this.onChange}
                  type={type}
                  calloutTitle={calloutTitle}
                  calloutBtnText={calloutBtnText}
                  bodyValue={bodyValue}
                  color={color}
                  theme={theme}
                  image={logoPreviewUrl}
                  skip={isSkip}
                />
              </Step>
              <Step
                img="/images/icons/erxes-12.svg"
                title={'Form'}
                onClick={this.onStepClick.bind(null, 'form')}
              >
                <FormStep
                  type={type}
                  color={color}
                  theme={theme}
                  formId={integration && integration.formId}
                  formData={formData}
                  afterDbSave={this.props.afterFormDbSave}
                  onDocChange={this.onFormDocChange}
                  onInit={this.onFormInit}
                  isReadyToSaveForm={this.props.isReadyToSaveForm}
                />
              </Step>
              <Step
                img="/images/icons/erxes-02.svg"
                title="Rule"
                onClick={this.onStepClick.bind(null, 'form')}
              >
                <ConditionsRule rules={rules || []} onChange={this.onChange} />
              </Step>
              <Step
                img="/images/icons/erxes-06.svg"
                title="Options"
                onClick={this.onStepClick.bind(null, 'form')}
              >
                <OptionStep
                  title={title}
                  type={type}
                  color={color}
                  brand={brand}
                  theme={theme}
                  language={language}
                  formData={formData}
                  isRequireOnce={isRequireOnce}
                  onChange={this.onChange}
                />
              </Step>
              <Step
                img="/images/icons/erxes-13.svg"
                title="Thank content"
                onClick={this.onStepClick.bind(null, 'sucess')}
                noButton={true}
              >
                <SuccessStep
                  onChange={this.onChange}
                  thankContent={thankContent}
                  type={type}
                  color={color}
                  theme={theme}
                  successAction={successAction}
                  leadData={leadData}
                  formId={integration && integration.formId}
                />
              </Step>
            </Steps>
            <ControlWrapper>
              <Indicator>
                {__('You are')} {integration ? 'editing' : 'creating'}{' '}
                <strong>{title}</strong> {__('pop up')}
              </Indicator>
              {this.renderButtons()}
            </ControlWrapper>
          </LeftContent>

          <MessengerPreview>
            <FullPreview
              onChange={this.onChange}
              calloutTitle={calloutTitle}
              calloutBtnText={calloutBtnText}
              bodyValue={bodyValue}
              type={type}
              color={color}
              theme={theme}
              image={logoPreviewUrl}
              thankContent={thankContent}
              skip={isSkip}
              carousel={constant}
              formData={formData}
            />
          </MessengerPreview>
        </Content>
      </StepWrapper>
    );
  }
}

export default Lead;
