import Link from "next/link";
import styles from "./latest-teaser.module.css";

export default function LatestTeaser({ link }) {
  return (
    <div className={styles.latest_teaser_box} key={`i-${link.href}`}>
      <span className={styles.meta_container}>
        <time className={styles.meta_time}>4 min</time>
        <span className={styles.meta_divider}> </span>
        <span className={styles.meta_category}>Kim</span>
      </span>
      <div className={styles.border_box}>
        <Link
          href={{
            pathname: "/article/[id]",
            query: { id: link.article?.id },
          }}
        >
          <a>
            <h2 className={styles.headline}>{link.title}</h2>
            <p className={styles.deck}>{link.article.paragraphs[0]}</p>
          </a>
        </Link>
      </div>
    </div>
  );
}
