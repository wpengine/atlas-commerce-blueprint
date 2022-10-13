import React from 'react';
import { ProductFormField, Button } from 'components';
import Link from 'next/link';
import styles from './ProductMeta.module.scss';

const ProductMeta = ({
  product,
  sortedFormFields,
  handleChange,
  handleSubmit,
  handleFieldChange,
  variantProduct,
  values,
}) => {
  const inventoryTracking = product.inventoryTracking;
  let inventoryLevel = product.inventoryLevel;

  if (inventoryTracking === 'variant' && variantProduct) {
    inventoryLevel = variantProduct.inventory;
  } else if (inventoryTracking === 'none') {
    inventoryLevel = null;
  }

  let purchaseDisabled =
    variantProduct?.purchasing_disabled || inventoryLevel === 0;

  const displayProduct = variantProduct ?? product;
  const productBrand = product.brand?.node;
  const productCategories = product.productCategories().nodes;

  let purchaseDisabledMessage =
    'The selected product combination is currently unavailable.';

  return (
    <div className='product_meta'>
      <p>SKU: {displayProduct?.sku}</p>

      {productCategories?.length ? (
        <p>
          Categories:{' '}
          {product.productCategories().nodes.map((category, index) => (
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
      ) : null}

      {productBrand ? <p>Brand: {productBrand.name}</p> : null}

      <form onSubmit={handleSubmit}>
        {sortedFormFields.map((field) => (
          <ProductFormField
            field={field}
            value={values[`${field.prodOptionType}[${field.id}]`]}
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
            value={values.quantity}
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

        <Button
          styleType='secondary'
          className={styles.addToCart}
          disabled={purchaseDisabled}
        >
          Add to cart
        </Button>
      </form>
    </div>
  );
};

export default ProductMeta;
