import React from 'react';
import Review from './Review';
import { Container } from '@components/Container';

const Reviews = ({ reviews, product }) => {
  return (
    <Container>
      <div className='row row-wrap'>
        <div className='column'>
          <h3 style={{ borderTop: '1px solid #80808036', paddingTop: '40px' }}>
            {reviews?.length ?? 0} review{reviews?.length === 1 ? '' : 's'} for{' '}
            <br /> {product?.name}
          </h3>
          {reviews?.map((review) => (
            <Review review={review} key={`review-${review.id}`} />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Reviews;
