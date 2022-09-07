import styles from './ReviewForm.module.scss';
import { classNames } from 'utils';

import '@fortawesome/fontawesome-free/css/all.min.css';

import Link from 'next/link';

export default function ReviewForm() {
  return (
    <>
      <section className={styles.reviewForm}>
        <h2>Write a Review</h2>
        <div className="row">
          <div className="column column-50">
            <img className={styles.productImage} src={'https://cdn11.bigcommerce.com/s-mobtsc45qz/images/stencil/1280w/products/1483/5091/HMIT-Double_Strap-THAI_PAD-Cement_Black_SET__44402.1658523816.jpg?c=2'} alt={'Product Image Alt'} />
            <h6 className={styles.productBrand}>HMIT</h6>
            <h5 className={styles.productTitle}>HMIT Thai Pads | Cement</h5>
          </div>
          <div className="column column-50">
            <form action="/send-data-here" method="post">
              <div className={styles.formField}>
                <select id="rating-rate" class="form-select" name="revrating">
                  <option value="">Select Rating</option>
                  <option value="1">1 star (worst)</option>
                  <option value="2">2 stars</option>
                  <option value="3">3 stars (average)</option>
                  <option value="4">4 stars</option>
                  <option value="5">5 stars (best)</option>
                </select>
              </div>

              <div className={styles.formField}>
                <label className={styles.label} for="name">Name</label>
                <input type="text" id="name" name="name" />
              </div>

              <div className={styles.formField}>
                <label className={styles.label} for="subject">Review Subject</label>
                <input type="text" id="subject" name="subject" />
              </div>

              <div className={styles.formField}>
                <label className={styles.label} for="comments">Comments</label>
                <textarea className={styles.textArea} type="text" id="comments" name="comments" />
              </div>

              <button className={styles.button} type="submit">Submit Review</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
