import styles from "src/styles/Header.module.scss";
import { ContentWrapper } from "src/components/ContentWrapper";

export const Header = () => {
  return (
    <ContentWrapper>
      <header className={styles.header}>
        <div className={styles.header__inner}>
          <img width={15} src="f.svg" style={{ marginRight: "10px" }} />
          <span>Fundamentals</span>
        </div>
      </header>
    </ContentWrapper>
  );
};
