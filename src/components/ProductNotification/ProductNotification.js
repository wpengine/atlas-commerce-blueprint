import React from 'react';
import classNames from 'classnames';
import styles from './ProductNotification.module.scss';

const cx = classNames.bind(styles);

const ProductNotification = ({ productNotification }) => {
  return (
    <div
      className={cx(styles.notification, styles[productNotification.className])}
    >
      <div className={styles.message}>{productNotification.message}</div>
      <a href='/cart'>View cart</a>
    </div>
  );
};

export default ProductNotification;
