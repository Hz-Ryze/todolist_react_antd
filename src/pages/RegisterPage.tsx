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
import { Alert, Button, Divider, Space, Tabs, message, theme } from "antd";
import type { CSSProperties } from "react";
import { useState } from "react";
import { fetchPostCreateUser } from "../services/login.service";
import SelectGroup from "../components/SelectGroup";
import { Link, useNavigate } from "react-router-dom";
import { UserInterface } from "../entities/user.entity";

const RegisterPage = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  let [errorMessage, setErrorMessage] = useState<String | null>("");

  const handleSubmit = async (formData: Record<string, any>) => {
    const res: any = await fetchPostCreateUser(formData);
    if (res.data) {
      setErrorMessage(null);
      const data = res.data as UserInterface;
      localStorage.setItem("token", data.mobile);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/home");
    } else {
      setErrorMessage("注册失败，请重试");
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
        message={<Alert message={errorMessage} />}
        containerStyle={{
          backgroundColor: "rgba(0, 0, 0,0.65)",
          backdropFilter: "blur(4px)",
        }}
        subTitle=""
        onFinish={handleSubmit}
      >
        <Tabs centered>
          <Tabs.TabPane tab={"手机号密码注册"} />
        </Tabs>

        <>
          <ProFormText
            name="nickname"
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
            placeholder={"昵称"}
            rules={[
              {
                required: true,
                message: "请输入昵称",
              },
            ]}
          />
          <ProFormText
            name="mobile"
            fieldProps={{
              size: "large",
              prefix: (
                <MobileOutlined
                  style={{
                    color: token.colorText,
                  }}
                  className={"prefixIcon"}
                />
              ),
            }}
            placeholder={"手机号"}
            rules={[
              {
                required: true,
                message: "请输入手机号!",
              },
            ]}
          />
          <ProFormText.Password
            name="password"
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
            placeholder={"密码"}
            rules={[
              {
                required: true,
                message: "请输入密码！",
              },
            ]}
          />
          <SelectGroup></SelectGroup>
        </>

        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          <Link
            to={"/login"}
            style={{
              float: "right",
            }}
          >
            登录
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
      <RegisterPage />
    </ProConfigProvider>
  );
};
