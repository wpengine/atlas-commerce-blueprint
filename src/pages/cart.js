import { gql, useQuery } from '@apollo/client';
import * as MENUS from '@constants/menus';
import { BlogInfoFragment } from '@fragments/GeneralSettings';
import { StoreSettingsFragment } from '@fragments/StoreSettings';
import { BannerFragment } from '@fragments/Banners';
import useAtlasEcom from '@hooks/useAtlasEcom';
import {
  Banner,
  Header,
  Footer,
  Main,
  Container,
  EntryHeader,
  NavigationMenu,
  SEO,
} from '@components';

export default function Page() {
  const { data } = useQuery(Page.query, {
    variables: Page.variables(),
  });

  const { title: siteTitle, description: siteDescription } =
    data?.generalSettings ?? {};
  const banner = data?.banners?.nodes[0];
  const primaryMenu = data?.headerMenuItems?.nodes ?? [];
  const footerMenu = data?.footerMenuItems?.nodes ?? [];

  const { cartData } = useAtlasEcom();

  let cartSubTotal = (0).toFixed(2);
  let cartItems = [];
  let cartCount = 0;

  if (cartData) {
    cartSubTotal = cartData.cart_amount.toFixed(2);
    cartItems = [].concat(
      cartData.line_items.physical_items,
      cartData.line_items.custom_items,
      cartData.line_items.digital_items,
      cartData.line_items.gift_certificates
    );
    cartCount = cartItems.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);
  }

  return (
    <>
      <SEO title={siteTitle} description={siteDescription} />
      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
        storeSettings={data?.storeSettings}
      />
      <Banner notificationBanner={banner} />
      <Main>
        <Container>
          <EntryHeader title='Cart' />
          <div className='row row-wrap'>
            {cartData ? (
              <p>A Table of Cart Data</p>
            ) : (
              <p>You have no items in cart</p>
            )}
          </div>
        </Container>
      </Main>
      <Footer title={siteTitle} menuItems={footerMenu} />
    </>
  );
}

Page.query = gql`
  ${BlogInfoFragment}
  ${BannerFragment}
  ${NavigationMenu.fragments.entry}
  ${StoreSettingsFragment}
  query GetPageData(
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
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
  }
`;

Page.variables = () => {
  return {
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
  };
};
