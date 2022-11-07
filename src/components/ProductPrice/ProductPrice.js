import React from 'react';

const ProductPrice = ({ salePrice, price, calculatedPrice }) => {
  return (
    <p
      className='price'
      style={{
        fontSize: '1.41575em',
        margin: '1.41575em 0',
      }}
    >
      {salePrice === 0 ? (
        '$' + calculatedPrice.toFixed(2)
      ) : (
        <>
          <del>${price.toFixed(2)}</del> ${calculatedPrice.toFixed(2)}
        </>
      )}
    </p>
  );
};

export default ProductPrice;
