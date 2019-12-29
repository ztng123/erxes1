import Button from 'modules/common/components/Button';
import { FormControl } from 'modules/common/components/form';
import Form from 'modules/common/components/form/Form';
import FormGroup from 'modules/common/components/form/Group';
import ControlLabel from 'modules/common/components/form/Label';
import Info from 'modules/common/components/Info';
import { ModalFooter } from 'modules/common/styles/main';
import { IButtonMutateProps, IFormProps } from 'modules/common/types';
import { IEngageConfig } from 'modules/engage/types';
import React from 'react';

type Props = {
  engagesConfigDetail: IEngageConfig;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  verifyEmail: (email: string) => void;
  removeVerifiedEmail: (email: string) => void;
  sendTestEmail: (from: string, to: string, content: string) => void;
  closeModal: () => void;
  verifiedEmails: string[];
};

type State = {
  secretAccessKey?: string;
  accessKeyId?: string;
  region?: string;
  emailToVerify?: string;
  testFrom?: string;
  testTo?: string;
  testContent?: string;
};

class List extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { engagesConfigDetail } = props;

    this.state = {
      secretAccessKey: engagesConfigDetail.secretAccessKey || '',
      accessKeyId: engagesConfigDetail.accessKeyId || '',
      region: engagesConfigDetail.region || ''
    };
  }

  generateDoc = values => {
    return values;
  };

  onChangeCommon = (
    name: 'emailToVerify' | 'testFrom' | 'testTo' | 'testContent',
    e
  ) => {
    this.setState({ [name]: e.currentTarget.value });
  };

  onVerifyEmail = () => {
    const { emailToVerify } = this.state;

    if (emailToVerify) {
      this.props.verifyEmail(emailToVerify);
    }
  };

  onSendTestEmail = () => {
    const { testFrom, testTo, testContent } = this.state;

    this.props.sendTestEmail(testFrom || '', testTo || '', testContent || '');
  };

  onRemoveVerifiedEmail = (email: string) => {
    this.props.removeVerifiedEmail(email);
  };

  renderDescription() {
    return (
      <>
        <Info>
          <p>
            <strong>
              Configure Amazon SES and Amazon SNS to track each email responses
            </strong>
          </p>
          <ol>
            <li>
              <a
                href="https://console.aws.amazon.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Log in to your AWS Management Console.
              </a>
            </li>
            <li>Click on your user name at the top right of the page.</li>
            <li>
              Click on the My Security Credentials link from the drop-down menu.
            </li>
            <li>Click on the Users menu from left Sidebar.</li>
            <li>Click on the Add user.</li>
            <li>
              Then create your username and check Programmatic access type and
              click next.
            </li>
            <li>
              Click on the Create group then write group name and check
              amazonSesFullAccess and amazonSNSFullAccess.
            </li>
            <li>Then check your created group and click on the Next button.</li>
            <li>
              Finally click on the create user and copy the Access Key Id and
              Secret Access Key.
            </li>
          </ol>
        </Info>
        <Info>
          <p>
            <strong>To find your Region:</strong>
          </p>
          <ol>
            <li>
              <a
                href="https://console.aws.amazon.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Log in to your AWS Management Console.
              </a>
            </li>
            <li>Click on services menu at the top left of the page.</li>
            <li>Find Simple Email Service and Copy region code from url.</li>
          </ol>
          <p>If you choose not available region</p>
          <ol>
            <li>Click on your region at the top right of the menu.</li>
            <li>Select any active region from list.</li>
            <li>
              Copy the selected Region code. <br />
              <i>
                (example: us-east-1, us-west-2, ap-south-1, ap-southeast-2,
                eu-central-1, eu-west-1)
              </i>
            </li>
          </ol>
        </Info>

        <Info>
          <p>
            <strong>To determine if your account is in the sandbox:</strong>
          </p>
          <ol>
            <li>
              <a
                href="https://console.aws.amazon.com/ses/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open the Amazon SES console at
                https://console.aws.amazon.com/ses/
              </a>
            </li>
            <li>Use the Region selector to choose an AWS Region.</li>
            <li>
              If your account is in the sandbox in the AWS Region that you
              selected, you see a banner at the top of the page that resembles
              the example in the following image.
              <img
                alt="sandbox"
                style={{ maxWidth: '100%' }}
                src="/images/sandbox-banner-send-statistics.png"
              />
            </li>
            <li>
              If so follow the instructions described{' '}
              <a
                href="https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>{' '}
              to move out of the Amazon SES Sandbox
            </li>
          </ol>
        </Info>
      </>
    );
  }

  renderContent = (formProps: IFormProps) => {
    const {
      engagesConfigDetail,
      renderButton,
      closeModal,
      verifiedEmails
    } = this.props;

    const { values, isSubmitted } = formProps;

    return (
      <>
        {this.renderDescription()}
        <FormGroup>
          <ControlLabel>AWS-SES Access key ID</ControlLabel>
          <FormControl
            {...formProps}
            max={140}
            name="accessKeyId"
            defaultValue={engagesConfigDetail.accessKeyId}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>AWS-SES Secret access key</ControlLabel>
          <FormControl
            {...formProps}
            max={140}
            name="secretAccessKey"
            defaultValue={engagesConfigDetail.secretAccessKey}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>AWS-SES Region</ControlLabel>
          <FormControl
            {...formProps}
            max={140}
            name="region"
            defaultValue={engagesConfigDetail.region}
          />
        </FormGroup>

        <ModalFooter>
          <Button
            btnStyle="simple"
            type="button"
            onClick={closeModal}
            icon="cancel-1"
          >
            Cancel
          </Button>

          {renderButton({
            name: 'engagesConfigDetail',
            values: this.generateDoc(values),
            isSubmitted,
            object: this.props.engagesConfigDetail
          })}
        </ModalFooter>

        <h4>Verified emails:</h4>

        <ul>
          {verifiedEmails.map((email, index) => (
            <li
              key={index}
              onClick={this.onRemoveVerifiedEmail.bind(this, email)}
            >
              {email}
            </li>
          ))}
        </ul>

        <input
          type="email"
          onChange={this.onChangeCommon.bind(this, 'emailToVerify')}
        />

        <Button size="small" onClick={this.onVerifyEmail}>
          Verify new email
        </Button>

        <h4>Send test email:</h4>

        <input
          placeholder="From"
          onChange={this.onChangeCommon.bind(this, 'testFrom')}
        />
        <input
          placeholder="To"
          onChange={this.onChangeCommon.bind(this, 'testTo')}
        />
        <input
          placeholder="Content"
          onChange={this.onChangeCommon.bind(this, 'testContent')}
        />

        <Button size="small" onClick={this.onSendTestEmail}>
          Send test email
        </Button>
      </>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default List;
