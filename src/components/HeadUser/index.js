import React, { PureComponent } from "react";
import { connect } from "dva";
import router from "umi/router";
import { Icon } from "antd";

import styles from "./index.less";

@connect(({ login }) => ({
  login
}))
class HeadUser extends PureComponent {
  onLoginClick = username => {
    const { sysName } = process.env;
    const { enableCas } = process.env;
    const { dispatch } = this.props;
    sessionStorage.removeItem("antd-pro-authority");
    if (username) {
      // 退出
      if (enableCas === "true") {
        if (sysName === "imc") {
          window.open(
            "https://www.bondedarea.com:8443/cas/login?service=http://10.110.200.145:8080/services/gateway/casLogout/control",
            "_self"
          );
        }
        if (sysName === "monitoring") {
          window.open(
            "https://www.bondedarea.com:8443/cas/login?service=http://10.110.200.145:8080/services/gateway/casLogout/monitor",
            "_self"
          );
        }
        if (sysName === "iop") {
          window.open(
            "https://www.bondedarea.com:8443/cas/login?service=http://10.110.200.145:8080/services/gateway/casLogout/operation",
            "_self"
          );
        }
      } else {
        dispatch({
          type: "login/newLoginOut"
        });
        router.push("/user/login");
        window.location.reload(true);
      }
    } else {
      // 登录
      dispatch({
        type: "login/getRoutes"
      });
      router.push("/user/login");
      window.location.reload(true);
    }
  };

  renderMenu = () => {
    const { collapsed, onCollapse } = this.props;
    return (
      <Icon
        type={collapsed ? "menu-unfold" : "menu-fold"}
        style={{ fontSize: "28px", color: "#fff" }}
        onClick={() => onCollapse(!collapsed)}
      />
    );
  };

  render() {
    const { collapsed, username } = this.props;
    const style = {};
    if (collapsed) {
      style.width = 80;
    }
    return (
      <div className={styles.headerUserContainer} style={style}>
        {collapsed ? (
          this.renderMenu()
        ) : (
          <div className={styles.headerUser}>
            <div className={styles.headerUserLogo}>
              <img src="./assets/common/yonghu.png" alt="" width="40px" />
            </div>
            <div>
              <span className={styles.headerUserTitle}>
                {username || "未登录"}
              </span>
              <br />
              <a
                className={styles.headerUserContent}
                onClick={() => this.onLoginClick(username)}
              >
                {username ? "登出" : "登录"}
              </a>
            </div>
            <div style={{ flex: 1 }} />
            {this.renderMenu()}
          </div>
        )}
      </div>
    );
  }
}

export default connect(({ login }) => ({
  login
}))(HeadUser);
