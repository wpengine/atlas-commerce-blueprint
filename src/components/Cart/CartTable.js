import React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import styles from './CartTable.module.scss';
import useAtlasEcom from '@hooks/useAtlasEcom';

const CartTable = ({ cartItems, setProductNotification }) => {
  const { removeFromCart } = useAtlasEcom();

  const handleClick = (itemId) => {
    removeFromCart(itemId).then((data) =>
      setProductNotification(
        data.message
          ? { message: data.message }
          : {
              message: 'There was an error removing this item from your cart',
              className: 'notificationError',
            }
      )
    );
  };

  return (
    <div className={styles.cartTable}>
      <table>
        <thead>
          <tr>
            <th className={styles.hideOnMobile}></th>
            <th></th>
            <th>Product</th>
            <th>Price</th>
            <th className={styles.hideOnMobile}>Quantity</th>
            <th className={styles.hideOnMobile}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item, index) => (
            <tr key={`cart-item-${index}`}>
              <td>
                <AiOutlineCloseCircle
                  style={{ 'cursor': 'pointer' }}
                  onClick={() => handleClick(item.id)}
                />
              </td>
              <td className={styles.hideOnMobile}>
                <img
                  src={item.image_url}
                  alt={`Image of ${item.name}`}
                  className={styles.cartImage}
                  loading='lazy'
                />
              </td>
              <td>{item.name}</td>
              <td>
                <span>$</span> {item.sale_price.toFixed(2)}
              </td>
              <td className={styles.hideOnMobile}>{item.quantity}</td>
              <td className={styles.hideOnMobile}>
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
