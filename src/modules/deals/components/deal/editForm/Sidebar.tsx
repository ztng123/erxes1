import { Button } from 'modules/common/components';
import { CompanySection } from 'modules/companies/components';
import { ICompany } from 'modules/companies/types';
import { CustomerSection } from 'modules/customers/components/common';
import { ICustomer } from 'modules/customers/types';
import { IProduct } from 'modules/settings/productService/types';
import * as React from 'react';
import { ProductSection } from '../..';
import { Right } from '../../../styles/deal';
import { IDeal } from '../../../types';

type Props = {
  deal: IDeal;
  customers: ICustomer[];
  companies: ICompany[];
  products: IProduct[];
  productsData: any;
  onChangeField?: (name: string, value: any) => void;

  // TODO: replace any
  removeDeal: any;
  saveProductsData: any;
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

    const onChange = (type, value) => {
      onChangeField && onChangeField(type, value);
    }

    return (
      <Right>
        <ProductSection
          onChangeProductsData={pData => onChange('productsData', pData)}
          onChangeProducts={prs => onChange('products', prs)}
          productsData={productsData}
          products={products}
          saveProductsData={saveProductsData}
        />

        <CompanySection
          name="Deal"
          companies={companies}
          onSelect={cmps => onChange('companies', cmps)}
        />

        <CustomerSection
          name="Deal"
          customers={customers}
          onSelect={cmrs => onChange('customers', cmrs)}
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
