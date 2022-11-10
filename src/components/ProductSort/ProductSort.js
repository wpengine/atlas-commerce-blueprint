import { useState, useMemo } from 'react';
import { ProductSummary } from '@components';
import SortUI from './SortUI';

export default function ProductSort({ products, isCategoryList }) {
  const productsMap = useMemo(
    () =>
      products.map((productData, index) => {
        const product = isCategoryList ? productData.node : productData;
        return {
          product,
          index,
          price: product.salePrice === 0 ? product.price : product.salePrice,
          rating: product.reviewsRating,
          popularity: product.totalSold,
          latest: product.bigCommerceID,
        };
      }),
    [products, isCategoryList]
  );

  const [sortOrder, setSortOrder] = useState('index');

  const sorted = productsMap.slice().sort((a, b) => {
    if (sortOrder === 'index') {
      return a.index - b.index;
    }
    if (sortOrder === 'popularity') {
      return b.popularity - a.popularity;
    }
    if (sortOrder === 'rating') {
      return b.rating - a.rating;
    }
    if (sortOrder === 'latest') {
      return b.latest - a.latest;
    }
    if (sortOrder === 'price-asc') {
      return a.price - b.price;
    }
    if (sortOrder === 'price-desc') {
      return b.price - a.price;
    }
    return 0;
  });

  return (
    <>
      <SortUI
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        products={products}
      />
      {sorted.map(({ product }) => (
        <ProductSummary product={product} key={product.slug} />
      ))}
    </>
  );
}
