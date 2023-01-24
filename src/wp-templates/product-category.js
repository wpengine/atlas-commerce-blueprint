import { gql } from '@apollo/client';
import * as MENUS from '@constants/menus';
import { BlogInfoFragment } from '@fragments/GeneralSettings';
import { ProductsFragment } from '@fragments/Products';
import { StoreSettingsFragment } from '@fragments/StoreSettings';
import { BannerFragment } from '@fragments/Banners';
import classNames from 'classnames/bind';
import styles from '@styles/pages/_Shop.module.scss';
import {
  Banner,
  Header,
  Footer,
  Main,
  Container,
  EntryHeader,
  NavigationMenu,
  ProductSort,
  SEO,
} from '@components';

const cx = classNames.bind(styles);

export default function Component(props) {
  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings ?? {};
  const banner = props?.data?.banners?.nodes[0];
  const primaryMenu = props?.data?.headerMenuItems?.nodes ?? [];
  const footerMenu = props?.data?.footerMenuItems?.nodes ?? [];
  const products = props?.data?.productCategory?.products?.edges ?? [];
  const { featuredImage } = props?.data?.page ?? { title: '' };

  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>;
  }

  return (
    <>
      <SEO
        title={siteTitle}
        description={siteDescription}
        imageUrl={featuredImage?.node?.sourceUrl}
      />
      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
        storeSettings={props?.data?.storeSettings}
      />
      <Banner notificationBanner={banner} />
      <Main>
        <Container>
          <EntryHeader
            title='Shop'
            subTitle='Shop your BigCommerce products with WordPress and WPGraphQL'
          />
          <div className={cx(['row', 'row-wrap', styles.shop])}>
            <ProductSort products={products} isCategoryList />
          </div>
        </Container>
      </Main>
      <Footer title={siteTitle} menuItems={footerMenu} />
    </>
  );
}

Component.query = gql`
  ${BlogInfoFragment}
  ${BannerFragment}
  ${NavigationMenu.fragments.entry}
  ${ProductsFragment}
  ${StoreSettingsFragment}
  query GetProductCategoryData(
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
    $slug: ID!
    $asPreview: Boolean = false
  ) {
    generalSettings {
      ...BlogInfoFragment
    }
    storeSettings {
      nodes {
        ...StoreSettingsFragment
      }
    }
    banners {
      nodes {
        ...BannerFragment
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
    productCategory(id: $slug, idType: SLUG, asPreview: $asPreview) {
      id
      name
      products {
        edges {
          node {
            ...ProductsFragment
          }
        }
      }
    }
  }
`;

Component.variables = ({ databaseId, slug }, ctx) => {
  return {
    databaseId,
    slug,
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
    asPreview: ctx?.asPreview,
  };
};
