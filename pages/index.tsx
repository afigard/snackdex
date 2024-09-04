import styles from "../styles/Home.module.css";
import Image from "next/image";

export default function Home() {
  return (
    <div className={styles.container}>
      <Image
        src="/logo.png"
        alt="Logo"
        width={300}
        height={300}
        className={styles.logo}
      />
    </div>
  );
}
