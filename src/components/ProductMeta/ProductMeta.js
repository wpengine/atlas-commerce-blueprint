import React from 'react';
import {
  checkPurchaseDisabled,
  getProductCategories,
} from '../../helpers/productHelpers.js';
import { ProductFormField, Button } from '@components';
import Link from 'next/link';
import styles from './ProductMeta.module.scss';

const ProductMeta = ({
  product,
  categories,
  sortedFormFields,
  handleChange,
  handleSubmit,
  handleFieldChange,
  productVariant,
  variantOrModFields,
  variantValueKeys,
  modifierLookup,
}) => {
  const inventoryTracking = product.inventoryTracking;
  let inventoryLevel = product.inventoryLevel;

  if (inventoryTracking === 'variant' && productVariant) {
    inventoryLevel = productVariant.inventory;
  } else if (inventoryTracking === 'none') {
    inventoryLevel = null;
  }

  const modifierPurchaseDisabled = checkPurchaseDisabled(
    variantValueKeys,
    variantOrModFields,
    modifierLookup
  );

  let purchaseDisabled =
    modifierPurchaseDisabled.purchaseDisabled ||
    productVariant?.purchasing_disabled ||
    inventoryLevel === 0;

  const displayProduct = productVariant ?? product;
  const productBrand = product.brand?.node;
  const categoriesForThisProduct = getProductCategories(
    categories,
    product.bigCommerceID,
    product.slug
  );

  let purchaseDisabledMessage =
    modifierPurchaseDisabled.purchaseDisabledMessage ||
    'The selected product combination is currently unavailable.';

  return (
    <div className={styles.productMeta}>
      <p>SKU: {displayProduct?.sku}</p>

      {categoriesForThisProduct.length >= 1 && (
        <p>
          Categories:{' '}
          {categoriesForThisProduct.map((category, index) => (
            <span key={category.id}>
              {index === 0 ? '' : ', '}
              <Link
                href={`/product-category/${category.slug}`}
                key={category.id}
              >
                <a>{category.name}</a>
              </Link>
            </span>
          ))}
        </p>
      )}

      {productBrand ? <p>Brand: {productBrand.name}</p> : null}

      <form onSubmit={handleSubmit}>
        {sortedFormFields.map((field) => (
          <ProductFormField
            field={field}
            value={variantOrModFields[`${field.prodOptionType}[${field.id}]`]}
            onChange={handleFieldChange}
            key={field.id}
          />
        ))}

        <div>
          <label style={{ display: 'block' }}>Quantity:</label>
          <input
            type='number'
            min='1'
            max={inventoryLevel}
            step='1'
            name='quantity'
            value={variantOrModFields.quantity}
            onChange={handleChange}
            disabled={purchaseDisabled}
            className={styles.quantity}
          />
        </div>

        {purchaseDisabled ? (
          <div className={styles.purchaseDisabled}>
            {purchaseDisabledMessage}
          </div>
        ) : null}

        <Button className={styles.addToCart} disabled={purchaseDisabled}>
          Add to cart
        </Button>
      </form>
    </div>
  );
};

export default ProductMeta;
