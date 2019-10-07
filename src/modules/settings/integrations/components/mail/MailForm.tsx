import Button from 'modules/common/components/Button';
import FormControl from 'modules/common/components/form/Control';
import Form from 'modules/common/components/form/Form';
import { Label } from 'modules/common/components/form/styles';
import Icon from 'modules/common/components/Icon';
import Spinner from 'modules/common/components/Spinner';
import Tip from 'modules/common/components/Tip';
import EditorCK from 'modules/common/containers/EditorCK';
import { IButtonMutateProps, IFormProps } from 'modules/common/types';
import { __, Alert, uploadHandler } from 'modules/common/utils';
import { EMAIL_CONTENT } from 'modules/engage/constants';
import { Meta } from 'modules/inbox/components/conversationDetail/workarea/mail/style';
import { FileName } from 'modules/inbox/styles';
import { IMail } from 'modules/inbox/types';
import { IIntegration } from 'modules/settings/integrations/types';
import React, { ReactNode } from 'react';
import { MAIL_TOOLBARS_CONFIG } from '../../constants';
import { formatObj, formatStr } from '../../containers/utils';
import {
  AttachmentContainer,
  Attachments,
  Column,
  ControlWrapper,
  // LeftSection,
  EditorFooter,
  MailEditorWrapper,
  Resipients,
  SpaceBetweenRow,
  ToolBar,
  Uploading
} from './styles';
import { FlexRow, Subject } from './styles';

type Props = {
  integrationId?: string;
  integrations: IIntegration[];
  kind: string;
  toggleReply?: () => void;
  fromEmail?: string;
  conversationDetails?: IMail;
  closeModal?: () => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

type State = {
  status?: string;
  cc?: string;
  bcc?: string;
  to?: string;
  fromEmail?: string;
  from?: string;
  subject?: string;
  hasCc?: boolean;
  hasBcc?: boolean;
  hasSubject?: boolean;
  content: string;
  integrations: IIntegration[];
  attachments: any[];
  fileIds: string[];
  totalFileSize: number;
  isUploading: boolean;
};

class MailForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const details = props.conversationDetails || ({} as IMail);

    const to = formatObj(details.to);
    const cc = formatObj(details.cc || []);
    const bcc = formatObj(details.bcc || []);
    const [from] = details.from;

    this.state = {
      cc,
      bcc,
      to,

      hasCc: cc ? cc.length > 0 : false,
      hasBcc: bcc ? bcc.length > 0 : false,
      hasSubject: bcc ? bcc.length > 0 : false,

      fromEmail: from.email || props.fromEmail,
      subject: details.subject || '',
      content: '',

      status: 'draft',
      isUploading: false,

      attachments: [],
      fileIds: [],
      totalFileSize: 0,

      integrations: props.integrations
    };
  }

  generateDoc = (values: {
    to: string;
    cc: string;
    bcc: string;
    subject: string;
    from: string;
  }) => {
    const { integrationId, kind } = this.props;
    const details = this.props.conversationDetails || ({} as IMail);
    const { to, cc, bcc, from, subject } = values;
    const { content, attachments } = this.state;
    const { references, headerId, threadId, messageId } = details;

    const doc = {
      headerId,
      references,
      threadId,
      replyToMessageId: messageId,
      to: formatStr(to),
      cc: formatStr(cc),
      bcc: formatStr(bcc),
      from: integrationId ? integrationId : from,
      subject: subject || details.subject,
      attachments,
      kind,
      body: content,
      erxesApiId: from
    };

    return doc;
  };

  onEditorChange = e => {
    this.setState({ content: e.editor.getData() });
  };

  onClick = <T extends keyof State>(name: T) => {
    this.setState(({ [name]: true } as unknown) as Pick<State, keyof State>);
  };

  onRemoveAttach = (attachment: any) => {
    const { attachments } = this.state;

    this.setState({
      attachments: attachments.filter(
        item => item.filename !== attachment.filename
      )
    });
  };

  getEmailSender = (fromEmail?: string) => {
    const details = this.props.conversationDetails || ({} as IMail);
    const { integrationEmail } = details;

    const to = formatObj(details.to);

    // new email
    if (!to && !integrationEmail) {
      return fromEmail;
    }

    // reply
    if (!integrationEmail || !fromEmail) {
      return '';
    }

    let receiver;

    // Prevent send email to itself
    if (integrationEmail === fromEmail) {
      receiver = to;
    } else {
      let toEmails;

      // Exclude integration email from [to]
      if (to.includes(integrationEmail)) {
        toEmails = to.split(' ').filter(email => email !== integrationEmail);
      } else {
        toEmails = to;
      }

      receiver = toEmails + ' ' + fromEmail;
    }

    return receiver;
  };

  onAttachment = (e: React.FormEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;

    const extraFormData = [
      { key: 'kind', value: 'nylas' },
      { key: 'erxesApiId', value: this.props.integrationId || '' }
    ];

    uploadHandler({
      files,
      extraFormData,

      beforeUpload: () => {
        this.setState({ isUploading: true });
      },
      afterUpload: ({ response }) => {
        const resObj = JSON.parse(response);

        this.setState({
          isUploading: false,
          attachments: [...this.state.attachments, { ...resObj }]
        });
      }
    });
  };

  handleFileInput = (e: React.FormEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;

    if (!files) {
      return;
    }

    if (files.length === 0) {
      return;
    }

    this.setState({ isUploading: true });

    let j = 0;

    // tslint:disable-next-line
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const uploadReader = new FileReader();
      const fileInfo = {
        filename: file.name,
        size: file.size,
        mimeType: file.type
      };

      // eslint-disable-next-line
      uploadReader.onloadend = () => {
        const totalFileSize = this.state.totalFileSize + fileInfo.size;

        if (totalFileSize > 5184000) {
          this.setState({ isUploading: false });

          return Alert.error('It`s size exceeds the limit 5mb');
        }

        const result = uploadReader.result;

        if (result) {
          const dataStr = result.toString();
          const data = dataStr.substr(dataStr.indexOf(',') + 1);

          const fileData = Object.assign({ data }, fileInfo);

          this.setState({
            attachments: [...this.state.attachments, fileData],
            totalFileSize
          });

          j++;

          if (j === files.length) {
            this.setState({ isUploading: false });
          }
        }
      };

      uploadReader.readAsDataURL(file);
    }
  };

  renderFromOption() {
    const { integrations } = this.props;

    return integrations.map(({ _id, name }) => (
      <option key={_id} value={_id}>
        {name}
      </option>
    ));
  }

  renderFrom(formProps: IFormProps, integrationId?: string) {
    const extendedProps = {
      name: 'from',
      componentClass: 'select',
      required: true,
      defaultValue: integrationId,
      disabled: integrationId ? integrationId.length > 0 : false
    };

    return (
      <FlexRow>
        <label>From:</label>
        <FormControl {...formProps} {...extendedProps}>
          <option />
          {this.renderFromOption()}
        </FormControl>
      </FlexRow>
    );
  }

  renderTo(formProps: IFormProps, sender: string) {
    return (
      <FlexRow>
        <label>To:</label>
        <FormControl
          {...formProps}
          defaultValue={sender}
          name="to"
          required={true}
        />
      </FlexRow>
    );
  }

  renderCC(formProps: IFormProps) {
    const { cc, hasCc } = this.state;

    if (!hasCc) {
      return null;
    }

    return (
      <FlexRow>
        <label>Cc:</label>
        <FormControl {...formProps} name="cc" defaultValue={cc} />
      </FlexRow>
    );
  }

  renderBCC(formProps: IFormProps) {
    const { bcc, hasBcc } = this.state;

    if (!hasBcc) {
      return null;
    }

    return (
      <FlexRow>
        <label>Bcc:</label>
        <FormControl {...formProps} name="bcc" defaultValue={bcc} />
      </FlexRow>
    );
  }

  renderSubject(formProps) {
    const { subject, hasSubject } = this.state;

    if (!hasSubject) {
      return null;
    }

    return (
      <Subject>
        <FlexRow>
          <label>Subject:</label>
          <FormControl
            {...formProps}
            name="subject"
            required={true}
            defaultValue={subject}
            disabled={(subject && true) || false}
          />
        </FlexRow>
      </Subject>
    );
  }

  renderAttachments() {
    const { attachments } = this.state;

    if (attachments.length === 0) {
      return;
    }

    return (
      <Attachments>
        {attachments.map((attachment, index) => (
          <AttachmentContainer key={index}>
            <FileName>{attachment.filename || attachment.name}</FileName>
            {attachment.size ? (
              <div>
                ({Math.round(attachment.size / 1000)}
                kB)
              </div>
            ) : null}
            <Icon
              icon="cancel-1"
              size={14}
              onClick={this.onRemoveAttach.bind(this, attachment)}
            />
          </AttachmentContainer>
        ))}
      </Attachments>
    );
  }

  renderCancelButton() {
    const { closeModal } = this.props;

    return (
      <Button
        btnStyle="danger"
        size="small"
        onClick={closeModal}
        icon="cancel-1"
      >
        Close
      </Button>
    );
  }

  renderIcon = ({
    text,
    icon,
    element,
    onClick
  }: {
    text: string;
    icon: string;
    element?: ReactNode;
    onClick?: () => void;
  }) => {
    return (
      <Tip text={__(text)}>
        <Label>
          <Icon icon={icon} onClick={onClick} />
          {element}
        </Label>
      </Tip>
    );
  };

  renderButtons(values, isSubmitted) {
    const { closeModal, toggleReply, renderButton } = this.props;

    const inputProps = {
      type: 'file',
      onChange: this.onAttachment,
      multiple: true
    };

    return (
      <EditorFooter>
        <SpaceBetweenRow>
          <ToolBar>
            {this.renderIcon({
              text: 'Attach file',
              icon: 'attach',
              element: <input {...inputProps} />
            })}
            {this.renderIcon({
              text: 'Delete',
              icon: 'trash',
              onClick: toggleReply
            })}
          </ToolBar>
          {this.state.isUploading ? (
            <Uploading>
              <Spinner />
              <span>Uploading...</span>
            </Uploading>
          ) : (
            renderButton({
              name: 'mailForm',
              values: this.generateDoc(values),
              callback: closeModal,
              isSubmitted
            })
          )}
        </SpaceBetweenRow>
      </EditorFooter>
    );
  }

  renderBody() {
    return (
      <MailEditorWrapper>
        <EditorCK
          insertItems={EMAIL_CONTENT}
          toolbar={MAIL_TOOLBARS_CONFIG}
          removePlugins="elementspath"
          content={this.state.content}
          onChange={this.onEditorChange}
          height={100}
        />
      </MailEditorWrapper>
    );
  }

  renderLeftSide(formProps: IFormProps) {
    const { integrationId } = this.props;
    const sender = this.getEmailSender(this.state.fromEmail);

    return (
      <Column>
        {this.renderFrom(formProps, integrationId)}
        {this.renderTo(formProps, sender)}
        {this.renderCC(formProps)}
        {this.renderBCC(formProps)}
      </Column>
    );
  }

  renderRightSide() {
    const { hasCc, hasBcc, hasSubject } = this.state;

    const onClickHasCc = () => this.onClick('hasCc');
    const onClickHasBCC = () => this.onClick('hasBcc');
    const onClickSubject = () => this.onClick('hasSubject');

    return (
      <>
        <Resipients onClick={onClickHasCc} isActive={hasCc}>
          Cc
        </Resipients>
        <Resipients onClick={onClickHasBCC} isActive={hasBcc}>
          Bcc
        </Resipients>
        <Resipients onClick={onClickSubject} isActive={hasSubject}>
          Subject
        </Resipients>
      </>
    );
  }

  renderMeta = (formProps: IFormProps) => {
    return (
      <Meta>
        <SpaceBetweenRow>
          {this.renderLeftSide(formProps)}
          {this.renderRightSide()}
        </SpaceBetweenRow>
      </Meta>
    );
  };

  renderContent = (formProps: IFormProps) => {
    const { values, isSubmitted } = formProps;

    return (
      <ControlWrapper>
        {this.renderMeta(formProps)}
        {this.renderSubject(formProps)}
        {this.renderBody()}
        {this.renderAttachments()}
        {this.renderButtons(values, isSubmitted)}
      </ControlWrapper>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default MailForm;
