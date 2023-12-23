import { PageContainer, ProCard, ProLayout } from "@ant-design/pro-components";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AllTaskView from "../views/AllTaskView";
import { Button, Divider, Dropdown, Space } from "antd";
import TaskStore from "../stores/TaskStore";
import { getLoginUser } from "../utils/commonUtil";
import { observer } from "mobx-react-lite";
import { Header } from "antd/es/layout/layout";

const defaultProps = {
  route: {
    routes: [
      {
        path: "/home/alltask",
        name: "全部任务",
      },
      {
        path: "/home/mytask",
        name: "我负责的",
      },
      {
        path: "/home/followtask",
        name: "我关注的",
      },
    ],
  },
};

function Home() {
  const [pathname, setPathname] = useState("/list/sub-page/sub-sub-page1");
  const navigate = useNavigate();

  useEffect(() => {
    //如果未登录，则跳转到登录
    const token = localStorage.getItem("token");
    if (!!!token) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <PageContainer>
        <Header style={{ background: "white" }}>
          <div
            style={{
              float: "right",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Space>
              <span>
                <a
                  target="_blank"
                  href="https://github.com/Hz-Ryze/todolist_react_antd"
                >
                  前端源码
                </a>
              </span>
              <span>
                <a
                  target="_blank"
                  href="https://github.com/Hz-Ryze/todolist_next"
                >
                  后端源码
                </a>
              </span>

              <span>
                <a
                  target="_blank"
                  href="https://github.com/Hz-Ryze/todolist_next"
                >
                  Readme
                </a>
              </span>

              <span>用户：{getLoginUser().nickname}</span>

              <Button
                type="link"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  window.location.href = "/login";
                }}
              >
                退出
              </Button>
            </Space>
          </div>
        </Header>
        <Divider />
        <ProCard
          style={{
            height: "100vh",
            minHeight: 800,
          }}
        >
          <AllTaskView taskStore={TaskStore} />
          <div />
        </ProCard>
      </PageContainer>
    </>
  );
}

export default observer(Home);
