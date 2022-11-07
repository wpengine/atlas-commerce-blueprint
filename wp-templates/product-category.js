import { gql } from '@apollo/client';
import * as MENUS from '../constants/menus';
import { BlogInfoFragment } from '../fragments/GeneralSettings';
import { ProductsFragment } from '../fragments/Products';
import classNames from 'classnames/bind';
import styles from '../styles/pages/_Shop.module.scss';
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
} from '../components';

const cx = classNames.bind(styles);

export default function Component(props) {
  console.log(props);
  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings ?? {};
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
      />
      <Banner />
      <Main>
        <Container>
          <EntryHeader title='Shop' />
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
  ${NavigationMenu.fragments.entry}
  ${ProductsFragment}
  query GetProductCategoryData(
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
    $slug: ID!
  ) {
    generalSettings {
      ...BlogInfoFragment
    }
    footerMenuItems: menuItems(where: { location: $footerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    headerMenuItems: menuItems(where: { location: $headerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    productCategory(id: $slug, idType: SLUG) {
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

Component.variables = ({ databaseId, slug }) => {
  return {
    databaseId,
    slug,
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
  };
};
