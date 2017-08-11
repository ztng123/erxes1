import React, { PropTypes, Component } from 'react';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  ButtonToolbar,
  Modal,
  Button,
} from 'react-bootstrap';

import { METHODS } from '/imports/api/engage/constants';
import Editor from './Editor';

class WidgetForm extends Component {
  constructor(props) {
    super(props);

    this.state = { content: '', channel: 'email' };

    this.onContentChange = this.onContentChange.bind(this);
    this.onChannelChange = this.onChannelChange.bind(this);
    this.save = this.save.bind(this);
  }

  save(e) {
    e.preventDefault();

    const { save, customers } = this.props;

    const doc = {
      title: document.getElementById('title').value,
      customerIds: customers.map(customer => customer._id.toString()),
      fromUserId: Meteor.userId(),
    };

    if (this.state.channel === 'email') {
      doc.method = METHODS.EMAIL;
      doc.email = {
        templateId: document.getElementById('emailTemplateId').value,
        subject: document.getElementById('emailSubject').value,
        content: this.state.content,
      };
    }

    if (this.state.channel === 'messenger') {
      doc.method = METHODS.MESSENGER;
      doc.messenger = {
        brandId: document.getElementById('brandId').value,
        kind: document.getElementById('messengerKind').value,
        sentAs: document.getElementById('sentAs').value,
        content: this.state.content,
      };
    }

    return save(doc, () => {
      this.context.closeModal();
    });
  }

  onContentChange(content) {
    this.setState({ content });
  }

  onChannelChange(e) {
    this.setState({ channel: e.target.value });
  }

  renderCustomers() {
    return (
      <FormGroup>
        <ControlLabel>To:</ControlLabel>
        <div className="recipients">
          {this.props.customers.map(customer => (
            <div className="recipient" key={customer._id.toString()}>
              <strong>{customer.name}</strong> {customer.email}
            </div>
          ))}
        </div>
      </FormGroup>
    );
  }

  renderEmailContent() {
    if (this.state.channel === 'email') {
      return (
        <div>
          <FormGroup>
            <ControlLabel>Email subject:</ControlLabel>
            <FormControl id="emailSubject" type="text" required />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Email templates:</ControlLabel>

            <FormControl id="emailTemplateId" componentClass="select">
              <option />
              {this.props.emailTemplates.map(t => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </FormControl>
          </FormGroup>
        </div>
      );
    }
  }

  renderMessengerContent() {
    if (this.state.channel === 'messenger') {
      return (
        <div>
          <FormGroup>
            <ControlLabel>Brand:</ControlLabel>

            <FormControl id="brandId" componentClass="select">
              <option />
              {this.props.brands.map((b, index) => (
                <option key={`brand-${index}`} value={b._id}>
                  {b.name}
                </option>
              ))}
            </FormControl>
          </FormGroup>

          <FormGroup>
            <ControlLabel>Messenger kind:</ControlLabel>

            <FormControl id="messengerKind" componentClass="select">
              <option />
              {this.props.messengerKinds.map((t, index) => (
                <option key={`messengerKind-${index}`} value={t.value}>
                  {t.text}
                </option>
              ))}
            </FormControl>
          </FormGroup>

          <FormGroup>
            <ControlLabel>Sent as:</ControlLabel>

            <FormControl id="sentAs" componentClass="select">
              <option />
              {this.props.sentAsChoices.map((t, index) => (
                <option key={`sentAs-${index}`} value={t.value}>
                  {t.text}
                </option>
              ))}
            </FormControl>
          </FormGroup>
        </div>
      );
    }
  }

  render() {
    return (
      <form onSubmit={this.save}>
        {this.renderCustomers()}

        <FormGroup>
          <ControlLabel>Channel:</ControlLabel>

          <FormControl componentClass="select" onChange={this.onChannelChange}>
            <option value="email">Email</option>
            <option value="messenger">Messenger</option>
          </FormControl>
        </FormGroup>

        <FormGroup>
          <ControlLabel>Title:</ControlLabel>
          <FormControl id="title" type="text" required />
        </FormGroup>

        {this.renderEmailContent()}
        {this.renderMessengerContent()}

        <FormGroup>
          <ControlLabel>Content:</ControlLabel>
          <div className="editor-bordered">
            <Editor onChange={this.onContentChange} />
          </div>
        </FormGroup>

        <Modal.Footer>
          <ButtonToolbar className="pull-right">
            <Button type="submit" bsStyle="primary">
              Send
            </Button>
          </ButtonToolbar>
        </Modal.Footer>
      </form>
    );
  }
}

WidgetForm.propTypes = {
  customers: PropTypes.array.isRequired,
  emailTemplates: PropTypes.array.isRequired,
  brands: PropTypes.array.isRequired,
  messengerKinds: PropTypes.array.isRequired,
  sentAsChoices: PropTypes.array.isRequired,
  save: PropTypes.func.isRequired,
};

WidgetForm.contextTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default WidgetForm;
