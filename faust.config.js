/* eslint-disable no-undef */
import { setConfig } from '@faustwp/core';
import templates from './wp-templates';
import possibleTypes from './possibleTypes.json';

class ProductTemplatePlugin {
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

/**
 * @type {import('@faustwp/core').FaustConfig}
 **/
export default setConfig({
  templates,
  experimentalPlugins: [new ProductTemplatePlugin()],
  possibleTypes,
});
