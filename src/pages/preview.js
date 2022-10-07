import { client } from 'client';

import { PostComponent } from './posts/[postSlug]';
import { PageComponent } from './[...pageUri]';
import { ProductComponent } from './product/[productSlug]';
import { ShopComponent } from './shop';

export default function Preview() {
  const isLoading = client.useIsLoading();
  const { typeName, node } = client.auth.usePreviewNode();

  const products = client.useQuery().products({ first: 100 });
  const product = client.useQuery().product({
    id: node !== undefined ? node.productSlug : null,
    idType: 'SLUG',
  });

  if (isLoading || node === undefined) {
    return <p>Loading...</p>;
  }

  if (node === null) {
    return <p>Post not found</p>;
  }

  switch (typeName) {
    case 'Page': {
      const page = node;

      if (page.slug === 'shop') {
        // Will not work with an autosave version of the shop page as the slug changes
        return <ShopComponent products={products?.nodes} />;
      }

      return <PageComponent page={page} />;
    }
    case 'Post': {
      const post = node;
      return <PostComponent post={post} />;
    }
    // Add custom post types here as needed
    case 'Product': {
      return <ProductComponent product={product} />;
    }

    default: {
      throw new Error(`Unknown post type: ${typeName}`);
    }
  }
}
