/* eslint-disable no-undef */
import { setConfig } from '@faustwp/core';
import templates from './src/wp-templates';
import possibleTypes from './possibleTypes.json';
import ProductTemplate from './plugins/ProductTemplate';
import ProductCategoryTemplate from './plugins/ProductCategoryTemplate';

/**
 * @type {import('@faustwp/core').FaustConfig}
 **/
export default setConfig({
  templates,
  experimentalPlugins: [new ProductTemplate(), new ProductCategoryTemplate()],
  possibleTypes,
});
