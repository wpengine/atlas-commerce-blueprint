import React from 'react';
import classNames from 'classnames';
import styles from './ProductNotification.module.scss';

const cx = classNames.bind(styles);

const ProductNotification = ({ productNotification, cartPage }) => {
  return (
    <div
      className={cx(styles.notification, styles[productNotification.className])}
    >
      <div className={styles.message}>{productNotification.message}</div>
      {!cartPage && <a href='/cart'>View cart</a>}
    </div>
  );
};

export default ProductNotification;
