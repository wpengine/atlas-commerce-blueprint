import styles from './ProductSort.module.scss';
import { classNames } from 'utils';
import { useState, useMemo } from 'react';
import ProductSummary from 'components/ProductSummary';

export default function ProductSort({ products }) {
  const productsMap = useMemo(() => (
    products.map((product, index) => ({
      product,
      index,
      price: (product.salePrice === 0 ? product.price : product.salePrice),
      rating: product.reviewsRating,
      popularity: product.totalSold,
      latest: product.bigCommerceID,
    }))
  ), [products]);
  
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
  
  function SortUI() {
    return (
      <div className="column">
        <select onChange={(event) => setSortOrder(event.target.value)} value={sortOrder}>
          <option value="index">Default sorting</option>
          <option value="popularity">Sort by popularity</option>
          <option value="rating">Sort by average rating</option>
          <option value="latest">Sort by latest</option>
          <option value="price-asc">Sort by price: low to high</option>
          <option value="price-desc">Sort by price: high to low</option>
        </select>
        &nbsp;&nbsp;Showing all {products.length} results
      </div>
    );
  }
  
  return (
    <>
      <SortUI />
    
      {sorted.map(({ product }) => (
        <ProductSummary product={product} key={product.slug} />
      ))}
      
      <SortUI />
    </>
  );
}
