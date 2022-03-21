import Button from '@erxes/ui/src/components/Button';
import DropdownToggle from '@erxes/ui/src/components/DropdownToggle';
import EmptyState from '@erxes/ui/src/components/EmptyState';
import HeaderDescription from '@erxes/ui/src/components/HeaderDescription';
import Icon from '@erxes/ui/src/components/Icon';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import { Title } from '@erxes/ui/src/styles/main';
import { __ } from '@erxes/ui/src/utils';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import PropertyForm from '@erxes/ui-settings/src/properties/containers/PropertyForm';
import PropertyGroupForm from '@erxes/ui-settings/src/properties/containers/PropertyGroupForm';
import { PropertyList } from '@erxes/ui-settings/src/properties/styles';
import { IFieldGroup } from '@erxes/ui-settings/src/properties/types';
import { IField } from '@erxes/ui/src/types';
import PropertyRow from './PropertyRow';
import Sidebar from './Sidebar';
import SortableList from '@erxes/ui/src/components/SortableList';

type Props = {
  queryParams: any;
  refetch?: () => void;
  fieldsGroups: IFieldGroup[];
  currentType: string;
  removePropertyGroup: (data: { _id: string }) => any;
  removeProperty: (data: { _id: string }) => void;
  updatePropertyVisible: (data: { _id: string; isVisible: boolean }) => void;
  updatePropertyDetailVisible: (data: {
    _id: string;
    isVisibleInDetail: boolean;
  }) => void;
  updatePropertyGroupVisible: (data: {
    _id: string;
    isVisible: boolean;
  }) => void;
  updateFieldOrder: (fields: IField[]) => any;
  updateGroupOrder: (groups: IFieldGroup[]) => void;
  services: string[];
};

class Properties extends React.Component<
  Props,
  { fieldsGroups: IFieldGroup[] }
> {
  constructor(props: Props) {
    super(props);

    const { fieldsGroups = [] } = props;

    this.state = {
      fieldsGroups: fieldsGroups.filter(gro => !gro.isDefinedByErxes)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.fieldsGroups !== nextProps.fieldsGroups) {
      this.setState({
        fieldsGroups: nextProps.fieldsGroups.filter(
          gro => !gro.isDefinedByErxes
        )
      });
    }
  }

  onChangeFieldGroups = fieldsGroups => {
    this.setState({ fieldsGroups }, () => {
      this.props.updateGroupOrder(this.state.fieldsGroups);
    });
  };

  renderRow = group => {
    const {
      queryParams,
      removePropertyGroup,
      removeProperty,
      updatePropertyVisible,
      updatePropertyDetailVisible,
      updateFieldOrder
    } = this.props;

    return (
      <PropertyRow
        key={group._id}
        group={group}
        queryParams={queryParams}
        removePropertyGroup={removePropertyGroup}
        removeProperty={removeProperty}
        updatePropertyVisible={updatePropertyVisible}
        updateFieldOrder={updateFieldOrder}
        updatePropertyDetailVisible={updatePropertyDetailVisible}
      />
    );
  };

  renderSortableList = () => {
    const { fieldsGroups } = this.state;

    if (fieldsGroups.length === 0) {
      return null;
    }

    return (
      <SortableList
        fields={fieldsGroups}
        child={group => this.renderRow(group)}
        onChangeFields={this.onChangeFieldGroups}
        isModal={true}
        showDragHandler={false}
        droppableId="property-group"
      />
    );
  };

  renderProperties = () => {
    const { fieldsGroups } = this.props;

    if (fieldsGroups.length === 0) {
      return (
        <EmptyState
          icon="paragraph"
          text="There aren't any groups and fields"
        />
      );
    }

    const defaultGroups = fieldsGroups.filter(group => group.isDefinedByErxes);

    return (
      <PropertyList>
        {defaultGroups.map(group => this.renderRow(group))}
        {this.renderSortableList()}
      </PropertyList>
    );
  };

  renderActionBar = () => {
    const { queryParams, fieldsGroups, currentType } = this.props;

    if (currentType === 'device') {
      return null;
    }

    let size;

    if (['task', 'deal', 'ticket'].includes(currentType)) {
      size = 'lg';
    }

    const addGroup = <Dropdown.Item>{__('Add group')}</Dropdown.Item>;
    const addField = <Dropdown.Item>{__('Add Property')}</Dropdown.Item>;

    const groupContent = props => (
      <PropertyGroupForm {...props} queryParams={queryParams} />
    );

    const propertyContent = modalProps => {
      if (fieldsGroups.filter(e => !e.isDefinedByErxes).length === 0) {
        return <div>{__('Please add property Group first')}!</div>;
      }

      return (
        <PropertyForm
          {...modalProps}
          {...this.props}
          queryParams={queryParams}
        />
      );
    };

    return (
      <Dropdown alignRight={true}>
        <Dropdown.Toggle as={DropdownToggle} id="dropdown-properties">
          <Button btnStyle="success" icon="plus-circle">
            {__('Add Group & Field ')}
            <Icon icon="angle-down" />
          </Button>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <ModalTrigger
            title={__('Add Group')}
            size={size}
            trigger={addGroup}
            autoOpenKey={`showProperty${currentType}Modal`}
            content={groupContent}
          />
          <ModalTrigger
            title={__('Add Property')}
            trigger={addField}
            content={propertyContent}
          />
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  render() {
    const { currentType, services } = this.props;

    const breadcrumb = [
      { title: __('Settings'), link: '/settings' },
      { title: __('Properties'), link: '/settings/properties' },
      { title: __(`${currentType} properties`) }
    ];

    const title = (
      <Title capitalize={true}>
        {currentType} {__('properties')}
      </Title>
    );

    const headerDescription = (
      <HeaderDescription
        icon="/images/actions/26.svg"
        title={__('Properties')}
        description={`${__(
          'The quick quick view finder helps you to view basic information on both companies and customers alike'
        )}.${__(
          'Add groups and fields of the exact information you want to see'
        )}`}
      />
    );

    return (
      <Wrapper
        actionBar={
          <Wrapper.ActionBar
            background="colorWhite"
            left={title}
            right={this.renderActionBar()}
          />
        }
        header={
          <Wrapper.Header title={__(currentType)} breadcrumb={breadcrumb} />
        }
        mainHead={headerDescription}
        leftSidebar={
          <Sidebar currentType={__(currentType)} services={services} />
        }
        content={this.renderProperties()}
      />
    );
  }
}

export default Properties;
