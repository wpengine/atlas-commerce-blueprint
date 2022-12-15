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
  ContentWrapper,
  EntryHeader,
  NavigationMenu,
  FeaturedImage,
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
  const products = props?.data?.products?.nodes ?? [];
  const { content, featuredImage } = props?.data?.page ?? { title: '' };

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
            <ProductSort products={products} />
          </div>
        </Container>
        <ContentWrapper content={content} />
      </Main>
      <Footer title={siteTitle} menuItems={footerMenu} />
    </>
  );
}

Component.query = gql`
  ${BlogInfoFragment}
  ${BannerFragment}
  ${NavigationMenu.fragments.entry}
  ${FeaturedImage.fragments.entry}
  ${ProductsFragment}
  ${StoreSettingsFragment}
  query GetPageData(
    $databaseId: ID!
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
    $asPreview: Boolean = false
  ) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
      ...FeaturedImageFragment
    }
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
    products(first: 100) {
      nodes {
        ...ProductsFragment
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
