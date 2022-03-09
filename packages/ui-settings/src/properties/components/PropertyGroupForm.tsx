import { RenderDynamicComponent } from "@erxes/ui/src/utils/core";
import Button from "@erxes/ui/src/components/Button";
import FormControl from "@erxes/ui/src/components/form/Control";
import Form from "@erxes/ui/src/components/form/Form";
import FormGroup from "@erxes/ui/src/components/form/Group";
import ControlLabel from "@erxes/ui/src/components/form/Label";
import Toggle from "@erxes/ui/src/components/Toggle";
import { ModalFooter } from "@erxes/ui/src/styles/main";
import { IButtonMutateProps, IFormProps } from "@erxes/ui/src/types";
import React from "react";
import { IBoardSelectItem, IFieldGroup } from "../types";

type Props = {
  group?: IFieldGroup;
  type: string;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
};

type State = {
  isVisible: boolean;
  isVisibleInDetail: boolean;
  selectedItems: IBoardSelectItem[];
  config: any;
};
class PropertyGroupForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    let isVisible = true;
    let isVisibleInDetail = true;
    let selectedItems = [];

    if (props.group) {
      isVisible = props.group.isVisible;
      isVisibleInDetail = props.group.isVisibleInDetail;
      selectedItems = props.group.boardsPipelines || [];
    }

    this.state = {
      config: {},
      isVisible,
      isVisibleInDetail,
      selectedItems,
    };
  }

  generateDoc = (values: {
    _id?: string;
    name: string;
    description: string;
  }) => {
    const { group, type } = this.props;
    const finalValues = values;
    const selectedItems = this.state.selectedItems;

    if (group) {
      finalValues._id = group._id;
    }

    const boardsPipelines =
      selectedItems &&
      selectedItems.map((e) => {
        const boardsPipeline = {
          boardId: e.boardId,
          pipelineIds: e.pipelineIds,
        };

        return boardsPipeline;
      });

    return {
      ...finalValues,
      contentType: type,
      isVisible: this.state.isVisible,
      isVisibleInDetail: this.state.isVisibleInDetail,
      boardsPipelines,
    };
  };

  visibleHandler = (e) => {
    if (e.target.id === "visible") {
      const isVisible = e.target.checked;

      return this.setState({ isVisible });
    }

    const isVisibleInDetail = e.target.checked;

    return this.setState({ isVisibleInDetail });
  };

  itemsChange = (items: IBoardSelectItem[]) => {
    this.setState({ selectedItems: items });
  };

  renderFieldVisible() {
    if (!this.props.group) {
      return null;
    }

    const Checked = () => <span>And</span>;
    const UnChecked = () => <span>Or</span>;

    return (
      <FormGroup>
        <ControlLabel>Visible</ControlLabel>
        <div>
          <Toggle
            id="visible"
            checked={this.state.isVisible}
            onChange={this.visibleHandler}
            icons={{ checked: <Checked />, unchecked: <UnChecked /> }}
          />
        </div>
      </FormGroup>
    );
  }

  renderFieldVisibleInDetail() {
    if (!this.props.group) {
      return null;
    }

    return (
      <FormGroup>
        <ControlLabel>Visible in detail</ControlLabel>
        <div>
          <Toggle
            id="visibleDetail"
            checked={this.state.isVisibleInDetail}
            onChange={this.visibleHandler}
            icons={{
              checked: <span>Yes</span>,
              unchecked: <span>No</span>,
            }}
          />
        </div>
      </FormGroup>
    );
  }

  onChangeConfig = (config) => {
    console.log("mmmmm", config);

    this.setState({ config });
  };

  renderExtraContent() {
    const { type } = this.props;
    const plugins: any[] = (window as any).plugins || [];

    for (const plugin of plugins) {
      if (type.includes(`${plugin.name}:`) && plugin.propertyGroupForm) {
        return (
          <RenderDynamicComponent
            scope={plugin.scope}
            component={plugin.propertyGroupForm}
            injectedProps={{
              type: this.props.type,
              onChangeConfig: this.onChangeConfig
            }}
          />
        );
      }
    }

    return null;
  }

  renderContent = (formProps: IFormProps) => {
    const { group, closeModal, renderButton } = this.props;
    const { values, isSubmitted } = formProps;

    const object = group || ({} as IFieldGroup);

    return (
      <>
        <FormGroup>
          <ControlLabel required={true}>Name</ControlLabel>
          <FormControl
            {...formProps}
            name="name"
            autoFocus={true}
            required={true}
            defaultValue={object.name}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel required={true}>Description</ControlLabel>
          <FormControl
            {...formProps}
            name="description"
            required={true}
            defaultValue={object.description}
          />
        </FormGroup>

        {this.renderFieldVisible()}
        {this.renderExtraContent()}

        {["visitor", "lead", "customer"].includes(object.contentType) ? (
          this.renderFieldVisibleInDetail()
        ) : (
          <></>
        )}

        <ModalFooter>
          <Button btnStyle="simple" onClick={closeModal} icon="times-circle">
            Close
          </Button>

          {renderButton({
            name: "property group",
            values: this.generateDoc(values),
            isSubmitted,
            callback: closeModal,
            object: group,
          })}
        </ModalFooter>
      </>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default PropertyGroupForm;
