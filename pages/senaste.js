import Link from "next/link";
import Head from "next/head";
import { scrapeSite } from "../lib/rodong-scraper";
import styles from '../styles/News.module.css'
import LatestTeaser from "../components/teaser/latest-teaser";

export default function News({ links }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Senaste nytt: Rodong Sinmun</title>
      </Head>
      <section className={styles.section}>
      <div>
        {links.map(
          (link) =>
            link?.article?.id && (
              <LatestTeaser link={link} />
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
