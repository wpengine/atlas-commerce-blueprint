import React, { useState, useMemo } from 'react';
import { gql } from '@apollo/client';
import { BlogInfoFragment } from '../fragments/GeneralSettings';
import { ProductFragment } from '../fragments/Products';
import { StoreSettingsFragment } from '../fragments/StoreSettings';
import {
  Banner,
  Header,
  Footer,
  Main,
  Container,
  NavigationMenu,
  SEO,
  ProductMeta,
  ProductPrice,
  ProductDescription,
  ProductGallery,
  RelatedProducts,
} from '../components';
import {
  computeVariantOrModificationFormFields,
  lookupProductVariants,
  checkPriceAdjuster,
} from '../helpers/productHelpers.js';
import * as MENUS from '../constants/menus';
import useAtlasEcom from '../hooks/useAtlasEcom';
import classNames from 'classnames';
import styles from '../styles/pages/_Product.module.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const cx = classNames.bind(styles);

export default function Component(props) {
  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings ?? {};
  const primaryMenu = props?.data?.headerMenuItems?.nodes ?? [];
  const footerMenu = props?.data?.footerMenuItems?.nodes ?? [];
  const product = props?.data?.product ?? {};

  let relatedProductIds = [];
  try {
    relatedProductIds = JSON.parse(product?.relatedProducts);
  } catch (err) {
    console.error(err);
    console.log('There was an error parsing the related product ids');
  }

  const productFormFields = JSON.parse(product?.productFormFieldsJson ?? '[]');
  const variantLookup = JSON.parse(product?.variantLookupJson ?? '{}');
  const modifierLookup = JSON.parse(product?.modifierLookupJson ?? '{}');

  const productName = product?.name;
  const bigCommerceId = product?.bigCommerceID;
  const baseVariantId = product?.variants?.nodes[0]?.bigCommerceVariantID;
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

  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>;
  }

  return (
    <>
      <SEO title={siteTitle} description={siteDescription} />
      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
        storeSettings={props?.data?.storeSettings}
      />
      <Banner />
      <Main>
        <Container classes={cx(styles.product)}>
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
        {relatedProductIds.length && relatedProductIds[0] !== -1 && (
          <RelatedProducts relatedProductIds={relatedProductIds} />
        )}
      </Main>
      <Footer title={siteTitle} menuItems={footerMenu} />
    </>
  );
}

Component.query = gql`
  ${BlogInfoFragment}
  ${ProductFragment}
  ${NavigationMenu.fragments.entry}
  ${StoreSettingsFragment}
  query GetProduct(
    $databaseId: ID!
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
    $asPreview: Boolean = false
  ) {
    product(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      ...ProductFragment
    }
    generalSettings {
      ...BlogInfoFragment
    }
    storeSettings {
      nodes {
        ...StoreSettingsFragment
      }
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

Component.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
    asPreview: ctx?.asPreview,
  };
};
