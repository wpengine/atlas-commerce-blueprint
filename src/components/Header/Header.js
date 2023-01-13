import React, { useEffect } from 'react';
import { useState } from 'react';
import { FaBars, FaSearch } from 'react-icons/fa';
import { NavigationMenu, SkipNavigationLink } from '@components';
import CartQuickView from './CartQuickView';
import Link from 'next/link';
import className from 'classnames/bind';
import cookieCutter from 'cookie-cutter';

import styles from './Header.module.scss';

/**
 * A Header component
 * @param {Props} props The props object.
 * @param {string} props.className An optional className to be added to the container.
 * @return {React.ReactElement} The FeaturedImage component.
 */

let cx = className.bind(styles);

export default function Header({
  className,
  storeSettings,
  title,
  description,
  menuItems,
}) {
  const [isNavShown, setIsNavShown] = useState(false);
  const [isSignOutShown, setIsSignOutShown] = useState(false);

  const headerClasses = cx([styles.header, className]);
  const navClasses = cx([
    styles['primary-navigation'],
    isNavShown ? styles['show'] : undefined,
  ]);

  var storeLogo = null;
  try {
    storeLogo = storeSettings?.nodes[0]?.storeLogo
      ? JSON.parse(storeSettings?.nodes[0].storeLogo)
      : null;
  } catch (err) {
    console.log('error', err);
  }

  // If the auth token already exists, redirect to the BC Account page
  useEffect(() => {
    // Get token
    const authToken = cookieCutter.get('atlasecom-token-user');

    if (typeof authToken !== 'undefined') {
      console.log('token exists');
      setIsSignOutShown(true);
    }
  }, [isSignOutShown]);

  function clearCookie() {
    console.log('clear');
    cookieCutter.set('atlasecom-token-user', '', {
      path: '/',
      expires: new Date(0),
    });
    setIsSignOutShown(false);
  }

  return (
    <header
      className={headerClasses}
      style={{
        backgroundColor: storeSettings?.storePrimaryColor,
        color: storeSettings?.storeSecondaryColor,
      }}
    >
      <SkipNavigationLink />
      <div className='container'>
        <div className={styles['bar']}>
          <div className={styles['logo']}>
            <Link href='/'>
              <a title='Home'>
                {storeLogo?.url && (
                  <img src={storeLogo?.url} alt='Store Logo' />
                )}
                <h3 style={{ color: storeSettings?.storeSecondaryColor }}>
                  {title}
                </h3>
                <span style={{ color: storeSettings?.storeSecondaryColor }}>
                  {description}
                </span>
              </a>
            </Link>
          </div>

          {isSignOutShown && (
            <div style={{ marginLeft: 'auto' }}>
              <a
                className={styles['sign-out']}
                href='/my-account'
                onClick={clearCookie}
              >
                Sign Out
              </a>
            </div>
          )}

          <div className={styles['search']}>
            <Link href='/search'>
              <a>
                <FaSearch
                  title='Search'
                  role='img'
                  style={{ fill: storeSettings?.storeSecondaryColor }}
                />
              </a>
            </Link>
          </div>

          <button
            type='button'
            className={styles['nav-toggle']}
            onClick={() => setIsNavShown(!isNavShown)}
            aria-label='Toggle navigation'
            aria-controls={styles['primary-navigation']}
            aria-expanded={isNavShown}
          >
            <FaBars />
          </button>
        </div>

        <div className={styles['nav-cart-bar']}>
          <NavigationMenu
            id={styles['primary-navigation']}
            className={navClasses}
            menuItems={menuItems}
          ></NavigationMenu>

          <CartQuickView storeSettings={storeSettings} styles={styles} />
        </div>
      </div>
    </header>
  );
}
