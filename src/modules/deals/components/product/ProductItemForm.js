import React from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  Icon,
  ModalTrigger,
  Button
} from 'modules/common/components';
import Select from 'react-select-plus';
import { DealButton, ItemName, ProductItemText } from '../../styles';
import { selectConfigOptions } from '../../utils';
import { ProductChooser } from '../../containers';
import { CURRENCIES, MEASUREMENTS } from 'modules/settings/general/constants';

const propTypes = {
  uom: PropTypes.array,
  currencies: PropTypes.array,
  productData: PropTypes.object.isRequired,
  removeProductItem: PropTypes.func.isRequired,
  onChangeProduct: PropTypes.func.isRequired,
  onChangeCurrency: PropTypes.func.isRequired,
  onChangeUom: PropTypes.func.isRequired,
  onChangeInput: PropTypes.func.isRequired
};

class ProductItemForm extends React.Component {
  renderProductModal(productData) {
    const { __ } = this.context;

    const productServiceTrigger = (
      <DealButton>
        {__('Product & Service')} <Icon icon="plus" />
      </DealButton>
    );

    return (
      <ModalTrigger
        title="Choose product & service"
        trigger={productServiceTrigger}
        size="large"
      >
        <ProductChooser
          onSelect={products => {
            const product =
              products && products.length === 1 ? products[0] : null;

            this.props.onChangeProduct(product, productData._id);
          }}
          data={{
            name: 'Product',
            products: productData.product ? [productData.product] : []
          }}
          limit={1}
        />
      </ModalTrigger>
    );
  }

  renderProduct(product) {
    if (!product) return null;

    return <ItemName>{product.name}</ItemName>;
  }

  render() {
    const { __ } = this.context;
    const { uom, currencies, productData } = this.props;

    return (
      <tr key={productData._id}>
        <td>
          {this.renderProduct(productData.product)}
          {this.renderProductModal(productData)}
        </td>
        <td>
          <Select
            name="uom"
            placeholder={__('Choose')}
            value={productData.uom}
            onChange={value => this.props.onChangeUom(value, productData._id)}
            optionRenderer={option => (
              <div className="simple-option">
                <span>{option.label}</span>
              </div>
            )}
            options={selectConfigOptions(uom, MEASUREMENTS)}
          />
        </td>
        <td>
          <Select
            name="currency"
            placeholder={__('Choose')}
            value={productData.currency}
            onChange={value =>
              this.props.onChangeCurrency(value, productData._id)
            }
            optionRenderer={option => (
              <div className="simple-option">
                <span>{option.label}</span>
              </div>
            )}
            options={selectConfigOptions(currencies, CURRENCIES)}
          />
        </td>
        <td>
          <FormControl
            value={productData.quantity}
            type="number"
            min="1"
            placeholder="Quantity"
            name="quantity"
            onChange={e => this.props.onChangeInput(productData._id, e)}
          />

          <ProductItemText align="right">{__('Discount')}</ProductItemText>

          <ProductItemText align="right">{__('Tax')}</ProductItemText>
        </td>
        <td>
          <FormControl
            value={productData.unitPrice}
            placeholder="Unit price"
            name="unitPrice"
            onChange={e => this.props.onChangeInput(productData._id, e)}
          />

          <FormControl
            value={productData.discountPercent}
            type="number"
            min="0"
            max="100"
            placeholder="Discount percent"
            name="discountPercent"
            onChange={e => this.props.onChangeInput(productData._id, e)}
          />

          <FormControl
            value={productData.taxPercent}
            type="number"
            min="0"
            max="100"
            placeholder="Tax percent"
            name="taxPercent"
            onChange={e => this.props.onChangeInput(productData._id, e)}
          />

          <ProductItemText>{__('Total')}</ProductItemText>
        </td>
        <td>
          <ProductItemText>
            {(productData.quantity * productData.unitPrice).toLocaleString()}{' '}
            {productData.currency}
          </ProductItemText>

          <FormControl
            value={productData.discount}
            placeholder="Discount amount"
            name="discount"
            onChange={e => this.props.onChangeInput(productData._id, e)}
          />

          <ProductItemText>
            {productData.tax.toLocaleString()} {productData.currency}
          </ProductItemText>

          <ProductItemText>
            {productData.amount.toLocaleString()} {productData.currency}
          </ProductItemText>
        </td>
        <td>
          <Button
            btnStyle="danger"
            icon="close"
            size="small"
            onClick={this.props.removeProductItem.bind(this, productData._id)}
          />
        </td>
      </tr>
    );
  }
}

ProductItemForm.propTypes = propTypes;
ProductItemForm.contextTypes = {
  __: PropTypes.func
};

export default ProductItemForm;
