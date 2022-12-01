import { getWordPressProps, WordPressTemplate } from '@faustwp/core';

export default function Page(props) {
  return <WordPressTemplate {...props} />;
}

export async function getStaticProps(ctx) {
  // use isr for the shop and product pages
  if (
    ctx.params.wordpressNode[0] === 'shop' ||
    ctx.params.wordpressNode[0] === 'product'
  ) {
    return { ...(await getWordPressProps({ ctx })), revalidate: 5 };
  }

  return getWordPressProps({ ctx });
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
