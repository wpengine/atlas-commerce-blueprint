import { useState } from 'react';
import styles from './ReviewForm.module.scss';
import classNames from 'classnames';
import { Button } from '@components/Button';
import { validateReview } from '../../helpers/validateReview';

const cx = classNames.bind(styles);

export default function ReviewForm({ product }) {
  const [isActive, setActive] = useState(false);
  const [submitResponse, setSubmitResponse] = useState({ isLoading: false });

  const [values, setValues] = useState({
    rating: '',
    name: '',
    title: '',
    text: '',
  });
  const [errors, setErrors] = useState({});

  const productId = product?.bigCommerceID;
  const productImage = product?.images?.nodes?.find(
    (image) => image.isThumbnail
  );

  function handleChange(event) {
    setValues((prevValues) => ({
      ...prevValues,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const errors = validateReview(values);
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      setSubmitResponse({ isLoading: true });

      const result = await fetch(
        `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/atlas-commerce-connector-bigcommerce/v1/create-review`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...values,
            product_id: productId,
          }),
        }
      );

      const data = await result.json();
      setSubmitResponse(data);
    }
  }

  function handleClickActivate(event) {
    event.preventDefault();
    setActive(true);
  }

  function handleClickDeactivate(event) {
    event.preventDefault();
    setActive(false);
  }

  return (
    <section className={styles.reviewForm}>
      {isActive && submitResponse.status !== 200 ? (
        <div className={styles.reviewFormContainer}>
          <h2>Write a Review</h2>
          <a
            href='#'
            onClick={handleClickDeactivate}
            style={{ float: 'right' }}
          >
            Cancel
          </a>
          <div className='row'>
            <div className='column'>
              <img
                src={productImage.urlThumbnail}
                alt={product.name}
                className={styles.productImage}
                loading='lazy'
              />
              <h6 className={styles.productBrand}>
                {product.brand?.node?.name}
              </h6>
              <h5 className={styles.productTitle}>{product.name}</h5>
            </div>
            <div className='column'>
              <form
                action='/send-data-here'
                method='post'
                onSubmit={handleSubmit}
              >
                {submitResponse.message ? (
                  <div className={styles.errorMessage}>
                    There was an error submitting the review:
                    <br />
                    {submitResponse.message}
                  </div>
                ) : null}
                <div
                  className={cx(
                    styles.formField,
                    errors.rating ? styles.formFieldError : ''
                  )}
                >
                  <label htmlFor='rating-rate'>Rating</label>
                  <select
                    id='rating-rate'
                    className='form-select'
                    name='rating'
                    value={values.rating}
                    onChange={handleChange}
                  >
                    <option value=''>Select Rating</option>
                    <option value='5'>5 stars (best)</option>
                    <option value='4'>4 stars</option>
                    <option value='3'>3 stars (average)</option>
                    <option value='2'>2 stars</option>
                    <option value='1'>1 star (worst)</option>
                  </select>
                  {errors.rating ? (
                    <div className={styles.formErrorMessage}>
                      {errors.rating}
                    </div>
                  ) : null}
                </div>

                <div
                  className={cx(
                    styles.formField,
                    errors.name ? styles.formFieldError : ''
                  )}
                >
                  <label htmlFor='name'>Name</label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    maxLength='255'
                    value={values.name}
                    onChange={handleChange}
                  />
                  {errors.name ? (
                    <div className={styles.formErrorMessage}>{errors.name}</div>
                  ) : null}
                </div>

                <div
                  className={cx(
                    styles.formField,
                    errors.title ? styles.formFieldError : ''
                  )}
                >
                  <label htmlFor='subject'>Review Subject</label>
                  <input
                    type='text'
                    id='subject'
                    name='title'
                    maxLength='255'
                    value={values.title}
                    onChange={handleChange}
                  />
                  {errors.title ? (
                    <div className={styles.formErrorMessage}>
                      {errors.title}
                    </div>
                  ) : null}
                </div>

                <div
                  className={cx(
                    styles.formField,
                    errors.text ? styles.formFieldError : ''
                  )}
                >
                  <label htmlFor='comments'>Comments</label>
                  <textarea
                    className={styles.textArea}
                    type='text'
                    id='comments'
                    name='text'
                    maxLength='2000'
                    value={values.text}
                    onChange={handleChange}
                  />
                  {errors.text ? (
                    <div className={styles.formErrorMessage}>{errors.text}</div>
                  ) : null}
                </div>

                <Button type='submit' disabled={submitResponse.isLoading}>
                  Submit Review
                </Button>
              </form>
            </div>
          </div>
        </div>
      ) : isActive ? (
        <p className={styles.successMessage}>
          Thank you for your review. It needs to be approved in BigCommerce
          before it shows up here.
        </p>
      ) : (
        <Button onClick={handleClickActivate}>Write a Review</Button>
      )}
    </section>
  );
}
