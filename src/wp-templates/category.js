import { gql } from '@apollo/client';
import * as MENUS from '@constants/menus';
import { BlogInfoFragment } from '@fragments/GeneralSettings';
import { StoreSettingsFragment } from '@fragments/StoreSettings';
import { BannerFragment } from '@fragments/Banners';
import {
  Header,
  Footer,
  Main,
  Banner,
  Container,
  EntryHeader,
  NavigationMenu,
  Post,
  FeaturedImage,
  SEO,
} from '@components';

export default function Component(props) {
  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings ?? {};
  const banner = props?.data?.banners?.nodes[0];
  const primaryMenu = props?.data?.headerMenuItems?.nodes ?? [];
  const footerMenu = props?.data?.footerMenuItems?.nodes ?? [];
  const { name, posts } = props.data.nodeByUri;

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
      <Banner notificationBanner={banner} />
      <Main>
        <>
          <EntryHeader title={`Category: ${name}`} />
          <Container>
            {posts.edges.map((post) => (
              <Post
                key={`category-${post.id}`}
                title={post.node.title}
                content={post.node.content}
                date={post.node.date}
                author={post.node.author?.node.name}
                uri={post.node.uri}
                featuredImage={post.node.featuredImage?.node}
              />
            ))}
          </Container>
        </>
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
  ${StoreSettingsFragment}
  query GetCategoryPage(
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

Component.variables = ({ uri }) => {
  return {
    uri,
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
  };
};
