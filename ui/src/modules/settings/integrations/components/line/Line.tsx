import FormControl from "modules/common/components/form/Control";
import Form from "modules/common/components/form/Form";
import FormGroup from "modules/common/components/form/Group";
import ControlLabel from "modules/common/components/form/Label";
import Spinner from "modules/common/components/Spinner";
import { ModalFooter } from "modules/common/styles/main";
import { IButtonMutateProps, IFormProps } from "modules/common/types";
import React from "react";
import SelectBrand from "../../containers/SelectBrand";

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
};

class Line extends React.Component<Props, { loading: boolean }> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  generateDoc = (values: {
    name: string;
    channelId: string;
    channelSecret: string;
    brandId: string;
  }) => {
    return {
      name: values.name,
      brandId: values.brandId,
      kind: "smooch-line",
      data: {
        displayName: values.name,
        channelId: values.channelId,
        channelSecret: values.channelSecret
      }
    };
  };

  renderContent = (formProps: IFormProps) => {
    const { renderButton } = this.props;
    const { values, isSubmitted } = formProps;

    return (
      <>
        {this.state.loading && <Spinner />}
        <FormGroup>
          <ControlLabel required={true}>Name</ControlLabel>
          <FormControl {...formProps} name="name" required={true} />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Line Channel ID</ControlLabel>
          <FormControl
            {...formProps}
            type="text"
            name="channelId"
            required={true}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Line Channel Secret</ControlLabel>
          <FormControl
            {...formProps}
            type="text"
            name="channelSecret"
            required={true}
          />
        </FormGroup>

        <SelectBrand isRequired={true} formProps={formProps} />

        <ModalFooter>
          {renderButton({
            name: "integration",
            values: this.generateDoc(values),
            isSubmitted,
            callback: this.props.closeModal
          })}
        </ModalFooter>
      </>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default Line;
