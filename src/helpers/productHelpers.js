/**
 * Checks the JSON provided from BigCommerce for the Variant and Modification options.
 * @returns An Object containing either variant[id] or modification[id] keys and their values.
 */
export function computeVariantOrModificationFormFields(productFormFields) {
  const variantOrModFields = productFormFields.reduce(
    (acc, variantOrModField) => {
      acc[`${variantOrModField.prodOptionType}[${variantOrModField.id}]`] =
        variantOrModField.option_values?.reduce((defaultValue, option) => {
          if (option.is_default) {
            return option.id;
          }
          return defaultValue;
        }, null) ?? variantOrModField.config?.default_value;
      return acc;
    },
    {}
  );

  return {
    ...variantOrModFields,
    quantity: 1,
  };
}

/**
 * Checks the product variant lookup with the formatted variant and id combonation selected and returns the information about that variant to be rendered.
 * @returns An Object containing the new product information with the variant selected.
 */
export function lookupProductVariants(
  variantValueKeys,
  variantLookup,
  variantOrModFields
) {
  const variantLookupId = variantValueKeys
    .reduce((acc, key) => {
      let match;
      if ((match = key.match(/^variant\[(.*)\]$/))) {
        acc.push(match[1] + '.' + variantOrModFields[key]);
      }
      return acc;
    }, [])
    .sort()
    .join(';');

  return variantLookup[variantLookupId];
}

/**
 * Checks for the price adjusted after applying modifications.
 * @returns The adjusted price to be used in price calculations.
 */
export function checkPriceAdjuster(variantValueKeys, modifierLookup) {
  let priceAdjuster = 0;

  variantValueKeys.forEach((key) => {
    let match;
    if ((match = key.match(/^modifier\[(.*)\]$/))) {
      const modifierLookupId = match[1] + '.' + variantValueKeys[key];
      const modifier = modifierLookup[modifierLookupId];
      if (modifier) {
        priceAdjuster += modifier.price_adjuster;
      }
    }
  });

  return priceAdjuster;
}

/**
 * Checks if the purchase is disabled and its message after applying modifications.
 * @returns An Object containing wether the purchase is disabled and the corresponding message after applying modifications.
 */
export function checkPurchaseDisabled(
  variantValueKeys,
  variantOrModFields,
  modifierLookup
) {
  let purchaseDisabled = false;
  let purchaseDisabledMessage = null;

  variantValueKeys.forEach((key) => {
    let match;
    if ((match = key.match(/^modifier\[(.*)\]$/))) {
      const modifierLookupId = match[1] + '.' + variantOrModFields[key];
      const modifier = modifierLookup[modifierLookupId];
      if (modifier) {
        if (modifier.purchasing_disabled?.status === true) {
          purchaseDisabled = true;

          if (modifier.purchasing_disabled.message) {
            purchaseDisabledMessage = modifier.purchasing_disabled.message;
          }
        }
      }
    }
  });

  return { purchaseDisabled, purchaseDisabledMessage };
}

/**
 * Checks the list of categories to see if the current product is associated with any. Returns the list of categories for that product or an empty array.
 */
export function getProductCategories(
  categories,
  productBigCommerceId,
  productSlug
) {
  const thisProductsCategories = categories.filter((category) => {
    const foundProduct = category.products.nodes.find(
      (product) =>
        product.bigCommerceID === productBigCommerceId &&
        product.slug === productSlug
    );

    if (foundProduct) {
      return category.name;
    }
  });

  return thisProductsCategories ?? [];
}
