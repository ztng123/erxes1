import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select-plus';
import { Button, FormGroup } from 'modules/common/components';
import { Alert } from 'modules/common/utils';
import { selectOptions } from '../../utils';
import { DealMoveFormContainer, Footer } from '../../styles';

class DealMoveForm extends React.Component {
  constructor(props) {
    super(props);

    this.move = this.move.bind(this);

    this.state = { stageId: props.stageId };
  }

  move() {
    const { __ } = this.context;
    const { stageId } = this.state;

    if (!stageId) return Alert.error(__('No stage'));

    this.props.moveDeal({ stageId });
  }

  onChangeStage(stage) {
    if (stage) {
      this.setState({ stageId: stage.value });
    }
  }

  renderSelect(placeholder, value, onChange, options) {
    return (
      <Select
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        optionRenderer={option => (
          <div className="simple-option">
            <span>{option.label}</span>
          </div>
        )}
        options={options}
        clearable={false}
      />
    );
  }

  render() {
    const { __ } = this.context;
    const { boards, pipelines, stages, boardId, pipelineId } = this.props;

    return (
      <DealMoveFormContainer>
        <form>
          <FormGroup>
            {this.renderSelect(
              __('Choose a board'),
              boardId,
              board => this.props.onChangeBoard(board),
              selectOptions(boards || [])
            )}
          </FormGroup>

          <FormGroup>
            {this.renderSelect(
              __('Choose a pipeline'),
              pipelineId,
              pipeline => this.props.onChangePipeline(pipeline),
              selectOptions(pipelines || [])
            )}
          </FormGroup>

          <FormGroup>
            {this.renderSelect(
              __('Choose a stage'),
              this.state.stageId,
              stage => this.onChangeStage(stage),
              selectOptions(stages || [])
            )}
          </FormGroup>

          <Footer>
            <Button btnStyle="simple" onClick={this.props.close} icon="close">
              Close
            </Button>

            <Button btnStyle="success" onClick={this.move} icon="checkmark">
              Move
            </Button>
          </Footer>
        </form>
      </DealMoveFormContainer>
    );
  }
}

const propTypes = {
  stageId: PropTypes.string,
  boards: PropTypes.array,
  pipelines: PropTypes.array,
  stages: PropTypes.array,
  boardId: PropTypes.string,
  pipelineId: PropTypes.string,
  close: PropTypes.func,
  onChangeBoard: PropTypes.func,
  onChangePipeline: PropTypes.func,
  moveDeal: PropTypes.func
};

DealMoveForm.propTypes = propTypes;
DealMoveForm.contextTypes = {
  __: PropTypes.func
};

export default DealMoveForm;
