import Link from "next/link";
import Image from "next/image";
import styles from "./header.module.css";
import logoSvg from "../public/logo/svd-logo_extended.svg";

export default function Header() {
  return <header className={styles.site_header}>
    <div className={styles.navigation_top_wrapper}>
      <div className={styles.site_logo}>
        <Image height={40} width={250} src={logoSvg} alt="Rodong Sinmun logo" />
      </div>
      <nav className={styles.navigation_top}>
        <ul className={styles.nav_list}>
          <li key={1}><Link className={styles.Navigation_link} href="/senaste">Nyheter</Link></li>
          <li key={2}><Link className={styles.Navigation_link} href="/senaste">Kim</Link></li>
          <li key={3}><Link className={styles.Navigation_link} href="/senaste">Bilder</Link></li>
        </ul>
      </nav>
    </div>
  </header>;
}
