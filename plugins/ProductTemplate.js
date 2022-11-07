/* eslint-disable no-undef */
class ProductTemplate {
  constructor() {}

  apply(hooks) {
    hooks.addFilter(
      'possibleTemplatesList',
      'ProductTemplate',
      (templates, data) => {
        if (data?.seedNode?.__typename === 'Product') {
          return Array.from(new Set(['product', ...templates]));
        }
        return templates;
      }
    );
  }
}

export default ProductTemplate;
