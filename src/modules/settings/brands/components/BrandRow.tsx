import BrandForm from 'modules/settings/brands/components/BrandForm';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, ModalTrigger, Tip } from '../../../common/components';
import { __ } from '../../../common/utils';
import { ActionButtons, SidebarListItem } from '../../styles';
import { IBrand } from '../types';

type Props = {
  brand: IBrand;
  remove: (id: string) => void;
  save: (
    params: {
      doc: {
        name: string;
        description: string;
      };
    },
    callback: () => void,
    brand?: IBrand
  ) => void;
  isActive: boolean;
};

class BrandRow extends React.Component<Props> {
  remove = () => {
    const { remove, brand } = this.props;
    remove(brand._id);
  }

  renderEditAction = () => {
    const { brand, save } = this.props;

    const editTrigger = (
      <Button btnStyle="link">
        <Tip text={__('Edit')}>
          <Icon icon="edit" />
        </Tip>
      </Button>
    );

    const content = props => <BrandForm {...props} brand={brand} save={save} />;

    return (
      <ModalTrigger title="Edit" trigger={editTrigger} content={content} />
    );
  }

  render() {
    const { brand, isActive } = this.props;

    return (
      <SidebarListItem key={brand._id} isActive={isActive}>
        <Link to={`?_id=${brand._id}`}>{brand.name}</Link>
        <ActionButtons>
          {this.renderEditAction()}
          <Tip text="Delete">
            <Button btnStyle="link" onClick={this.remove} icon="cancel-1" />
          </Tip>
        </ActionButtons>
      </SidebarListItem>
    );
  }
}

export default BrandRow;
