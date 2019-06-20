import { IUser, IUserLinks } from 'modules/auth/types';
import {
  AvatarUpload,
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  ModifiableSelect
} from 'modules/common/components';
import {
  ColumnTitle,
  FormColumn,
  FormWrapper,
  ModalFooter
} from 'modules/common/styles/main';
import {
  IButtonMutateProps,
  IFormProps,
  IQueryParams
} from 'modules/common/types';
import { __ } from 'modules/common/utils';
import { SelectTeamMembers } from 'modules/settings/team/containers';
import * as React from 'react';
import { ICustomer, ICustomerDoc } from '../../types';
import {
  leadStatusChoices,
  lifecycleStateChoices,
  regexEmail,
  regexPhone
} from '../../utils';

type Props = {
  customer?: ICustomer;
  closeModal: () => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  queryParams: IQueryParams;
};

type State = {
  ownerId: string;
  doNotDisturb: string;
  hasAuthority: string;
  users: IUser[];
  avatar: string;
  phones?: string[];
  emails?: string[];
  primaryPhone?: string;
  primaryEmail?: string;
};

class CustomerForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const customer = props.customer || ({} as ICustomer);

    this.state = {
      ownerId: customer.ownerId || '',
      doNotDisturb: customer.doNotDisturb || 'No',
      hasAuthority: customer.hasAuthority || 'No',
      users: [],
      avatar: customer.avatar
    };
  }

  generateDoc = (values: { _id: string } & ICustomerDoc & IUserLinks) => {
    const { customer } = this.props;
    const {
      phones,
      emails,
      primaryPhone,
      primaryEmail,
      avatar,
      ownerId
    } = this.state;
    const finalValues = values;

    if (customer) {
      finalValues._id = customer._id;
    }

    return {
      phones,
      emails,
      primaryPhone,
      primaryEmail,
      avatar,
      ownerId,
      hasAuthority: finalValues.hasAuthority,
      doNotDisturb: finalValues.doNotDisturb,
      firstName: finalValues.firstName,
      lastName: finalValues.lastName,
      position: finalValues.position,
      department: finalValues.department,
      leadStatus: finalValues.leadStatus,
      lifecycleState: finalValues.lifecycleState,
      description: finalValues.description,

      links: {
        linkedIn: finalValues.linkedIn,
        twitter: finalValues.twitter,
        facebook: finalValues.facebook,
        github: finalValues.github,
        youtube: finalValues.youtube,
        website: finalValues.website
      }
    };
  };

  onAvatarUpload = url => {
    this.setState({ avatar: url });
  };

  getVisitorInfo(customer, key) {
    return customer.visitorContactInfo && customer.visitorContactInfo[key];
  }

  getEmailsOptions(customer) {
    const { emails } = customer;

    if (emails && emails.length > 0) {
      return emails;
    }

    if (this.getVisitorInfo(customer, 'email')) {
      return [this.getVisitorInfo(customer, 'email')];
    }

    return [];
  }

  getPhonesOptions(customer) {
    const { phones } = customer;

    if (phones && phones.length > 0) {
      return phones;
    }

    if (this.getVisitorInfo(customer, 'phone')) {
      return [this.getVisitorInfo(customer, 'phone')];
    }

    return [];
  }

  renderFormGroup = (label, props) => {
    return (
      <FormGroup>
        <ControlLabel required={props.required && true}>{label}</ControlLabel>
        <FormControl {...props} />
      </FormGroup>
    );
  };

  onEmailChange = ({ options, selectedOption }) => {
    this.setState({ emails: options, primaryEmail: selectedOption });
  };

  onPhoneChange = ({ options, selectedOption }) => {
    this.setState({ phones: options, primaryPhone: selectedOption });
  };

  onOwnerChange = ownerId => {
    this.setState({ ownerId });
  };

  renderContent = (formProps: IFormProps) => {
    const { closeModal, renderButton } = this.props;
    const { values, isSubmitted } = formProps;

    const customer = this.props.customer || ({} as ICustomer);
    const { links = {}, primaryEmail, primaryPhone } = customer;

    return (
      <>
        <AvatarUpload
          avatar={customer.avatar}
          onAvatarUpload={this.onAvatarUpload}
        />
        <FormWrapper>
          <FormColumn>
            {this.renderFormGroup('First Name', {
              ...formProps,
              defaultValue: customer.firstName || '',
              autoFocus: true,
              required: true,
              name: 'firstName'
            })}

            <FormGroup>
              <ControlLabel required={true}>Email</ControlLabel>
              <ModifiableSelect
                formProps={formProps}
                value={primaryEmail}
                type="email"
                options={this.getEmailsOptions(customer)}
                placeholder="Choose primary email"
                buttonText="Add Email"
                onChange={this.onEmailChange}
                regex={regexEmail}
                required={true}
              />
            </FormGroup>

            {this.renderFormGroup('Position', {
              ...formProps,
              name: 'position',
              defaultValue: customer.position || ''
            })}

            {this.renderFormGroup('Lead Status', {
              ...formProps,
              name: 'leadStatus',
              componentClass: 'select',
              defaultValue: customer.leadStatus || '',
              options: leadStatusChoices(__)
            })}

            <FormGroup>
              <ControlLabel>Owner</ControlLabel>
              <SelectTeamMembers
                label="Choose an owner"
                name="ownerId"
                value={this.state.ownerId}
                onSelect={this.onOwnerChange}
                multi={false}
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl
                {...formProps}
                max={140}
                name="description"
                componentClass="textarea"
                defaultValue={customer.description || ''}
              />
            </FormGroup>
          </FormColumn>

          <FormColumn>
            {this.renderFormGroup('Last Name', {
              ...formProps,
              name: 'lastName',
              defaultValue: customer.lastName || ''
            })}

            <FormGroup>
              <ControlLabel>Phone</ControlLabel>
              <ModifiableSelect
                formProps={formProps}
                value={primaryPhone}
                options={this.getPhonesOptions(customer)}
                placeholder="Choose primary phone"
                buttonText="Add Phone"
                onChange={this.onPhoneChange}
                regex={regexPhone}
              />
            </FormGroup>

            {this.renderFormGroup('Department', {
              ...formProps,
              name: 'department',
              defaultValue: customer.department || ''
            })}

            {this.renderFormGroup('Lifecycle State', {
              ...formProps,
              name: 'lifecycleState',
              componentClass: 'select',
              defaultValue: customer.lifecycleState || '',
              options: lifecycleStateChoices(__)
            })}

            {this.renderFormGroup('Has Authority', {
              ...formProps,
              name: 'hasAuthority',
              componentClass: 'radio',
              options: [
                {
                  childNode: 'Yes',
                  value: 'Yes',
                  checked: this.state.hasAuthority === 'Yes',
                  onChange: e => this.setState({ hasAuthority: e.target.value })
                },
                {
                  childNode: 'No',
                  value: 'No',
                  checked: this.state.hasAuthority === 'No',
                  onChange: e => this.setState({ hasAuthority: e.target.value })
                }
              ]
            })}

            {this.renderFormGroup('Do not disturb', {
              ...formProps,
              name: 'doNotDisturb',
              componentClass: 'radio',
              options: [
                {
                  childNode: 'Yes',
                  value: 'Yes',
                  checked: this.state.doNotDisturb === 'Yes',
                  onChange: e => this.setState({ doNotDisturb: e.target.value })
                },
                {
                  childNode: 'No',
                  value: 'No',
                  checked: this.state.doNotDisturb === 'No',
                  onChange: e => this.setState({ doNotDisturb: e.target.value })
                }
              ]
            })}
          </FormColumn>
        </FormWrapper>
        <ColumnTitle>{__('Links')}</ColumnTitle>
        <FormWrapper>
          <FormColumn>
            {this.renderFormGroup('LinkedIn', {
              ...formProps,
              name: 'linkedIn',
              defaultValue: links.linkedIn || '',
              type: 'url'
            })}

            {this.renderFormGroup('Twitter', {
              ...formProps,
              name: 'twitter',
              defaultValue: links.twitter || '',
              type: 'url'
            })}

            {this.renderFormGroup('Facebook', {
              ...formProps,
              name: 'facebook',
              defaultValue: links.facebook || '',
              type: 'url'
            })}
          </FormColumn>
          <FormColumn>
            {this.renderFormGroup('Github', {
              ...formProps,
              name: 'github',
              defaultValue: links.github || '',
              type: 'url'
            })}

            {this.renderFormGroup('Youtube', {
              ...formProps,
              name: 'youtube',
              defaultValue: links.youtube || '',
              type: 'url'
            })}

            {this.renderFormGroup('Website', {
              ...formProps,
              name: 'website',
              defaultValue: links.website || '',
              type: 'url'
            })}
          </FormColumn>
        </FormWrapper>

        <ModalFooter>
          <Button btnStyle="simple" onClick={closeModal} icon="cancel-1">
            Close
          </Button>

          {renderButton({
            name: 'customer',
            values: this.generateDoc(values),
            isSubmitted,
            callback: closeModal,
            object: this.props.customer
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
