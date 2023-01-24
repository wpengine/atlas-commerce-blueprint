import React from 'react';
import { gql } from '@apollo/client';
import { getWordPressProps } from '@faustwp/core';
import { BlogInfoFragment } from '@fragments/GeneralSettings';
import { StoreSettingsFragment } from '@fragments/StoreSettings';
import { ProductCategoryFragment } from '@fragments/ProductCategories';
import {
  Banner,
  Container,
  Footer,
  Header,
  Main,
  NavigationMenu,
  FeaturedImage,
  SearchInput,
  SearchRecommendations,
  SearchResults,
  SEO,
} from '@components';
import * as MENUS from '@constants/menus';
import useSearch from '../hooks/useSearch';
import styles from '@styles/pages/_Search.module.scss';

export default function Page(props) {
  const { title: siteTitle, description: siteDescription } = props?.data
    ?.generalSettings ?? { '': '' };
  const primaryMenu = props?.data?.headerMenuItems?.nodes ?? [];
  const footerMenu = props?.data?.footerMenuItems?.nodes ?? [];
  const storeSettings = props?.data?.storeSettings?.nodes ?? [];
  const productCategories = props?.data?.productCategories?.nodes ?? [];

  const { searchQuery, setSearchQuery, searchResults, isLoading, error } =
    useSearch();

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
        <Container>
          <div
            className={styles['search-header-pane']}
            style={{
              backgroundColor: storeSettings?.storePrimaryColor,
              color: storeSettings?.storeSecondaryColor,
            }}
          >
            <h2 className={styles['search-header-text']}>
              {searchQuery && !isLoading
                ? `Showing results for "${searchQuery}"`
                : `Search`}
            </h2>
            <SearchInput
              value={searchQuery}
              onChange={(newValue) => setSearchQuery(newValue)}
            />
          </div>
          {error && (
            <div className='alert-error'>
              An error has occurred. Please refresh and try again.
            </div>
          )}

          <SearchResults searchResults={searchResults} isLoading={isLoading} />

          {!isLoading && searchResults === null && (
            <SearchRecommendations categories={productCategories} />
          )}
        </Container>
      </Main>

      <Footer title={siteTitle} menuItems={footerMenu} />
    </>
  );
}

export function getStaticProps(ctx) {
  return getWordPressProps({ ctx });
}

Page.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  ${FeaturedImage.fragments.entry}
  ${StoreSettingsFragment}
  ${ProductCategoryFragment}
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
    productCategories {
      nodes {
        ...ProductCategoryFragment
      }
    }
  }
`;

Page.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
    asPreview: ctx?.asPreview,
  };
};
