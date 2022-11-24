import React from 'react';
import styles from './CartTotals.module.scss';
import classNames from 'classnames';

const cx = classNames.bind(styles);

const CartTotals = ({ cartSubTotal, cartTotal, checkout_url }) => {
  return (
    <div className={styles.cartTotals}>
      <h3>Cart Totals</h3>
      <table>
        <tbody>
          <tr>
            <th>Subtotal</th>
            <td>
              <span>$</span>
              {cartSubTotal}
            </td>
          </tr>
          <tr>
            <th>Total</th>
            <td>
              <span>$</span>
              {cartTotal}
            </td>
          </tr>
        </tbody>
      </table>
      <a
        href={checkout_url}
        className={cx(styles.button, styles.checkoutButton)}
      >
        Checkout
      </a>
    </div>
  );
};

export default CartTotals;
