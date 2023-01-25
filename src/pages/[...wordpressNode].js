import { getWordPressProps, WordPressTemplate } from '@faustwp/core';

export default function Page(props) {
  return <WordPressTemplate {...props} />;
}

export async function getStaticProps(ctx) {
  if (
    ctx.params.wordpressNode[0] === 'shop' ||
    ctx.params.wordpressNode[0] === 'product' ||
    ctx.params.wordpressNode[0] === 'search'
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
