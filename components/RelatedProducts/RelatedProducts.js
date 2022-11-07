import React from 'react';
import { useQuery } from '@apollo/client';
import { ProductSummary } from '../ProductSummary';
import { RelatedProductsQuery } from '../../queries/Product';
import styles from './RelatedProducts.module.scss';
import classNames from 'classnames';

const cx = classNames.bind(styles);

const RelatedProducts = ({ relatedProductIds }) => {
  const { data: relatedProducts } = useQuery(RelatedProductsQuery, {
    variables: { relatedProductIds },
  });

  return (
    <div className={cx('container', styles.relatedProducts)}>
      <h2>Related Products</h2>
      <div className='row row-wrap'>
        {relatedProducts?.products?.nodes?.map(
          (product) =>
            product.slug !== undefined && (
              <ProductSummary
                product={product}
                key={`related-product-${product.slug}`}
              />
            )
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
