import Button from '@erxes/ui/src/components/Button';
import FormControl from '@erxes/ui/src/components/form/Control';
import Form from '@erxes/ui/src/components/form/Form';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { ModalFooter } from '@erxes/ui/src/styles/main';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import React from 'react';
import { ISkillTypesDocument } from '@erxes/ui-settings/src/skills/types';

type Props = {
  closeModal: () => void;
  object: ISkillTypesDocument;
  refetch: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

function SkillTypeForm({ closeModal, object, renderButton }: Props) {
  const generateDoc = (values: { _id?: string; name: string }) => {
    const item = object || ({} as ISkillTypesDocument);

    if (item._id) {
      values._id = item._id;
    }

    return values;
  };

  const renderContent = (formProps: IFormProps) => {
    const { values, isSubmitted } = formProps;
    const item = object || ({} as ISkillTypesDocument);

    if (item) {
      values._id = item._id;
    }

    return (
      <>
        <ControlLabel>Name</ControlLabel>
        <FormControl
          {...formProps}
          name='name'
          defaultValue={item.name}
          autoFocus={true}
          required={true}
        />
        <ModalFooter>
          <Button
            btnStyle='simple'
            type='button'
            onClick={closeModal}
            icon='times-circle'
          >
            Cancel
          </Button>

          {renderButton({
            name: 'skill type',
            values: generateDoc(values),
            isSubmitted,
            callback: closeModal,
            object
          })}
        </ModalFooter>
      </>
    );
  };

  return <Form renderContent={renderContent} />;
}

export default SkillTypeForm;
