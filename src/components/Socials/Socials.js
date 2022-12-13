import React from 'react';
import styles from './Socials.module.scss';

const Socials = () => {
  return (
    <div className={styles.socials}>
      <img
        className={styles.socialIcon}
        src='footer-icons/wordpress-icon.png'
        alt='WordPress Icon'
      />
      <img
        className={styles.socialIcon}
        src='footer-icons/bigcommerce-icon.png'
        alt='BigCommerce Icon'
      />
      <img
        className={styles.socialIcon}
        src='footer-icons/wp-engine-icon.png'
        alt='BigCommerce Icon'
      />
    </div>
  );
};

export default Socials;
