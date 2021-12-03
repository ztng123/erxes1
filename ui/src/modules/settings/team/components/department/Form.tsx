import React, { useState } from 'react';
import Select from 'react-select-plus';
import { FormControl, FormGroup } from 'modules/common/components/form';
import { IButtonMutateProps, IFormProps } from 'modules/common/types';
import Form from 'modules/common/components/form/Form';
import Button from 'modules/common/components/Button';
import ControlLabel from 'modules/common/components/form/Label';
import { ModalFooter } from 'modules/common/styles/main';
import { __ } from 'modules/common/utils';
import { IDepartment } from '../../types';
import SelectTeamMembers from '../../containers/SelectTeamMembers';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  department?: IDepartment;
  closeModal: () => void;
  parentDepartments: IDepartment[];
};

export default function DepartmentForm(props: Props) {
  const { closeModal, renderButton, parentDepartments } = props;
  const object = props.department || ({} as any);

  const [userIds, setUserIds] = useState(
    (object.users || []).map(user => user._id)
  );
  const [parentId, setParentId] = useState(object.parentId);
  const [supervisorId, setSupervisorId] = useState(object.supervisorId);

  const generateDoc = values => {
    const finalValues = values;

    if (object) {
      finalValues._id = object._id;
    }

    return {
      userIds,
      parentId,
      supervisorId,
      ...finalValues
    };
  };

  const onChangeParent = (parent: any) => {
    if (parent) {
      setParentId(parent.value);
    } else {
      setParentId(null);
    }
  };

  const onSelectUsers = values => {
    setUserIds(values);
  };

  const onSelectSupervisor = value => {
    setSupervisorId(value);
  };

  const renderContent = (formProps: IFormProps) => {
    const { values, isSubmitted } = formProps;

    return (
      <>
        <FormGroup>
          <ControlLabel required={true}>{__('Title')}</ControlLabel>
          <FormControl
            {...formProps}
            name="title"
            defaultValue={object.title}
            autoFocus={true}
            required={true}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Description')}</ControlLabel>
          <FormControl
            {...formProps}
            name="description"
            defaultValue={object.description}
            componentClass="textarea"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Code')}</ControlLabel>
          <FormControl {...formProps} name="code" defaultValue={object.code} />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Supervisor')}</ControlLabel>

          <SelectTeamMembers
            label="Choose supervisor"
            name="supervisorId"
            initialValue={supervisorId}
            onSelect={onSelectSupervisor}
            multi={false}
          />
        </FormGroup>
        {(!object._id || (object._id && object.parentId)) && (
          <FormGroup>
            <ControlLabel>{__('Parent')}</ControlLabel>
            <Select
              placeholder={__('Choose parent')}
              value={parentId}
              clearable={true}
              onChange={onChangeParent}
              options={parentDepartments.map(d => ({
                value: d._id,
                label: d.title
              }))}
            />
          </FormGroup>
        )}
        <FormGroup>
          <ControlLabel>{__('Team Members')}</ControlLabel>

          <SelectTeamMembers
            label="Choose team members"
            name="userIds"
            initialValue={userIds}
            onSelect={onSelectUsers}
          />
        </FormGroup>
        <ModalFooter>
          <Button
            btnStyle="simple"
            type="button"
            icon="times-circle"
            onClick={closeModal}
          >
            Cancel
          </Button>

          {renderButton({
            name: values.title,
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
