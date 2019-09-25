import Datetime from '@nateradebaugh/react-datetime';
import client from 'apolloClient';
import gql from 'graphql-tag';
import { COLORS } from 'modules/boards/constants';
import { FlexContent } from 'modules/boards/styles/item';
import { IPipeline } from 'modules/boards/types';
import Button from 'modules/common/components/Button';
import FormControl from 'modules/common/components/form/Control';
import Form from 'modules/common/components/form/Form';
import FormGroup from 'modules/common/components/form/Group';
import ControlLabel from 'modules/common/components/form/Label';
import { colors } from 'modules/common/styles';
import { IButtonMutateProps, IFormProps } from 'modules/common/types';
import { __ } from 'modules/common/utils';
import { SelectMemberStyled } from 'modules/settings/boards/styles';
import { ColorPick, ColorPicker, ExpandWrapper } from 'modules/settings/styles';
import SelectTeamMembers from 'modules/settings/team/containers/SelectTeamMembers';
import React from 'react';
import { Modal, OverlayTrigger, Popover } from 'react-bootstrap';
import BlockPicker from 'react-color/lib/Block';
import Select from 'react-select-plus';
import { metricOptions } from '../constants';
import { queries } from '../graphql';
import { Box, DateItem } from '../styles';

type Props = {
  type: string;
  show: boolean;
  boardId: string;
  pipeline?: IPipeline;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
};

type State = {
  visibility: string;
  selectedMemberIds: string[];
  backgroundColor: string;
  hackScoringType: string;
  templates: any[];
  templateId?: string;
  metric?: string;
  startDate?: Date;
  endDate?: Date;
};

class PipelineForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { pipeline } = this.props;

    this.state = {
      visibility: pipeline ? pipeline.visibility || 'public' : 'public',
      selectedMemberIds: pipeline ? pipeline.memberIds || [] : [],
      backgroundColor:
        (pipeline && pipeline.bgColor) || colors.colorPrimaryDark,
      hackScoringType: (pipeline && pipeline.hackScoringType) || 'ice',
      templates: [],
      templateId: pipeline ? pipeline.templateId : '',
      metric: pipeline ? pipeline.metric : '',
      startDate: pipeline ? pipeline.startDate : undefined,
      endDate: pipeline ? pipeline.endDate : undefined
    };
  }

  getTemplates() {
    client
      .query({
        query: gql(queries.pipelineTemplates),
        variables: { type: 'growthHack' }
      })
      .then(({ data }: { data: any }) => {
        if (data && data.pipelineTemplates) {
          this.setState({ templates: data.pipelineTemplates });
        }
      })
      .catch(error => {
        console.log(error.message); // tslint:disable-line
      });
  }

  componentDidMount() {
    this.getTemplates();
  }

  onChangeVisibility = (e: React.FormEvent<HTMLElement>) => {
    this.setState({
      visibility: (e.currentTarget as HTMLInputElement).value
    });
  };

  onChangeType = (hackScoringType: string) => {
    this.setState({ hackScoringType });
  };

  onChangeTemplate = (value: any) => {
    this.setState({
      templateId: value ? value.value : ''
    });
  };

  onChangeMetric = (value: any) => {
    this.setState({
      metric: value ? value.value : ''
    });
  };

  onChangeMembers = items => {
    this.setState({ selectedMemberIds: items });
  };

  onDateInputChange = (type: string, date) => {
    if (type === 'endDate') {
      this.setState({ endDate: date });
    } else {
      this.setState({ startDate: date });
    }
  };

  collectValues = items => {
    return items.map(item => item.value);
  };

  onColorChange = e => {
    this.setState({ backgroundColor: e.hex });
  };

  generateDoc = (values: {
    _id?: string;
    name: string;
    visibility: string;
  }) => {
    const { pipeline, type, boardId } = this.props;
    const {
      selectedMemberIds,
      backgroundColor,
      templateId,
      hackScoringType,
      startDate,
      endDate,
      metric
    } = this.state;
    const finalValues = values;

    if (pipeline) {
      finalValues._id = pipeline._id;
    }

    return {
      ...finalValues,
      type,
      boardId: pipeline ? pipeline.boardId : boardId,
      memberIds: selectedMemberIds,
      bgColor: backgroundColor,
      templateId,
      hackScoringType,
      startDate,
      endDate,
      metric
    };
  };

  renderSelectMembers() {
    const { visibility, selectedMemberIds } = this.state;

    if (visibility === 'public') {
      return;
    }
    const self = this;

    const onChange = items => {
      self.setState({ selectedMemberIds: items });
    };

    return (
      <FormGroup>
        <SelectMemberStyled>
          <ControlLabel>Members</ControlLabel>

          <SelectTeamMembers
            label="Choose members"
            name="selectedMemberIds"
            value={selectedMemberIds}
            onSelect={onChange}
          />
        </SelectMemberStyled>
      </FormGroup>
    );
  }

  renderTemplates() {
    const { templates, templateId } = this.state;

    const templateOptions = templates.map(template => ({
      value: template._id,
      label: template.name
    }));

    return (
      <FormGroup>
        <ControlLabel>Template</ControlLabel>

        <Select
          placeholder={__('Choose template')}
          value={templateId}
          options={templateOptions}
          onChange={this.onChangeTemplate}
          clearable={false}
        />
      </FormGroup>
    );
  }

  renderBox(type, desc, formula) {
    const onClick = () => this.onChangeType(type);

    return (
      <Box selected={this.state.hackScoringType === type} onClick={onClick}>
        <b>{__(type)}</b>
        <p>
          {__(desc)} <strong>{formula}</strong>
        </p>
      </Box>
    );
  }

  renderContent = (formProps: IFormProps) => {
    const { pipeline, renderButton, closeModal } = this.props;
    const { values, isSubmitted } = formProps;
    const object = pipeline || ({} as IPipeline);
    const { startDate, endDate, metric, visibility } = this.state;

    const popoverTop = (
      <Popover id="color-picker">
        <BlockPicker
          width="266px"
          color={this.state.backgroundColor}
          onChange={this.onColorChange}
          colors={COLORS}
        />
      </Popover>
    );

    return (
      <>
        <Modal.Header closeButton={true}>
          <Modal.Title>{pipeline ? 'Edit project' : 'Add project'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormGroup>
            <ControlLabel required={true}>Name</ControlLabel>
            <FormControl
              {...formProps}
              name="name"
              defaultValue={object.name}
              autoFocus={true}
              required={true}
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Scoring type</ControlLabel>

            <FlexContent>
              {this.renderBox(
                'ice',
                'Set the Impact, Confidence and Ease factors for your tasks. Final score is calculated by the formula:',
                'Impact * Confidence * Ease'
              )}
              {this.renderBox(
                'rice',
                'Set the Reach, Impact, Confidence and Effort factors for your tasks. Final score is calculated by the formula:',
                '(Reach * Impact * Confidence) / Effort'
              )}
              {this.renderBox(
                'pie',
                'Set the Potential, Importance and Ease factors for your tasks. Final score is calculated by the formula:',
                '(Potential + Importance + Ease) / 3'
              )}
            </FlexContent>
          </FormGroup>

          <FormGroup>
            <FlexContent>
              <DateItem>
                <ControlLabel>Start date</ControlLabel>
                <Datetime
                  inputProps={{ placeholder: 'Start date' }}
                  dateFormat="MMM,DD YYYY"
                  timeFormat={false}
                  value={startDate}
                  closeOnSelect={true}
                  onChange={this.onDateInputChange.bind(this, 'startDate')}
                  utc={true}
                />
              </DateItem>
              <DateItem>
                <ControlLabel>End date</ControlLabel>
                <Datetime
                  inputProps={{ placeholder: 'End date' }}
                  dateFormat="MMM,DD YYYY"
                  timeFormat={false}
                  value={endDate}
                  closeOnSelect={true}
                  onChange={this.onDateInputChange.bind(this, 'endDate')}
                  utc={true}
                />
              </DateItem>
            </FlexContent>
          </FormGroup>

          <FormGroup>
            <ControlLabel>Metric</ControlLabel>
            <Select
              placeholder={__('Choose a metric')}
              value={metric}
              options={metricOptions}
              onChange={this.onChangeMetric}
              clearable={false}
            />
          </FormGroup>

          <FlexContent>
            <ExpandWrapper>
              <FormGroup>
                <ControlLabel required={true}>Visibility</ControlLabel>
                <FormControl
                  {...formProps}
                  name="visibility"
                  componentClass="select"
                  value={visibility}
                  onChange={this.onChangeVisibility}
                >
                  <option value="public">{__('Public')}</option>
                  <option value="private">{__('Private')}</option>
                </FormControl>
              </FormGroup>
            </ExpandWrapper>

            <FormGroup>
              <ControlLabel>Background</ControlLabel>
              <div>
                <OverlayTrigger
                  trigger="click"
                  rootClose={true}
                  placement="bottom"
                  overlay={popoverTop}
                >
                  <ColorPick>
                    <ColorPicker
                      style={{ backgroundColor: this.state.backgroundColor }}
                    />
                  </ColorPick>
                </OverlayTrigger>
              </div>
            </FormGroup>
          </FlexContent>

          {this.renderSelectMembers()}
          {this.renderTemplates()}

          <Modal.Footer>
            <Button
              btnStyle="simple"
              type="button"
              icon="cancel-1"
              onClick={closeModal}
            >
              Cancel
            </Button>

            {renderButton({
              name: 'pipeline',
              values: this.generateDoc(values),
              isSubmitted,
              callback: closeModal,
              object: pipeline
            })}
          </Modal.Footer>
        </Modal.Body>
      </>
    );
  };

  render() {
    const { show, closeModal } = this.props;

    if (!show) {
      return null;
    }

    return (
      <Modal show={show} onHide={closeModal} enforceFocus={false}>
        <Form renderContent={this.renderContent} />
      </Modal>
    );
  }
}

export default PipelineForm;
