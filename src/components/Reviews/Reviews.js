import React from 'react';
import Review from './Review';
import { Container } from '@components/Container';
import classNames from 'classnames';
import styles from './Reviews.module.scss';

const cx = classNames.bind(styles);

const Reviews = ({ reviews, product }) => {
  return (
    <Container>
      <div className='row row-wrap'>
        <div className={cx('column', styles.reviews)}>
          <h3>
            {reviews?.length ?? 0} review{reviews?.length === 1 ? '' : 's'} for{' '}
            <br /> {product?.name}
          </h3>
          {reviews?.map((review) => (
            <Review
              review={review}
              styles={styles}
              key={`review-${review.id}`}
            />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Reviews;
