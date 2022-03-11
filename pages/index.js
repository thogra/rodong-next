import Link from "next/link";
import Head from "next/head";
import { scrapeSite } from "../lib/rodong-scraper";
import styles from '../styles/News.module.css'

export default function News({ links }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Rodong Sinmun 2.0</title>
      </Head>
      <section className={styles.section}>
      <h1>Senaste nytt</h1>
      <div>
        {links.map(
          (link) =>
            link?.article?.id && (
              <div className="news-link" key={`i-${link.href}`}>
                <Link
                  href={{
                    pathname: "/article/[id]",
                    query: { id: link.article?.id },
                  }}
                >
                  {link.title}
                </Link>
              </div>
            )
        )}
      </div>
      </section>
    </div>
  );
}

export async function getStaticProps() {
  const data = await scrapeSite();

  return {
    props: {
      ...data,
    },
  };
}
