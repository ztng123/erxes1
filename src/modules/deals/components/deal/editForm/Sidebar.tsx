import { Button } from 'modules/common/components';
import { CompanySection } from 'modules/companies/components';
import { CustomerSection } from 'modules/customers/components/common';
import * as React from 'react';
import { ProductSection } from '../..';
import { Right } from '../../../styles/deal';

type Props = {
  deal: any,
  customers: any,
  companies: any,
  products: any,
  productsData: any,
  onChangeField: any,
  removeDeal: any,
  saveProductsData: any
};

class Sidebar extends React.Component<Props> {
  render() {
    const {
      customers,
      companies,
      products,
      productsData,
      deal,
      onChangeField,
      saveProductsData,
      removeDeal
    } = this.props;

    return (
      <Right>
        <ProductSection
          onChangeProductsData={pData => onChangeField('productsData', pData)}
          onChangeProducts={prs => onChangeField('products', prs)}
          productsData={productsData}
          products={products}
          saveProductsData={saveProductsData}
        />

        <CompanySection
          name="Deal"
          companies={companies}
          onSelect={cmps => onChangeField('companies', cmps)}
        />

        <CustomerSection
          name="Deal"
          customers={customers}
          onSelect={cmrs => onChangeField('customers', cmrs)}
        />

        <Button icon="checked-1">
          Copy
        </Button>

        <Button icon="cancel-1" onClick={() => removeDeal(deal._id)}>
          Delete
        </Button>
      </Right>
    );
  }
}

export default Sidebar;
