# Atlas Commerce Blueprint

An eCommerce template for Atlas Blueprints.

This repository contains a starter Blueprint to get you up and running quickly on [WP Engine's Atlas platform](https://wpengine.com/atlas/) with a simple WordPress site that uses product data from [BigCommerce](https://www.bigcommerce.com/). The Blueprint is intended to be used with the **Atlas Commerce Blocks** and **Atlas Commerce Connector for BigCommerce** plugins.

- [Documentation for these plugins can be found here](https://developers.wpengine.com/docs/atlas-commerce-connector/introduction)
- [Check out the demo store here](https://atlascommerce.wpenginepowered.com)
- [Try a sandbox version of Atlas to get started with this Blueprint](https://wpengine.com/atlas/)

## Development

Copy `.env.local.sample` to `.env.local` in your local development environment. The sample env file points to the dev Commerce Blueprint Wordpress site, but you can change it to point to a local Wordpress site instead.

If you run into issues with `npm install` try use `npm install --legacy-peer-deps`

Make sure that any Wordpress site that is connected to this headless site has set its Permalinks to use this custom structure:

    /posts/%postname%/

## Architecture Decision Records

See the `docs/adr` directory for a list of architectural decision records made so far.

## For more information

For more information on this Blueprint please check out the following sources:

- [WP Engine's Atlas Platform](https://wpengine.com/atlas/)
- [Faust.js](https://faustjs.org)
- [WPGraphQL](https://www.wpgraphql.com)
- [Atlas Content Modeler](https://wordpress.org/plugins/atlas-content-modeler/)
- [Atlas Commerce Connector for BigCommerce](https://developers.wpengine.com/docs/atlas-commerce-connector/introduction)
- [WP Engine's Atlas developer community](https://developers.wpengine.com)
