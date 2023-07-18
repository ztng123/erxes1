import { gql } from '@apollo/client';
import {
  Alert,
  Button,
  ControlLabel,
  DateControl,
  FormControl,
  FormGroup,
  SelectTeamMembers,
  Toggle,
  __
} from '@erxes/ui/src';
import client from '@erxes/ui/src/apolloClient';
import { Columns } from '@erxes/ui/src/styles/chooser';
import { Column, DateContainer, ModalFooter } from '@erxes/ui/src/styles/main';
import React from 'react';
import { SelectIndicatorGroups, SelectIndicators } from '../../common/utils';
import { FormContainer } from '../../styles';
import { CardCustomFields, SelectStructure } from '../common/utils';
import { mutations } from '../graphql';

type Props = {
  history: any;
  schedule: any;
  plan: any;
  planId?: string;
  cardType: string;
  pipelineId: string;
  closeModal: () => void;
  refetch: (variables?: any) => Promise<any>;
  onSave: (doc: any) => void;
  duplicate?: boolean;
};

type State = {
  doc: any;
  useGroup: boolean;
};
class ScheduleForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      doc: props?.schedule || {},
      useGroup: props?.doc?.groupId || false
    };
  }

  render() {
    const {
      schedule,
      planId,
      closeModal,
      cardType,
      pipelineId,
      plan,
      refetch,
      duplicate
    } = this.props;
    const { useGroup, doc } = this.state;
    const { structureType } = plan;

    const handleChange = (value, name) => {
      this.setState({ doc: { ...doc, [name]: value } });
    };

    const onChange = e => {
      const { value, name } = e.currentTarget as HTMLInputElement;

      handleChange(value, name);
    };

    const onDateChange = (date, name) => {
      if (date < new Date()) {
        return Alert.error('You must select a date after the from today');
      }
      handleChange(date, name);
    };

    const handleSave = () => {
      let mutation = mutations.addSchedule;

      if (typeof schedule._id === 'string' && !duplicate) {
        mutation = mutations.updateSchedule;
      }

      client
        .mutate({
          mutation: gql(mutation),
          variables: { planId, ...doc }
        })
        .then(() => {
          Alert.success('Added schedule successfully');
          refetch && refetch();
          closeModal();
        })
        .catch(err => {
          Alert.error(err.message);
        });
    };

    return (
      <>
        <FormGroup>
          <FormContainer spaceBetween>
            <ControlLabel>
              {__(`Select ${useGroup ? 'Group' : 'Indicator'}`)}
            </ControlLabel>
            <Toggle
              checked={useGroup}
              onChange={() => this.setState({ useGroup: !useGroup })}
            />
          </FormContainer>
          {useGroup ? (
            <SelectIndicatorGroups
              initialValue={doc?.groupId}
              label="Select Group"
              name="groupId"
              onSelect={handleChange}
            />
          ) : (
            <SelectIndicators
              initialValue={doc?.indicatorId}
              label="Select Indicator"
              name="indicatorId"
              onSelect={handleChange}
            />
          )}
        </FormGroup>
        <Columns style={{ gap: '20px' }}>
          <Column>
            <FormGroup>
              <ControlLabel>{__('Assign To')}</ControlLabel>
              <SelectTeamMembers
                initialValue={doc.assignedUserIds}
                label="Assign To"
                name="assignedUserIds"
                onSelect={handleChange}
              />
            </FormGroup>
          </Column>
          <Column>
            <SelectStructure
              structureType={structureType}
              structureTypeIds={schedule?.structureTypeIds}
              onChange={handleChange}
            />
          </Column>
        </Columns>
        <Columns style={{ gap: '20px' }}>
          <Column>
            <FormGroup>
              <ControlLabel>{__('Start Date')}</ControlLabel>
              <DateContainer>
                <DateControl
                  name="startDate"
                  value={doc.startDate}
                  placeholder="select from start date "
                  onChange={date => onDateChange(date, 'startDate')}
                />
              </DateContainer>
            </FormGroup>
          </Column>
          <Column>
            <FormGroup>
              <ControlLabel>{__('End Date')}</ControlLabel>
              <DateContainer>
                <DateControl
                  name="endDate"
                  value={doc.endDate}
                  placeholder="select from end date "
                  onChange={date => onDateChange(date, 'endDate')}
                />
              </DateContainer>
            </FormGroup>
          </Column>
        </Columns>
        <FormGroup>
          <ControlLabel>{__('Name')}</ControlLabel>
          <FormControl
            name="name"
            required
            defaultValue={doc.name}
            placeholder="Type a name"
            onChange={onChange}
          />
        </FormGroup>
        <CardCustomFields
          type={cardType}
          pipelineId={pipelineId}
          onChangeField={(name, value) => handleChange(value, name)}
          object={doc}
          customFieldsData={doc.customFieldsData || []}
        />

        <ModalFooter>
          <Button btnStyle="simple" onClick={closeModal}>
            {__('Close')}
          </Button>
          <Button btnStyle="success" onClick={handleSave}>
            {__('Save')}
          </Button>
        </ModalFooter>
      </>
    );
  }
}

export default ScheduleForm;
