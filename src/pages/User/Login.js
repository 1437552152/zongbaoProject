import React, { Component } from "react";
import { connect } from "dva";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import { Alert } from "antd";
import Login from "@/components/Login";
// import { setAuthority } from "@/utils/authority";
import styles from "./Login.less";

const { UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects["login/login"]
}))
class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginType: 0
    };
  }

  componentDidMount() {
    this.decideLogin();
  }

  decideLogin = () => {
    const { sysName } = process.env;
    const { enableCas } = process.env;
    if (enableCas === "true") {
      this.setState(
        {
          loginType: 1
        },
        () => {
          if (sysName === "imc") {
            window.open(
              "https://www.bondedarea.com:8443/cas/login?service=http://10.110.200.145:8080/services/gateway/writeInfo/control",
              "_self"
            );
          }
          if (sysName === "monitoring") {
            window.open(
              "https://www.bondedarea.com:8443/cas/login?service=http://10.110.200.145:8080/services/gateway/writeInfo/monitor",
              "_self"
            );
          }
          if (sysName === "iop") {
            window.open(
              "https://www.bondedarea.com:8443/cas/login?service=http://10.110.200.145:8080/services/gateway/writeInfo/operation",
              "_self"
            );
          }
        }
      );
    } else {
      this.setState({
        loginType: 0
      });
    }
  };

  handleSubmit = (err, values) => {
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: "login/login",
        payload: {
          ...values
        }
      });
    }
  };

  renderMessage = content => (
    <Alert
      style={{ marginBottom: 24 }}
      message={content}
      type="error"
      showIcon
    />
  );

  render() {
    const { submitting } = this.props;
    const { loginType } = this.state;
    return (
      // <div>登录中...</div>
      <div className={styles.main}>
        {loginType === 0 && (
          <Login
            onSubmit={this.handleSubmit}
            ref={form => {
              this.loginForm = form;
            }}
          >
            <UserName
              name="username"
              placeholder={`${formatMessage({
                id: "app.login.userName"
              })}: admin`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: "validation.userName.required" })
                }
              ]}
            />
            <Password
              name="password"
              placeholder={`${formatMessage({
                id: "app.login.password"
              })}: 123`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: "validation.password.required" })
                }
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />

            <Submit loading={submitting}>
              <FormattedMessage id="app.login.login" />
            </Submit>
          </Login>
        )}
      </div>
    );
  }
}

export default LoginPage;
