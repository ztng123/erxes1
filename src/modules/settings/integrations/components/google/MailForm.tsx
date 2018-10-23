import { EditorState } from 'draft-js';
import {
  Button,
  FormControl,
  Icon,
  Spinner,
  Tip
} from 'modules/common/components';
import {
  createStateFromHTML,
  ErxesEditor,
  toHTML
} from 'modules/common/components/editor/Editor';
import { __, Alert, uploadHandler } from 'modules/common/utils';
import {
  AttachmentIndicator,
  EditorActions,
  FileName
} from 'modules/inbox/styles';
import { IIntegration } from 'modules/settings/integrations/types';
import * as React from 'react';
import {
  AttachmentContainer,
  AttachmentFile,
  ControlWrapper,
  LeftSection,
  MailEditorWrapper,
  Preview,
  Resipients
} from '../../styles';

type Props = {
  integrations: IIntegration[];
  toEmail?: string;
  toEmails?: string[];
  setAttachmentPreview?: (data: string | null) => void;
  attachmentPreview: { name: string; data: string; type: string };
  closeModal?: () => void;

  save: (
    params: {
      cc?: string;
      bcc?: string;
      toEmails?: string;
      subject?: string;
      body: string;
      integrationId?: string;
      attachments: string[];
    }
  ) => void;
};

type State = {
  status?: string;
  cc?: string;
  bcc?: string;
  toEmails?: string;
  from?: string;
  subject?: string;
  isCc?: boolean;
  isBcc?: boolean;
  content: string;
  editorState: EditorState;
  integrations: IIntegration[];
  attachments: string[];
  totalFileSize: number;
};

class MailForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      status: 'draft',
      isCc: false,
      isBcc: false,
      content: '',
      cc: '',
      bcc: '',
      toEmails: props.toEmail || '',
      from: '',
      subject: '',
      attachments: [],
      totalFileSize: 0,
      integrations: props.integrations,
      editorState: createStateFromHTML(EditorState.createEmpty(), '')
    };
  }

  getContent = editorState => {
    return toHTML(editorState);
  };

  changeContent = editorState => {
    this.setState({ editorState });
  };

  onChange = <T extends keyof State>(name: T, value: State[T]) => {
    this.setState({ [name]: value } as Pick<State, keyof State>);
  };

  onClick = (name: 'isCc' | 'isBcc') => {
    this.onChange(name, !this.state[name]);
  };

  removeImage = (value: string) => {
    const { attachments } = this.state;

    this.setState({ attachments: attachments.filter(item => item !== value) });
  };

  handleFileInput = (e: React.FormEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    const { setAttachmentPreview } = this.props;

    uploadHandler({
      files,

      beforeUpload: () => {
        return;
      },

      afterUpload: ({ response, fileInfo }) => {
        if (this.state.totalFileSize > 10368000) {
          return Alert.error('It`s size exceeds the limit 10mb');
        }
        // set attachments
        this.setState({
          attachments: [...this.state.attachments, response],
          totalFileSize: this.state.totalFileSize + fileInfo.size
        });

        // remove preview
        if (setAttachmentPreview) {
          setAttachmentPreview(null);
        }
      },

      afterRead: ({ result, fileInfo }) => {
        if (setAttachmentPreview) {
          setAttachmentPreview(Object.assign({ data: result }, fileInfo));
        }
      }
    });
  };

  onSend = () => {
    const { subject, cc, bcc, toEmails, from, attachments } = this.state;

    const body = this.getContent(this.state.editorState);
    const integrationId = from;

    this.props.save({
      subject,
      toEmails,
      cc,
      bcc,
      body,
      integrationId,
      attachments
    });

    this.cancelEditing();
  };

  cancelEditing = () => {
    this.setState({
      isCc: false,
      isBcc: false,
      editorState: EditorState.createEmpty(),
      cc: '',
      bcc: '',
      toEmails: '',
      from: '',
      subject: '',
      attachments: []
    });
  };

  renderFromOption() {
    return this.props.integrations.map(i => (
      <option key={i._id} value={i._id}>
        {i.name}
      </option>
    ));
  }

  renderToEmails() {
    const { toEmails = [] } = this.props;

    const onChange = e =>
      this.onChange('toEmails', (e.target as HTMLInputElement).value);

    if (toEmails.length > 0) {
      return (
        <FormControl
          componentClass="select"
          onChange={onChange}
          value={this.state.toEmails}
        >
          <option />
          {toEmails.map((email, index) => (
            <option key={index} value={email}>
              {email}
            </option>
          ))}
        </FormControl>
      );
    }

    return (
      <FormControl
        type="text"
        onChange={onChange}
        value={this.state.toEmails}
      />
    );
  }

  renderCC() {
    if (!this.state.isCc) {
      return null;
    }

    const onChange = e =>
      this.onChange('cc', (e.target as HTMLInputElement).value);

    return (
      <ControlWrapper>
        <span>Cc</span>
        <FormControl type="text" value={this.state.cc} onChange={onChange} />
      </ControlWrapper>
    );
  }

  renderBCC() {
    if (!this.state.isBcc) {
      return null;
    }

    const onChange = e =>
      this.onChange('bcc', (e.target as HTMLInputElement).value);

    return (
      <ControlWrapper>
        <span>Bcc</span>
        <FormControl type="text" onChange={onChange} value={this.state.bcc} />
      </ControlWrapper>
    );
  }

  renderAttachmentPreview() {
    const { attachmentPreview } = this.props;

    if (!attachmentPreview) {
      return null;
    }

    return (
      <Preview>
        <AttachmentFile>{attachmentPreview.name}</AttachmentFile>
        <Spinner />
      </Preview>
    );
  }

  renderAttachments() {
    const { attachments } = this.state;

    if (attachments.length === 0) {
      return null;
    }

    const onClick = attachment => this.removeImage(attachment);

    return (
      <AttachmentIndicator>
        {attachments.map((attachment, index) => (
          <AttachmentContainer key={index}>
            <FileName>{attachment}</FileName>
            <Icon icon="cancel-1" size={18} onClick={onClick} />
          </AttachmentContainer>
        ))}
      </AttachmentIndicator>
    );
  }

  renderCancelButton() {
    const { closeModal } = this.props;

    if (!closeModal) {
      return null;
    }

    return (
      <Button
        btnStyle="simple"
        size="small"
        onClick={closeModal}
        icon="cancel-1"
      >
        Close
      </Button>
    );
  }

  renderButtons() {
    const { toEmails, from } = this.state;

    const disabled = toEmails && from ? false : true;

    return (
      <EditorActions>
        <Tip text={__('Attach file')}>
          <label>
            <Icon icon="upload-2" />
            <input type="file" onChange={this.handleFileInput} />
          </label>
        </Tip>

        <Button
          onClick={this.cancelEditing}
          btnStyle="simple"
          size="small"
          icon="cancel-1"
        >
          Discard
        </Button>
        {this.renderCancelButton()}
        <Button
          disabled={disabled}
          onClick={this.onSend}
          btnStyle="success"
          size="small"
          icon="send"
        >
          Send
        </Button>
      </EditorActions>
    );
  }

  render() {
    const props = {
      editorState: this.state.editorState,
      onChange: this.changeContent
    };

    const onClickIsCC = () => this.onClick('isCc');
    const onClickIsBCC = () => this.onClick('isBcc');
    const formOnChange = e =>
      this.onChange('from', (e.target as HTMLInputElement).value);
    const textOnChange = e =>
      this.onChange('subject', (e.target as HTMLInputElement).value);

    return (
      <MailEditorWrapper>
        <ControlWrapper>
          <span>To</span>
          {this.renderToEmails()}

          <LeftSection>
            <Resipients onClick={onClickIsCC} isActive={this.state.isCc}>
              Cc
            </Resipients>
            <Resipients onClick={onClickIsBCC} isActive={this.state.isBcc}>
              Bcc
            </Resipients>
          </LeftSection>
        </ControlWrapper>
        {this.renderCC()}
        {this.renderBCC()}

        <ControlWrapper>
          <span>From</span>
          <FormControl
            componentClass="select"
            onChange={formOnChange}
            value={this.state.from}
          >
            <option />
            {this.renderFromOption()}
          </FormControl>
        </ControlWrapper>

        <ControlWrapper>
          <FormControl
            type="text"
            onChange={textOnChange}
            placeholder="Subject"
            value={this.state.subject}
          />
        </ControlWrapper>

        <ErxesEditor {...props} />

        {this.renderAttachmentPreview()}
        {this.renderAttachments()}
        {this.renderButtons()}
      </MailEditorWrapper>
    );
  }
}

export default MailForm;
