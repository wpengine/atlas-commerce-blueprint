/* eslint-disable no-useless-escape */
export function validateReview(values) {
  const errors = {};

  if (!values.rating) {
    errors.rating = 'Required';
  }

  if (!values.name) {
    errors.name = 'Required';
  } else if (values.name.length < 2 || values.name.length > 255) {
    errors.name = 'Field must be between 2 and 255 characters long';
  } else if (
    /[\|\\\}\{\]\[;:\?\<\>\=\+\(\)\*\^\%\$\#@\!\~]/.test(values.name)
  ) {
    errors.name =
      'Field cannot contain special characters: |{}[];:?<>=+()*^%$#@!~';
  }

  if (!values.title) {
    errors.title = 'Required';
  } else if (values.title.length < 2 || values.title.length > 255) {
    errors.title = 'Field must be between 2 and 255 characters long';
  } else if (/[\|\}\{\]\[\<\>\^@\~]/.test(values.title)) {
    errors.title = 'Field cannot contain special characters: |{}[]<>^@~';
  }

  if (!values.text) {
    errors.text = 'Required';
  } else if (values.text.length < 2 || values.text.length > 2000) {
    errors.text = 'Field must be between 2 and 2000 characters long';
  } else if (/[\|\}\{\]\[\<\>\^@\~]+/.test(values.text)) {
    errors.text = 'Field cannot contain special characters: |{}[]<>^@~';
  }

  return errors;
}
