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
