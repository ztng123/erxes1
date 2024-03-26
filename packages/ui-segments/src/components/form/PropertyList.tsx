import _ from 'lodash';
import { IField } from '../../types';
import React from 'react';
import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import { OperatorList } from '../styles';
import { __ } from 'coreui/utils';

type Props = {
  contentType: string;
  fields: IField[];
  onClickProperty: (field: IField) => void;
  searchValue: string;
};

class PropertyList extends React.Component<Props, {}> {
  groupByType = () => {
    const { fields = [] } = this.props;

    return fields.reduce((acc, field) => {
      const value = field.value;
      let key;

      if (field.group) {
        key = field.group;
      } else {
        key =
          value && value.includes('.')
            ? value.substr(0, value.indexOf('.'))
            : 'general';

        key = _.startCase(key);
      }

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(field);

      return acc;
    }, {});
  };

  onClickProperty = field => {
    this.props.onClickProperty(field);
  };

  renderFields = fields => {
    const { searchValue } = this.props;

    const searchQuery = searchValue.toLowerCase();

    const filteredFields = fields.filter(field => {
      const originalLabelLower = field.label.toLowerCase();
      // 번역된 라벨을 소문자로 변환
      const translatedLabelLower = __(field.label).toLowerCase();
      // 검색어가 원본 라벨 또는 번역된 라벨 중 하나라도 포함되는지 확인
      return (
        originalLabelLower.includes(searchQuery) ||
        translatedLabelLower.includes(searchQuery)
      );
    });
    return filteredFields.map(field => {
      return (
        <FormControl
          key={field._id || Math.random()}
          componentClass="radio"
          onChange={() => this.onClickProperty(field)}
        >
          {__(field.label)}
        </FormControl>
      );
    });
  };

  render() {
    const objects = this.groupByType();

    return Object.keys(objects).map(key => {
      return (
        <OperatorList key={Math.random()}>
          <FormGroup>
            <b>{key}</b>
            {this.renderFields(objects[key])}
          </FormGroup>
        </OperatorList>
      );
    });
  }
}

export default PropertyList;
