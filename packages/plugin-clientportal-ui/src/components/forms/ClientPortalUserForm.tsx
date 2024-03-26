import AvatarUpload from '@erxes/ui/src/components/AvatarUpload';
import { IUser } from '@erxes/ui/src/auth/types';
import Button from '@erxes/ui/src/components/Button';
import CollapseContent from '@erxes/ui/src/components/CollapseContent';
import { Form } from '@erxes/ui/src/components/form';
import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import SelectCompanies from '@erxes/ui-contacts/src/companies/containers/SelectCompanies';
import {
  FormColumn,
  FormWrapper,
  ModalFooter,
  ScrollWrapper
} from '@erxes/ui/src/styles/main';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import { __ } from 'coreui/utils';
import React from 'react';

import { USER_LOGIN_TYPES } from '../../constants';
import {
  ClientPortalConfig,
  IClientPortalUser,
  IClientPortalUserDoc
} from '../../types';

type Props = {
  currentUser: IUser;
  clientPortalUser?: IClientPortalUser;
  closeModal: () => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  clientPortalGetConfigs: ClientPortalConfig[];
};

type State = {
  ownerId: string;
  isSubscribed: string;
  hasAuthority: string;
  users: IUser[];
  avatar: string;
  phone?: string;
  email?: string;
  type: string;
  erxesCompanyId?: string;
  req: boolean;
  activeSections: any;
  password?: string;
  disableVerificationMail?: boolean;
  clientPortalId: string;
};

class CustomerForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const clientPortalUser =
      props.clientPortalUser || ({} as IClientPortalUser);
    const userId = props.currentUser ? props.currentUser._id : '';

    const activeSections = {
      renderClientPortalUser: false,
      renderClientPortalCompany: false
    };

    this.state = {
      type: clientPortalUser.type || 'customer',
      ownerId: clientPortalUser.ownerId || userId,
      isSubscribed: clientPortalUser.isSubscribed || 'Yes',
      hasAuthority: clientPortalUser.hasAuthority || 'No',
      users: [],
      avatar: clientPortalUser.avatar,
      req: true,
      activeSections,
      erxesCompanyId: clientPortalUser.erxesCompanyId,
      disableVerificationMail: false,
      clientPortalId: clientPortalUser.clientPortalId
    };
  }

  generateDoc = (
    values: { _id: string; password?: string } & IClientPortalUserDoc
  ) => {
    const { clientPortalUser } = this.props;
    const finalValues = values;

    if (clientPortalUser) {
      finalValues._id = clientPortalUser._id;
    }

    const doc: any = {
      _id: finalValues._id,
      ...this.state,
      firstName: finalValues.firstName,
      lastName: finalValues.lastName,
      username: finalValues.username,
      code: finalValues.code,
      email: finalValues.email,
      phone: finalValues.phone,
      companyName: finalValues.companyName,
      companyRegistrationNumber: finalValues.companyRegistrationNumber,
      type: finalValues.type,
      erxesCustomerId: finalValues.erxesCustomerId,
      erxesCompanyId: this.state.erxesCompanyId,
      clientPortalId: finalValues.clientPortalId
    };
    if (this.state.password) {
      doc.password = this.state.password;
    }

    doc.disableVerificationMail = this.state.disableVerificationMail;

    return doc;
  };

  onOwnerChange = ownerId => {
    this.setState({ ownerId });
  };

  onChange = e => {
    this.setState({
      clientPortalId: e.target.value
    });
  };

  onAvatarUpload = url => {
    this.setState({ avatar: url });
  };

  renderSelectOptions() {
    return USER_LOGIN_TYPES.map(e => {
      return (
        <option key={e.value} value={e.value}>
          {__(e.label)}
        </option>
      );
    });
  }

  onChangeContent = e => {
    this.setState({
      type: e.target.value
    });
  };

  onChangeCompany = erxesCompanyId => {
    this.setState({ erxesCompanyId });
  };

  renderClientPortalUser = (formProps: IFormProps) => {
    const { clientPortalGetConfigs } = this.props;

    const clientPortalUser =
      this.props.clientPortalUser || ({} as IClientPortalUser);

    return (
      <>
        <CollapseContent
          title={__('General information')}
          compact={true}
          open={true}
        >
          <FormWrapper>
            <FormColumn>
              <FormGroup>
                <AvatarUpload
                  avatar={clientPortalUser.avatar}
                  onAvatarUpload={this.onAvatarUpload}
                />
              </FormGroup>
            </FormColumn>
          </FormWrapper>
          <FormWrapper>
            <FormColumn>
              <FormGroup>
                <ControlLabel required={true}>{__('First Name')}</ControlLabel>
                <FormControl
                  {...formProps}
                  defaultValue={clientPortalUser.firstName || ''}
                  autoFocus={true}
                  required={true}
                  name="firstName"
                />
              </FormGroup>

              <FormGroup>
                <ControlLabel>{__('Last Name')}</ControlLabel>
                <FormControl
                  {...formProps}
                  name="lastName"
                  defaultValue={clientPortalUser.lastName || ''}
                />
              </FormGroup>

              <FormGroup>
                <ControlLabel>{__('User Name')}</ControlLabel>
                <FormControl
                  {...formProps}
                  name="username"
                  defaultValue={clientPortalUser.username || ''}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>{__('Company')}</ControlLabel>
                <SelectCompanies
                  initialValue={clientPortalUser.erxesCompanyId}
                  label={__('Select a company')}
                  name="companyId"
                  onSelect={this.onChangeCompany}
                  multi={false}
                />
              </FormGroup>
            </FormColumn>
            <FormColumn>
              <FormGroup>
                <ControlLabel>{__('Code')}</ControlLabel>
                <FormControl
                  {...formProps}
                  name="code"
                  defaultValue={clientPortalUser.code || ''}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel required={true}>{__('Email')}</ControlLabel>
                <FormControl
                  {...formProps}
                  name="email"
                  required={true}
                  defaultValue={clientPortalUser.email || ''}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>{__('Phone')}</ControlLabel>
                <FormControl
                  {...formProps}
                  name="phone"
                  defaultValue={clientPortalUser.phone || ''}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>{__('ClientPortal')}</ControlLabel>
                <FormControl
                  {...formProps}
                  name="clientPortalId"
                  componentClass="select"
                  defaultValue={clientPortalUser.clientPortalId}
                  required={true}
                  onChange={this.onChange}
                >
                  <option />
                  {clientPortalGetConfigs.map((cp, index) => (
                    <option key={index} value={cp._id}>
                      {cp.name}
                    </option>
                  ))}
                </FormControl>
              </FormGroup>
            </FormColumn>
          </FormWrapper>
        </CollapseContent>

        <CollapseContent
          title={__('Authentication')}
          compact={true}
          open={true}
        >
          <FormGroup>
            <ControlLabel>{__('Password')}</ControlLabel>
            <FormControl
              {...formProps}
              name="password"
              defaultValue={clientPortalUser._id && '******'}
              onChange={(e: any) => this.setState({ password: e.target.value })}
              onFocus={() => this.setState({ password: undefined })}
            />
          </FormGroup>

          {!clientPortalUser._id && (
            <FormGroup>
              <ControlLabel>{__('Send invitation email')}</ControlLabel>
              <FormControl
                {...formProps}
                name="disableVerificationMail"
                componentClass="checkbox"
                defaultChecked={false}
                onChange={(e: any) =>
                  this.setState({ disableVerificationMail: !e.target.checked })
                }
              />
            </FormGroup>
          )}
        </CollapseContent>
      </>
    );
  };

  renderClientPortalCompany = (formProps: IFormProps) => {
    const { clientPortalGetConfigs } = this.props;

    const clientPortalUser =
      this.props.clientPortalUser || ({} as IClientPortalUser);

    return (
      <CollapseContent
        title={__('General information')}
        compact={true}
        open={true}
      >
        <FormWrapper>
          <FormColumn>
            <FormGroup>
              <ControlLabel required={true}>{__('Company Name')}</ControlLabel>
              <FormControl
                {...formProps}
                defaultValue={clientPortalUser.companyName || ''}
                autoFocus={true}
                required={true}
                name="companyName"
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>{__('Company Registration Number')}</ControlLabel>
              <FormControl
                {...formProps}
                name="companyRegistrationNumber"
                defaultValue={clientPortalUser.companyRegistrationNumber || ''}
              />
            </FormGroup>
          </FormColumn>
          <FormColumn>
            <FormGroup>
              <ControlLabel required={true}>{__('Email')}</ControlLabel>
              <FormControl
                {...formProps}
                name="email"
                required={true}
                defaultValue={clientPortalUser.email || ''}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>{__('Phone')}</ControlLabel>
              <FormControl
                {...formProps}
                name="phone"
                defaultValue={clientPortalUser.phone || ''}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>{__('ClientPortal')}</ControlLabel>
              <FormControl
                {...formProps}
                name="clientPortalId"
                componentClass="select"
                defaultValue={clientPortalUser.clientPortalId}
                required={true}
                onChange={this.onChange}
              >
                <option />
                {clientPortalGetConfigs.map((cp, index) => (
                  <option key={index} value={cp._id}>
                    {cp.name}
                  </option>
                ))}
              </FormControl>
            </FormGroup>
          </FormColumn>
        </FormWrapper>
      </CollapseContent>
    );
  };

  renderContent = (formProps: IFormProps) => {
    const { closeModal, renderButton } = this.props;
    const { values, isSubmitted, resetSubmit } = formProps;

    const clientPortalUser =
      this.props.clientPortalUser || ({} as IClientPortalUser);

    return (
      <>
        <ScrollWrapper>
          <FormGroup>
            <ControlLabel>{__('Business Portal User Type')}</ControlLabel>
            <FormControl
              {...formProps}
              name="type"
              componentClass="select"
              defaultValue={clientPortalUser.type}
              required={true}
              onChange={this.onChangeContent}
            >
              {this.renderSelectOptions()}
            </FormControl>
          </FormGroup>

          {this.state.type === 'customer'
            ? this.renderClientPortalUser(formProps)
            : this.renderClientPortalCompany(formProps)}
        </ScrollWrapper>
        <ModalFooter>
          <Button
            btnStyle="simple"
            uppercase={false}
            onClick={closeModal}
            icon="times-circle"
          >
            Close
          </Button>

          {renderButton({
            name: 'clientPortalUser',
            values: this.generateDoc(values),
            isSubmitted,
            object: this.props.clientPortalUser,
            resetSubmit
          })}
        </ModalFooter>
      </>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default CustomerForm;
