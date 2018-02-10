import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { Modal } from 'react-bootstrap';
import CopyToClipboard from 'react-copy-to-clipboard';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
  EmptyState
} from 'modules/common/components';
import SelectBrand from '../SelectBrand';
import { MarkdownWrapper } from 'modules/settings/styles';

const propTypes = {
  topic: PropTypes.object,
  save: PropTypes.func.isRequired,
  remove: PropTypes.func,
  brands: PropTypes.array.isRequired
};

const contextTypes = {
  closeModal: PropTypes.func.isRequired
};

class KnowledgeForm extends Component {
  constructor(props, context) {
    super(props, context);

    let code = '';

    // showed install code automatically in edit mode
    if (props.topic) {
      code = this.constructor.getInstallCode(props.topic._id);
    }

    this.state = {
      code,
      copied: false
    };

    this.handleBrandChange = this.handleBrandChange.bind(this);
    this.save = this.save.bind(this);
    this.remove = this.remove.bind(this);
  }

  save(e) {
    e.preventDefault();

    this.props.save(
      this.generateDoc(),
      () => {
        this.context.closeModal();
      },
      this.props.topic
    );
  }

  remove() {
    const { remove, topic } = this.props;

    remove(topic._id);
  }

  static installCodeIncludeScript() {
    return `
      (function() {
        var script = document.createElement('script');
        script.src = "${
          process.env.REACT_APP_CDN_HOST
        }/knowledgeBaseWidget.bundle.js";
        script.async = true;

        var entry = document.getElementsByTagName('script')[0];
        entry.parentNode.insertBefore(script, entry);
      })();
    `;
  }

  static getInstallCode(topicId) {
    return `
      <script>
        window.erxesSettings = {
          knowledgeBase: {
            topic_id: "${topicId}"
          },
        };
        ${KnowledgeForm.installCodeIncludeScript()}
      </script>
    `;
  }

  renderInstallCode() {
    if (this.props.topic && this.props.topic._id) {
      return (
        <FormGroup>
          <ControlLabel>Install code</ControlLabel>
          <MarkdownWrapper>
            <ReactMarkdown source={this.state.code} />
            {this.state.code ? (
              <CopyToClipboard
                text={this.state.code}
                onCopy={() => this.setState({ copied: true })}
              >
                <Button size="small" btnStyle="primary" icon="ios-copy-outline">
                  {this.state.copied ? 'Copied' : 'Copy to clipboard'}
                </Button>
              </CopyToClipboard>
            ) : (
              <EmptyState icon="code" text="No copyable code" size="small" />
            )}
          </MarkdownWrapper>
        </FormGroup>
      );
    } else {
      return null;
    }
  }

  handleBrandChange() {
    if (this.props.topic && this.props.topic._id) {
      const code = this.constructor.getInstallCode(this.props.topic._id);
      this.setState({ code, copied: false });
    }
  }

  generateDoc() {
    const { topic } = this.props;

    return {
      ...topic,
      doc: {
        doc: {
          title: document.getElementById('knowledgebase-title').value,
          description: document.getElementById('knowledgebase-description')
            .value,
          brandId: document.getElementById('selectBrand').value
        }
      }
    };
  }

  renderContent(topic = {}) {
    const { brands } = this.props;
    const { brand } = topic;
    const brandId = brand != null ? brand._id : '';

    return (
      <div>
        <FormGroup>
          <ControlLabel>Title</ControlLabel>
          <FormControl
            id="knowledgebase-title"
            type="text"
            defaultValue={topic.title}
            required
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Description</ControlLabel>
          <FormControl
            id="knowledgebase-description"
            type="text"
            defaultValue={topic.description}
          />
        </FormGroup>

        <FormGroup>
          <SelectBrand
            brands={brands}
            defaultValue={brandId}
            onChange={this.handleBrandChange}
          />
        </FormGroup>

        {this.renderInstallCode()}
      </div>
    );
  }

  render() {
    const { topic } = this.props;

    const onClick = () => {
      this.context.closeModal();
    };

    return (
      <form onSubmit={this.save}>
        {this.renderContent(topic || {})}
        <Modal.Footer>
          <Button
            btnStyle="simple"
            type="button"
            onClick={onClick}
            icon="close"
          >
            Cancel
          </Button>
          {topic && (
            <Button
              btnStyle="danger"
              type="button"
              onClick={this.remove}
              icon="close"
            >
              Delete
            </Button>
          )}
          <Button btnStyle="success" type="submit" icon="checkmark">
            Save
          </Button>
        </Modal.Footer>
      </form>
    );
  }
}

KnowledgeForm.propTypes = propTypes;
KnowledgeForm.contextTypes = contextTypes;

export default KnowledgeForm;
