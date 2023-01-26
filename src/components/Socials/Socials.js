import React from 'react';
import styles from './Socials.module.scss';
import icons from './_icons.js';

const Socials = () => {
  return (
    <div className={styles.socials}>
      {icons.map((icon, idx) => (
        <img
          key={`social-icon-${idx}`}
          className={styles.socialIcon}
          alt={icon.alt}
          src={icon.src}
          loading='lazy'
        />
      ))}
    </div>
  );
};

export default Socials;
