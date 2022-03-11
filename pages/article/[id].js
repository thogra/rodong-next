import Link from 'next/link';
import { scrapeSite } from "../../lib/rodong-scraper";
import _ from "lodash";

export default function Article({ article }) {
  const texts = article?.paragraphs;
  return (
    <div>
      <div>
        <Link href="/">Back</Link>
      </div>
      <h1>{article.title}</h1>
      <div>
        {texts.map((text, idx) => (
          <p key={`a-${idx}`}>{text}</p>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps({ params }) {
  const siteData = await scrapeSite();
  const articles = _.compact(_.map(siteData.links, "article"));
  const article = _.find(articles, { id: params?.id });
  return {
    props: {
      article,
    },
  };
}

export async function getStaticPaths() {
  const siteData = await scrapeSite();
  const articles = _.compact(_.map(siteData.links, "article"));
  const paths = _.map(articles, (article) => ({
    params: { id: article.id },
  }));
  return { paths, fallback: false };
}
