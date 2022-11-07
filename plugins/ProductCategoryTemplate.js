/* eslint-disable no-undef */
class ProductCategoryTemplate {
  constructor() {}

  apply(hooks) {
    hooks.addFilter(
      'possibleTemplatesList',
      'ProductCategoryTemplate',
      (templates, data) => {
        if (data?.seedNode?.__typename === 'ProductCategory') {
          return Array.from(new Set(['product-category', ...templates]));
        }
        return templates;
      }
    );
  }
}

export default ProductCategoryTemplate;
