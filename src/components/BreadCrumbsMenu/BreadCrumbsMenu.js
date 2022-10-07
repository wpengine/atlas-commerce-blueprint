import React from 'react';
import { classNames } from 'utils';
import styles from './BreadCrumbsMenu.module.scss';

const BreadCrumbsMenu = ({ path, label, title }) => {
  return (
    <nav className={styles.breadcrumbsContainer}>
      <ul className={styles.breadcrumbs}>
        <li className={styles.breadcrumb}>
          <a href='/'>
            <span>Home</span>
          </a>
        </li>
        <li className={styles.breadcrumb}>
          <a href={path}>
            <span>{label}</span>
          </a>
        </li>
        <li className={classNames([styles.breadcrumb, styles.isActive])}>
          <span>{title}</span>
        </li>
      </ul>
    </nav>
  );
};

export default BreadCrumbsMenu;
