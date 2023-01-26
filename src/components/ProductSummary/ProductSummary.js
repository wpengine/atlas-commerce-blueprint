/**
 * Provide Product items to a page.
 *
 * @param {Props} props The props object.
 * @param {string} props.product The product object.
 * @param {string} props.imageAltText Used for the product Image Alt tags array.
 *
 * @returns {React.ReactElement} The Products component
 */
import styles from './ProductSummary.module.scss';
import classNames from 'classnames/bind';

import Link from 'next/link';

const cx = classNames.bind(styles);

export default function ProductSummary({ product }) {
  const productHref = `/product/${product?.slug}`;
  const thumbnail = product?.images?.nodes?.find((image) => image.isThumbnail);

  return (
    <div className={cx(['column', 'column-25', styles.productWrapper])}>
      <div className={styles.productImageContainer}>
        <Link href={productHref}>
          <a>
            {product?.salePrice !== 0 ? (
              <span className={styles.onsale}>Sale!</span>
            ) : null}
            <img
              className={styles.productImage}
              src={thumbnail?.urlThumbnail ?? '/ProductDefault.gif'}
              alt={product?.imageAltText ?? product?.name}
              loading='lazy'
            />
          </a>
        </Link>
      </div>
      <div className={styles.productInfoContainer}>
        <h6 className={styles.productTitle}>
          <Link href={productHref}>
            <a>{product?.name}</a>
          </Link>
        </h6>
        <div className={styles.productPrice}>
          <span>
            {product?.salePrice === 0 ? (
              '$' + product?.price?.toFixed(2)
            ) : (
              <>
                <del>${product?.price?.toFixed(2)}</del> $
                {product?.salePrice?.toFixed(2)}
              </>
            )}
          </span>
        </div>
        <div className={styles.btnContainer}>
          <Link href={productHref}>
            <a className={styles.btn}>View product</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
