import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import {
  Button,
  ControlLabel,
  Form as CommonForm,
  FormControl,
  FormGroup,
  DateControl,
  Uploader
} from '@erxes/ui/src/components';
import {
  MainStyleFormColumn as FormColumn,
  MainStyleFormWrapper as FormWrapper,
  MainStyleModalFooter as ModalFooter,
  MainStyleScrollWrapper as ScrollWrapper,
  MainStyleDateContainer as DateContainer
} from '@erxes/ui/src/styles/eindex';
import {
  IAttachment,
  IButtonMutateProps,
  IFormProps
} from '@erxes/ui/src/types';
import { ISPLabel } from '../types';
import Select from 'react-select-plus';
import { extractAttachment, __ } from '@erxes/ui/src/utils';
import SelectProducts from '@erxes/ui-products/src/containers/SelectProducts';
import SelectProductCategory from '@erxes/ui-products/src/containers/SelectProductCategory';
import Popover from 'react-bootstrap/Popover';
import TwitterPicker from 'react-color/lib/Twitter';
import { ColorPick, ColorPicker } from '@erxes/ui/src/styles/main';
import { COLORS } from '../../constants';

type Props = {
  spLabel?: ISPLabel;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
};

type State = {
  spLabel: ISPLabel;
};

class Form extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      spLabel: this.props.spLabel || {}
    };
  }

  generateDoc = (values: { _id?: string }) => {
    const finalValues = values;
    const { spLabel } = this.state;

    if (spLabel._id) {
      finalValues._id = spLabel._id;
    }

    spLabel.multiplier = Number(spLabel.multiplier || 0);
    console.log('222222222222222', finalValues, spLabel);
    return {
      ...finalValues,
      ...spLabel
    };
  };

  onChangeDescription = e => {
    this.setState({
      spLabel: {
        ...this.state.spLabel,
        description: e.editor.getData()
      }
    });
  };

  onInputChange = e => {
    e.preventDefault();
    const value = e.target.value;
    const name = e.target.name;
    console.log(name, value);

    this.setState({
      spLabel: { ...this.state.spLabel, [name]: value }
    });
  };

  renderContent = (formProps: IFormProps) => {
    const { renderButton, closeModal } = this.props;
    const { values, isSubmitted } = formProps;

    const { spLabel } = this.state;
    const onChangeColor = e => {
      spLabel.color = e.hex;
      this.setState({ spLabel });
    };

    const popoverContent = (
      <Popover id={Math.random()}>
        <TwitterPicker
          color={{ hex: spLabel.color }}
          onChange={onChangeColor}
          triangle="hide"
        />
      </Popover>
    );

    return (
      <>
        <ScrollWrapper>
          <FormGroup>
            <ControlLabel required={true}>{__(`Title`)}</ControlLabel>
            <FormControl
              {...formProps}
              name="title"
              defaultValue={spLabel.title}
              autoFocus={true}
              required={true}
              onChange={this.onInputChange}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel required={true}>{__(`Effect`)}</ControlLabel>
            <FormControl
              {...formProps}
              name="effect"
              defaultValue={spLabel.effect}
              required={true}
              onChange={this.onInputChange}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel required={true}>{__(`Multiplier`)}</ControlLabel>
            <FormControl
              {...formProps}
              name="multiplier"
              type="number"
              min={0}
              required={false}
              defaultValue={spLabel.multiplier}
              onChange={this.onInputChange}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>{__('Color')}</ControlLabel>
            <div>
              <OverlayTrigger
                trigger="click"
                rootClose={true}
                placement="bottom-start"
                overlay={popoverContent}
              >
                <ColorPick>
                  <ColorPicker style={{ backgroundColor: spLabel.color }} />
                </ColorPick>
              </OverlayTrigger>
            </div>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Description</ControlLabel>
            <FormControl
              {...formProps}
              componentClass="textarea"
              name="description"
              defaultValue={spLabel.description}
              onChange={this.onInputChange}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Status</ControlLabel>
            <FormControl
              name="status"
              componentClass="select"
              defaultValue={spLabel.status}
              required={false}
              onChange={this.onInputChange}
            >
              <option key={'active'} value={'active'}>
                {' '}
                {'active'}{' '}
              </option>
              <option key={'archived'} value={'archived'}>
                {' '}
                {'archived'}{' '}
              </option>
            </FormControl>
          </FormGroup>
        </ScrollWrapper>
        <ModalFooter>
          <Button
            btnStyle="simple"
            onClick={closeModal}
            icon="times-circle"
            uppercase={false}
          >
            Close
          </Button>

          {renderButton({
            values: this.generateDoc(values),
            isSubmitted,
            callback: closeModal,
            object: spLabel
          })}
        </ModalFooter>
      </>
    );
  };

  render() {
    return <CommonForm renderContent={this.renderContent} />;
  }
}

export default Form;
