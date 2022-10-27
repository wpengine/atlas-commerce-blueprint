import React from 'react';
import { gql } from '@apollo/client';
import { getWordPressProps } from '@faustwp/core';
import { BlogInfoFragment } from '../fragments/GeneralSettings';
import {
  Banner,
  Button,
  Footer,
  Header,
  Main,
  Notification,
  NavigationMenu,
  FeaturedImage,
  SearchInput,
  SearchRecommendations,
  SearchResults,
  SEO,
} from '../components';
import useSearch from '../hooks/useSearch';
import styles from '../styles/pages/_Search.module.scss';

export default function Page({ __TEMPLATE_QUERY_DATA__: templateData }) {
  const { title: siteTitle, description: siteDescription } =
    templateData?.generalSettings;
  const primaryMenu = templateData?.headerMenuItems?.nodes ?? [];
  const footerMenu = templateData?.footerMenuItems?.nodes ?? [];
  const { title, content, featuredImage } = templateData?.page ?? { title: '' };
  const storeSettings = templateData?.storeSettings?.nodes ?? [];

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    loadMore,
    isLoading,
    pageInfo,
    error,
  } = useSearch();

  // console.log(searchQuery);
  // console.log(searchResults);

  return (
    <>
      <SEO title={siteTitle} description={siteDescription} />
      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
        storeSettings={templateData?.storeSettings}
      />
      <Banner />
      <Main>
        <div
          className={styles['search-header-pane']}
          style={{
            backgroundColor: storeSettings?.storePrimaryColor,
            color: storeSettings?.storeSecondaryColor,
          }}
        >
          <div className='container small'>
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
        </div>
        <div className='container small'>
          {error && (
            <div className='alert-error'>
              An error has occurred. Please refresh and try again.
            </div>
          )}

          <SearchResults searchResults={searchResults} isLoading={isLoading} />

          {pageInfo?.hasNextPage && (
            <div className={styles['load-more']}>
              <Button onClick={() => loadMore()}>Load more</Button>
            </div>
          )}

          {!isLoading && searchResults === null && <SearchRecommendations />}
        </div>
      </Main>

      <Footer storeSettings={storeSettings} />
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
  query GetSearchPage(
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

Page.variables = ({ uri }, ctx) => {
  return {
    uri,
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
  };
};
