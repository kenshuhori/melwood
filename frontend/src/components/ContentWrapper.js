import styles from "src/styles/ContentWrapper.module.scss";

export const ContentWrapper = (props) => {
  return <div className={styles.main}>{props.children}</div>;
};

export const WideContentWrapper = (props) => {
  return <div className={styles.wide}>{props.children}</div>;
};
