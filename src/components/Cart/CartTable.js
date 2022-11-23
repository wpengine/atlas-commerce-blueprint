import React from 'react';
import styles from './CartTable.module.scss';

const CartTable = ({ cartItems }) => {
  return (
    <div className={styles.cartTable}>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item, index) => (
            <tr key={`cart-item-${index}`}>
              <td>
                <img
                  src={item.image_url}
                  alt={`Image of ${item.name}`}
                  className={styles.cartImage}
                />
              </td>
              <td>{item.name}</td>
              <td>
                <span>$</span> {item.sale_price.toFixed(2)}
              </td>
              <td>{item.quantity}</td>
              <td>
                <span>$</span> {item.sale_price.toFixed(2) * item.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CartTable;
