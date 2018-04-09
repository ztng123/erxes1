import React from 'react';
import Select from 'react-select-plus';
import PropTypes from 'prop-types';
import { ModalTrigger } from 'modules/common/components';
import { CommonMerge } from '../';

const propTypes = {
  onSave: PropTypes.func.isRequired,
  object: PropTypes.object.isRequired,
  searchObject: PropTypes.func,
  basicInfos: PropTypes.object
};

class TargetMergeModal extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      objects: [],
      selectedObject: {}
    };

    this.onSelect = this.onSelect.bind(this);
  }

  generateOptions(objects) {
    return objects.map((object, key) => ({
      key,
      value: JSON.stringify(object),
      label:
        object.firstName || object.name || object.email || object.phone || 'N/A'
    }));
  }

  onSelect(option) {
    this.setState({ selectedObject: JSON.parse(option.value) });
  }

  renderMerger() {
    const { object, onSave, basicInfos } = this.props;
    const { selectedObject } = this.state;

    return (
      <CommonMerge
        datas={[object, selectedObject]}
        save={onSave}
        basicInfos={basicInfos}
      />
    );
  }

  renderSelect() {
    const { objects } = this.state;
    const { searchObject } = this.props;

    return (
      <Select
        placeholder="Search..."
        onInputChange={value =>
          searchObject(value, objects => this.setState({ objects }))
        }
        onChange={this.onSelect}
        options={this.generateOptions(objects)}
      />
    );
  }

  render() {
    const { __ } = this.context;

    return (
      <ModalTrigger
        title={__('Merge')}
        trigger={<a>{__('Merge')}</a>}
        size="lg"
      >
        {this.renderSelect()}
        <br />
        {this.renderMerger()}
      </ModalTrigger>
    );
  }
}

TargetMergeModal.propTypes = propTypes;
TargetMergeModal.contextTypes = {
  __: PropTypes.func
};

export default TargetMergeModal;
