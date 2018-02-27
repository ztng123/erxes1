import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import {
  ControlLabel,
  FormGroup,
  FormControl,
  Button,
  Icon
} from 'modules/common/components';
import { TypeList, AddOption, Actions } from '../styles';

const propTypes = {
  add: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  field: PropTypes.object,
  groups: PropTypes.array.isRequired
};

const contextTypes = {
  closeModal: PropTypes.func.isRequired
};

class PropertyForm extends Component {
  constructor(props) {
    super(props);

    let action = props.add;
    let doc = {};

    if (props.field) {
      doc = {
        ...props.field
      };

      if (
        props.field.type === 'select' ||
        props.field.type === 'radio' ||
        props.field.type === 'check'
      ) {
        doc = {
          ...props.field,
          hasOptions: true,
          options: Object.assign([], props.field.options || [])
        };
      }
    }

    if (props.field) {
      action = props.edit;
    }

    this.state = {
      options: [],
      hasOptions: false,
      ...doc,
      action
    };

    this.handleAddOption = this.handleAddOption.bind(this);
    this.renderOption = this.renderOption.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
    this.handleSaveOption = this.handleSaveOption.bind(this);
    this.renderButtonOrElement = this.renderButtonOrElement.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
    this.handleCancelAddingOption = this.handleCancelAddingOption.bind(this);
    this.handleRemoveOption = this.handleRemoveOption.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const groupId = document.getElementById('groupId').value;
    const validation = document.getElementById('validation').value;
    const text = document.getElementById('text').value;
    const description = document.getElementById('description').value;

    const { type, options } = this.state;

    const doc = {
      type,
      validation,
      text,
      description,
      options,
      groupId
    };

    this.state.action(
      this.props.field ? { _id: this.props.field._id, doc } : { doc }
    );

    this.context.closeModal();
  }

  onTypeChange(e) {
    const value = e.target.value;
    let doc = { hasOptions: false, options: [] };

    if (value === 'select' || value === 'check' || value === 'radio') {
      doc = { hasOptions: true };
    }

    this.setState({ type: value, ...doc });
  }

  handleAddOption() {
    this.setState({ add: true });
  }

  handleCancelAddingOption() {
    this.setState({ add: false, optionValue: '' });
  }

  handleSaveOption() {
    const { options } = this.state;
    const optionValue = document.getElementById('optionValue').value;

    this.setState({ options: [...options, optionValue] });

    this.handleCancelAddingOption();
  }

  handleRemoveOption(index) {
    const { options } = this.state;

    this.setState({
      options: options.splice(index, 1) && options
    });
  }

  renderButtonOrElement() {
    if (this.state.add) {
      return (
        <div>
          <FormControl
            id="optionValue"
            autoFocus
            onKeyPress={e => {
              if (e.key === 'Enter') this.handleSaveOption;
            }}
          />
          <Actions>
            <Button
              type="success"
              btnStyle="simple"
              size="small"
              onClick={this.handleSaveOption}
            >
              Cancel
            </Button>
            <Button
              type="success"
              btnStyle="success"
              size="small"
              onClick={this.handleSaveOption}
            >
              Save
            </Button>
          </Actions>
        </div>
      );
    }

    return (
      <AddOption onClick={this.handleAddOption}>
        <Icon icon="plus" /> Add an option
      </AddOption>
    );
  }

  renderOption(option, index) {
    return (
      <li key={index}>
        {option}
        <Icon icon="close" onClick={() => this.handleRemoveOption(index)} />
      </li>
    );
  }

  renderOptions() {
    if (!this.state.hasOptions) return null;

    return (
      <TypeList>
        {this.state.options.map((option, index) =>
          this.renderOption(option, index)
        )}
        {this.renderButtonOrElement()}
      </TypeList>
    );
  }

  render() {
    const { groups, field = {} } = this.props;
    const { type } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <FormGroup>
          <ControlLabel htmlFor="type">Type:</ControlLabel>

          <FormControl
            componentClass="select"
            value={type}
            onChange={this.onTypeChange}
          >
            <option />
            <option value="input">Input</option>
            <option value="textarea">Text area</option>
            <option value="select">Select</option>
            <option value="check">Checkbox</option>
            <option value="radio">Radio button</option>
            <option value="email">Email</option>
            <option value="firstName">First name</option>
            <option value="lastName">Last name</option>
          </FormControl>
        </FormGroup>
        {this.renderOptions()}

        <FormGroup>
          <ControlLabel htmlFor="validation">Validation:</ControlLabel>

          <FormControl
            componentClass="select"
            id="validation"
            defaultValue={field.validation || ''}
          >
            <option />
            <option value="email">Email</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
          </FormControl>
        </FormGroup>

        <FormGroup>
          <ControlLabel htmlFor="text">Text:</ControlLabel>
          <FormControl type="text" id="text" defaultValue={field.text || ''} />
        </FormGroup>

        <FormGroup>
          <ControlLabel htmlFor="description">Description:</ControlLabel>
          <FormControl
            id="description"
            componentClass="textarea"
            defaultValue={field.description || ''}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel htmlFor="description">Group:</ControlLabel>
          <FormControl
            id="groupId"
            componentClass="select"
            defaultValue={field.groupId || groups[0]._id}
          >
            {groups.map(group => {
              return (
                <option key={group._id} value={group._id}>
                  {group.name}
                </option>
              );
            })}
          </FormControl>
        </FormGroup>

        <Modal.Footer>
          <Button
            btnStyle="simple"
            onClick={() => {
              this.context.closeModal();
            }}
            icon="close"
          >
            Close
          </Button>

          <Button btnStyle="success" type="submit" icon="checkmark">
            Save
          </Button>
        </Modal.Footer>
      </form>
    );
  }
}

PropertyForm.contextTypes = contextTypes;
PropertyForm.propTypes = propTypes;

export default PropertyForm;
