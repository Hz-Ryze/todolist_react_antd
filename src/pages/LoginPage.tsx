import {
  AlipayOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoOutlined,
  UserOutlined,
  WeiboOutlined,
} from "@ant-design/icons";
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from "@ant-design/pro-components";
import { Alert, Button, Divider, Space, Tabs, theme } from "antd";
import type { CSSProperties } from "react";
import { useState } from "react";
import { fetchPostAuthLogin } from "../services/login.service";
import { Link, useNavigate } from "react-router-dom";
import { UserInterface } from "../entities/user.entity";

const LoginPage = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  let [errorMessage, setErrorMessage] = useState<String | null>("");

  const handleSubmit = async (formData: Record<string, any>) => {
    setErrorMessage(null);
    const res: any = await fetchPostAuthLogin(formData);
    if (res.data) {
      const data = res.data as UserInterface;
      localStorage.setItem("token", data.mobile);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/home");
    } else {
      setErrorMessage("用户名或密码错误");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        height: "100vh",
      }}
    >
      <LoginFormPage
        backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
        backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
        title="TodoList"
        containerStyle={{
          backgroundColor: "rgba(0, 0, 0,0.65)",
          backdropFilter: "blur(4px)",
        }}
        message={<Alert message={errorMessage} />}
        subTitle=""
        onFinish={handleSubmit}
        actions={
          <div
            onClick={() => {
              console.log("333333333");
            }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          ></div>
        }
      >
        <Tabs centered>
          <Tabs.TabPane tab={"手机号密码注册"} />
        </Tabs>

        <>
          <ProFormText
            name="mobile"
            initialValue="13300000001"
            fieldProps={{
              size: "large",
              prefix: (
                <UserOutlined
                  style={{
                    color: token.colorText,
                  }}
                  className={"prefixIcon"}
                />
              ),
            }}
            placeholder={"手机号:13361013995"}
            rules={[
              {
                required: true,
                message: "请输入手机号!",
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            initialValue="123456"
            fieldProps={{
              size: "large",
              prefix: (
                <LockOutlined
                  style={{
                    color: token.colorText,
                  }}
                  className={"prefixIcon"}
                />
              ),
            }}
            placeholder={"密码: 123456"}
            rules={[
              {
                required: true,
                message: "请输入密码！",
              },
            ]}
          />
        </>

        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          <Link
            to={"/register"}
            style={{
              float: "right",
            }}
          >
            注册
          </Link>
          <br></br>
        </div>
      </LoginFormPage>
    </div>
  );
};

export default () => {
  return (
    <ProConfigProvider dark>
      <LoginPage />
    </ProConfigProvider>
  );
};
