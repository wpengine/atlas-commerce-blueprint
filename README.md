# atlas-commerce-blueprint

An eCommerce template for Atlas Blueprints

This repository contains a starter Blueprint to get you up and running quickly on [WP Engine's Atlas platform](https://wpengine.com/atlas/) with a simple WordPress blog site.

## Development

Copy `.env.local.sample` to `.env.local` in your local development environment. The sample env file points to the dev Commerce Blueprint Wordpress site, but you can change it to point to a local Wordpress site instead.

If you run into issues with `npm install` try use `npm install --legacy-peer-deps`

Make sure that any Wordpress site that is connected to this headless site has set its Permalinks to use this custom structure:

    /posts/%postname%/

## For more information

For more information on this Blueprint please check out the following sources:

- [WP Engine's Atlas Platform](https://wpengine.com/atlas/)
- [Faust.js](https://faustjs.org)
- [WPGraphQL](https://www.wpgraphql.com)
- [Atlas Content Modeler](https://wordpress.org/plugins/atlas-content-modeler/)
- [WP Engine's Atlas developer community](https://developers.wpengine.com)
