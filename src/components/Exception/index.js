// import React, { createElement } from "react";
import React from "react";
import classNames from "classnames";
import { Button } from "antd";
import router from "umi/router";
import { connect } from "dva";
import config from "./typeConfig";
import styles from "./index.less";

@connect(({ login }) => ({
  login
}))
class Exception extends React.PureComponent {
  static defaultProps = {
    backText: "back to home",
    redirect: "/"
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  getOut = () => {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.dispatch({
      type: "login/getRoutes"
    });
    router.push("/user/login");
    window.location.reload(true);
  };

  render() {
    const {
      className,
      backText,
      // linkElement = "a",
      type,
      title,
      desc,
      img,
      actions,
      redirect,
      ...rest
    } = this.props;
    const pageType = type in config ? type : "404";
    const clsString = classNames(styles.exception, className);
    return (
      <div className={clsString} {...rest}>
        <div className={styles.imgBlock}>
          <div
            className={styles.imgEle}
            style={{ backgroundImage: `url(${img || config[pageType].img})` }}
          />
        </div>
        <div className={styles.content}>
          <h1>{title || config[pageType].title}</h1>
          <div className={styles.desc}>{desc || config[pageType].desc}</div>
          <div className={styles.actions}>
            {/* {actions ||
              createElement(
                linkElement,
                {
                  to: redirect,
                  href: redirect
                },
                <Button type="primary">{backText}</Button>
              )} */}
            <Button type="primary" onClick={this.getOut}>
              {backText}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Exception;
