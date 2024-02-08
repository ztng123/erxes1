import Form from '@erxes/ui/src/components/form/Form';
import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import Button from '@erxes/ui/src/components/Button';
import { ModalFooter } from '@erxes/ui/src/styles/main';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import Datetime from '@nateradebaugh/react-datetime';
import dayjs from 'dayjs';
import { IMenu, IType } from '../types';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import { __ } from '@erxes/ui/src/utils';
import React from 'react';
import { ICommonFormProps } from '@erxes/ui-settings/src/common/types';
import EditorCK from '@erxes/ui/src/components/EditorCK';

type Props = {
  closeModal?: () => void;
  afterSave: () => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  menu?: IMenu;
  menus?: IMenu[];
  types?: IType[];
} & ICommonFormProps;

type State = {
  expiryDate?: Date;
  title?: String;
  content?: String;
  showTitle?: Boolean;
};

type IItem = {
  order?: string;
  name: string;
  _id: string;
};

class FormComponent extends React.Component<Props & ICommonFormProps, State> {
  constructor(props: Props) {
    super(props);

    const { menu } = this.props;

    this.state = {
      expiryDate: menu
        ? menu.expiryDate
        : dayjs()
            .add(30, 'day')
            .toDate(),
      title: menu ? menu.title : '', // 타이틀 상태 추가
      content: menu ? menu.content : '', // 내용 상태 추가
      showTitle: menu ? menu.showTitle : true // 타이틀 표시 여부 상태 추가
    };
  }
  onDateChange(value) {
    this.setState({ expiryDate: value });
  }
  onTitleChange = e => {
    this.setState({ title: e.target.value });
  };

  // 내용 변경 핸들러 (EditorCK 사용)
  onContentChange = content => {
    this.setState({ content });
  };

  // 타이틀 표시 여부 토글 핸들러
  onToggleShowTitle = () => {
    this.setState(prevState => ({ showTitle: !prevState.showTitle }));
  };

  generateDoc = values => {
    const { menu } = this.props;

    const finalValues = values;

    if (menu) {
      finalValues._id = menu._id;
    }

    return {
      ...finalValues,
      expiryDate: this.state.expiryDate,
      title: this.state.title,
      content: this.state.content,
      showTitle: this.state.showTitle
    };
  };

  generateTagOptions = (types: IItem[]) => {
    const result: React.ReactNode[] = [];

    for (const type of types) {
      result.push(
        <option key={type._id} value={type._id}>
          {type.name}
        </option>
      );
    }

    return result;
  };

  renderContent = (formProps: IFormProps) => {
    const { expiryDate, title, content, showTitle } = this.state;
    const { menu, types, afterSave, closeModal, renderButton } = this.props;
    const { values, isSubmitted } = formProps;
    const object = menu || ({} as IMenu);

    return (
      <>
        <FormGroup>
          <ControlLabel required={true}>Todo</ControlLabel>
          <FormControl
            name="title"
            defaultValue={title}
            type="text"
            required={true}
            onChange={this.onTitleChange}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Show Title</ControlLabel>
          <FormControl
            name="showTitle"
            type="checkbox"
            checked={!!this.state.showTitle}
            onChange={this.onToggleShowTitle}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel required={true}>Content</ControlLabel>
          <EditorCK
            content={'${this.state.content}'}
            onChange={this.onContentChange}
          />
        </FormGroup>

        {types && (
          <FormGroup>
            <ControlLabel required={true}>Category</ControlLabel>

            <FormControl
              {...formProps}
              name="typeId"
              componentClass="select"
              defaultValue={object.typeId}
            >
              {this.generateTagOptions(types)}
            </FormControl>
          </FormGroup>
        )}

        <ModalFooter id={'AddTagButtons'}>
          <Button btnStyle="simple" onClick={closeModal} icon="times-circle">
            Cancel
          </Button>

          {renderButton({
            passedName: 'menu',
            values: this.generateDoc(formProps.values),
            isSubmitted: formProps.isSubmitted,
            callback: closeModal || afterSave,
            object: this.props.menu
          })}
        </ModalFooter>
      </>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default FormComponent;
