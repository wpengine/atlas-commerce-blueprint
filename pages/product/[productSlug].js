import { useState, useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';
import { getWordPressProps } from '@faustwp/core';
import { BlogInfoFragment } from '../../fragments/GeneralSettings';
import { ProductsFragment } from '../../fragments/Products';
import { ProductQuery } from '../../queries/Product';
import {
  Banner,
  Header,
  Footer,
  Main,
  Container,
  EntryHeader,
  NavigationMenu,
  Post,
  FeaturedImage,
  SEO,
  ProductSummary,
  ProductMeta,
  ProductPrice,
  ProductDescription,
  ProductGallery,
} from '../../components';
import {
  computeVariantOrModificationFormFields,
  lookupProductVariants,
  checkPriceAdjuster,
} from '../../helpers/productHelpers.js';
import * as MENUS from '../../constants/menus';
import useAtlasEcom from '../../hooks/useAtlasEcom';
import classNames from 'classnames';
import styles from '../../styles/pages/_Product.module.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const cx = classNames.bind(styles);

export default function Page({
  __TEMPLATE_QUERY_DATA__: templateData,
  params,
}) {
  // Needs to be called here because querying custom post types (Products and Banners etc)
  // doesnt seem to work when generating props
  const { data: productData, loading: productLoading } = useQuery(
    ProductQuery,
    {
      variables: { slug: params.productSlug },
    }
  );

  const { title: siteTitle, description: siteDescription } =
    templateData?.generalSettings;
  const primaryMenu = templateData?.headerMenuItems?.nodes ?? [];
  const footerMenu = templateData?.footerMenuItems?.nodes ?? [];
  const product = productData?.products?.nodes[0] ?? {};

  const relatedProductIds = JSON.parse(product?.relatedProducts ?? '[]');
  const relatedProducts = null; // make request for these

  const productFormFields = JSON.parse(product?.productFormFieldsJson ?? '[]');
  const variantLookup = JSON.parse(product?.variantLookupJson ?? '{}');
  const modifierLookup = JSON.parse(product?.modifierLookupJson ?? '{}');

  const productName = product?.name;
  const bigCommerceId = product?.bigCommerceID;
  const baseVariantId = product?.variants?.nodes[0].bigCommerceVariantID;
  let productImages = product?.images?.edges ?? []; // make request for these

  const sortedFormFields = useMemo(
    () => productFormFields.slice().sort((a, b) => a.sort_order - b.sort_order),
    [productFormFields]
  );

  const { cartData, addToCart } = useAtlasEcom();

  const [productNotification, setProductNotification] = useState();

  const [variantOrModFields, setVariantOrModFields] = useState(
    computeVariantOrModificationFormFields(productFormFields)
  );

  const variantValueKeys = Object.keys(variantOrModFields);

  const productVariant = lookupProductVariants(
    variantValueKeys,
    variantLookup,
    variantOrModFields
  );

  if (productVariant?.img) {
    productImages = [
      {
        urlStandard: productVariant.img,
        urlZoom: productVariant.img,
        urlThumbnail: productVariant.img,
      },
    ].concat(productImages.slice(1));
  }

  let priceAdjuster = checkPriceAdjuster(variantValueKeys, modifierLookup);

  const salePrice = productVariant?.salePrice ?? product.salePrice;
  const price = (productVariant?.price ?? product.price) + priceAdjuster;
  const calculatedPrice =
    (productVariant?.calculatedPrice ?? product.calculatedPrice) +
    priceAdjuster;

  function handleChange(event) {
    setVariantOrModFields((prevValues) => ({
      ...prevValues,
      [event.target.name]: event.target.value,
    }));
  }

  function handleFieldChange(key, value) {
    setVariantOrModFields((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const variantOptionValues = [];
    const modifierOptionValues = [];

    Object.keys(variantOrModFields).forEach((key) => {
      const match = key.match(/^(variant|modifier)\[(.*)\]$/);
      const value = variantOrModFields[key];
      if (match) {
        if (match[1] === 'variant') {
          variantOptionValues.push({
            parentOptionID: Number(match[2]),
            optionValueID: value,
          });
        } else if (match[1] === 'modifier') {
          modifierOptionValues.push({
            modifierOptionID: Number(match[2]),
            optionValue: typeof value !== 'number' ? value : '',
            optionValueID: typeof value === 'number' ? value : '',
          });
        }
      }
    });

    addToCart([
      {
        quantity: Number(variantOrModFields.quantity),
        product_id: bigCommerceId,
        variant_id: productVariant?.variant_id ?? baseVariantId,
        variant_option_values: variantOptionValues,
        modifiers: modifierOptionValues,
      },
    ]).then((data) => {
      setProductNotification(
        data.status === 200
          ? { message: `"${productName}" has been added to your cart.` }
          : { message: data.message, className: 'notificationError' }
      );

      window.scrollTo(0, 0);
    });
  }

  return (
    <>
      <SEO title={siteTitle} description={siteDescription} />
      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />
      <Banner />
      <Main>
        <Container className={cx(styles.product)}>
          {productNotification ? (
            <div
              className={cx(
                styles.notification,
                styles[productNotification.className]
              )}
            >
              <div className={styles.message}>
                {productNotification.message}
              </div>
              <a href={cartData?.redirect_urls?.cart_url}>View cart</a>
            </div>
          ) : null}

          <div className='row'>
            <div className='column column-40'>
              <ProductGallery images={productImages} />
            </div>

            <div className='column'>
              {salePrice !== 0 ? (
                <span className={styles.onsale}>Sale!</span>
              ) : null}

              <h1>{product?.name}</h1>

              <ProductPrice
                salePrice={salePrice}
                price={price}
                calculatedPrice={calculatedPrice}
              />

              <ProductDescription description={product?.description} />

              <ProductMeta
                product={product}
                sortedFormFields={sortedFormFields}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleFieldChange={handleFieldChange}
                productVariant={productVariant}
                variantOrModFields={variantOrModFields}
                variantValueKeys={variantValueKeys}
                modifierLookup={modifierLookup}
              />
            </div>
          </div>
        </Container>

        {relatedProducts?.length > 0 ? (
          <div className={cx('container', 'related-products')}>
            <h1>Related Products</h1>
            <div className='row row-wrap'>
              {relatedProducts.map((product) => (
                <ProductSummary
                  product={product}
                  key={`related-product-${product.slug}`}
                />
              ))}
            </div>
          </div>
        ) : null}
      </Main>
      <Footer title={siteTitle} menuItems={footerMenu} />
    </>
  );
}

export async function getStaticProps(ctx) {
  const wpProps = await getWordPressProps({ ctx });
  wpProps.props.params = ctx.params;

  return wpProps;
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

Page.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  ${FeaturedImage.fragments.entry}
  query GetProductPage(
    $uri: String!
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
  ) {
    nodeByUri(uri: $uri) {
      ... on Category {
        name
        posts {
          edges {
            node {
              id
              title
              content
              date
              uri
              ...FeaturedImageFragment
              author {
                node {
                  name
                }
              }
            }
          }
        }
      }
    }
    generalSettings {
      ...BlogInfoFragment
    }
    headerMenuItems: menuItems(where: { location: $headerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    footerMenuItems: menuItems(where: { location: $footerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
  }
`;

Page.variables = ({ uri, params }, ctx) => {
  return {
    uri,
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
  };
};
