import type { ProColumns } from "@ant-design/pro-components";
import { ProFormSelect, ProTable } from "@ant-design/pro-components";
import { Button, Dropdown, Select, DatePicker, Drawer, Checkbox } from "antd";
import SelectCreator from "../components/SelectCreator";
import { observer } from "mobx-react-lite";
import { TaskStore } from "../stores/TaskStore";
import { v4 as uuidv4 } from "uuid";
import { TaskInterface } from "../entities/task.entity";
import { getLoginUser } from "../utils/commonUtil";
import { useRef, useState } from "react";
import TaskDetailView from "./TaskDetailView";
import { autorun } from "mobx";
import { CheckboxChangeEvent } from "antd/es/checkbox";
const { RangePicker } = DatePicker;

function AllTaskView({ taskStore }: { taskStore: TaskStore }) {
  let ChildRef: any = useRef();

  function onChangeCheckbox(e: CheckboxChangeEvent) {
    if (e.target.checked) {
      taskStore.completeTask(e.target.value);
    } else {
      taskStore.workingTask(e.target.value);
    }
  }

  const columns: ProColumns<TaskInterface>[] = [
    {
      title: "",
      dataIndex: "",

      render: (text, entity) => {
        return (
          <>
            <Checkbox
              value={entity}
              checked={entity.status === "已完成" ? true : false}
              onChange={onChangeCheckbox}
            ></Checkbox>
          </>
        );
      },
    },
    {
      title: "UUID",
      dataIndex: "UUID",
      sorter: {
        compare: (a: TaskInterface, b: TaskInterface) => {
          return -1;
        },
      },
      render: (text, entity) => {
        return <>{text}</>;
      },
    },
    {
      title: "任务标题",
      dataIndex: "title",
      render: (text, entity) => {
        return (
          <div
            style={{
              cursor: "pointer",
              color: entity.status === "已完成" ? "gray" : "blue",
              textDecoration: entity.status === "已完成" ? "line-through" : "",
            }}
            onClick={() => {
              let _entity = Object.assign({}, entity);

              ChildRef.current.fatherOpen(_entity);
            }}
          >
            {text}
          </div>
        );
      },
    },
    {
      title: "负责人",
      dataIndex: "assignee",
      render: (text: any, entity) => {
        let result = "";
        if (text && text.length > 0) {
          for (const item of text) {
            if (item && item.nickname) {
              result += `${item.nickname} | `;
            }
          }
        }

        return (
          <div
            style={{
              color: entity.status === "已完成" ? "gray" : "",
              textDecoration: entity.status === "已完成" ? "line-through" : "",
            }}
          >
            {result}
          </div>
        );
      },
    },
    {
      title: "关注者",
      dataIndex: "follower",
      render: (text: any, entity) => {
        let result = "";
        if (text && text.length > 0) {
          for (const item of text) {
            if (item && item.nickname) {
              result += `${item.nickname} | `;
            }
          }
        }

        return (
          <div
            style={{
              color: entity.status === "已完成" ? "gray" : "",
              textDecoration: entity.status === "已完成" ? "line-through" : "",
            }}
          >
            {result}
          </div>
        );
      },
    },
    {
      title: "开始时间",
      dataIndex: "start_date",
      sorter: {
        compare: (a: TaskInterface, b: TaskInterface) => {
          return -1;
        },
      },
      render: (text: any, entity) => {
        let result = "";
        if (text && text != "-") {
          result = new Date(`${text}`).toLocaleString();
        } else {
          result = "";
        }

        return (
          <div
            style={{
              color: entity.status === "已完成" ? "gray" : "",
              textDecoration: entity.status === "已完成" ? "line-through" : "",
            }}
          >
            {result}
          </div>
        );
      },
    },
    {
      title: "截止时间",
      dataIndex: "due_date",

      sorter: {
        compare: (a: TaskInterface, b: TaskInterface) => {
          return -1;
        },
      },
      render: (text: any, entity) => {
        let result = "";
        if (text && text != "-") {
          result = new Date(`${text}`).toLocaleString();
        } else {
          result = "";
        }

        return (
          <div
            style={{
              color: entity.status === "已完成" ? "gray" : "",
              textDecoration: entity.status === "已完成" ? "line-through" : "",
            }}
          >
            {result}
          </div>
        );
      },
    },
    {
      title: "创建人",
      dataIndex: "creator",
      render: (text: any, entity) => {
        let result = "";
        if (text && text.length > 0) {
          result = text[0].nickname;
        }

        return (
          <div
            style={{
              color: entity.status === "已完成" ? "gray" : "",
              textDecoration: entity.status === "已完成" ? "line-through" : "",
            }}
          >
            {result}
          </div>
        );
      },
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      sorter: {
        compare: (a: TaskInterface, b: TaskInterface) => {
          return -1;
        },
        multiple: 3,
      },
      render: (text: any, entity) => {
        let result = "";
        if (text && text != "-") {
          result = new Date(`${text}`).toLocaleString();
        } else {
          result = "";
        }

        return (
          <div
            style={{
              color: entity.status === "已完成" ? "gray" : "",
              textDecoration: entity.status === "已完成" ? "line-through" : "",
            }}
          >
            {result}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <ProTable<TaskInterface>
        dataSource={taskStore.currentShowTasks}
        rowKey="key"
        expandable={{
          defaultExpandAllRows: true,
          defaultExpandedRowKeys: [],
        }}
        columns={columns}
        onChange={(pagination: any, filters: any, sorter: any, extra: any) => {
          console.log(
            "🚀 ~ file: AllTaskView.tsx:212 ~ AllTaskView ~ sorter:",
            sorter
          );
        }}
        search={false}
        childrenColumnName="sub_task"
        pagination={false}
        dateFormatter="string"
        headerTitle=""
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              const _user = getLoginUser();
              const _task: any = {
                UUID: uuidv4(),
                creator: {
                  mobile: _user.mobile,
                  nickname: _user.nickname,
                },
                title: `${_user.nickname}的任务`,
                comment: [
                  {
                    description: `${_user.nickname} 创建了任务`,
                    user: {
                      mobile: _user.mobile,
                      nickname: _user.nickname,
                    },
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                ],
                status: "进行中",
              };
              if (_user.teams) {
                _task["teams"] = _user.teams;
              }

              taskStore.addTask(_task);
            }}
          >
            创建任务
          </Button>,
          <Select
            defaultValue="全部任务"
            onChange={(value: unknown) => {
              taskStore.updateFilter({
                status: value,
              });
            }}
            style={{ width: 120 }}
            options={[
              { value: "", label: "全部任务" },
              { value: "已完成", label: "已完成" },
              { value: "进行中", label: "进行中" },
            ]}
          />,
          <DatePicker
            placeholder="开始时间"
            showTime
            style={{ width: 220 }}
            onChange={(time) => {
              if (time) {
                taskStore.updateFilter({
                  start_date: time.toDate(),
                });
              } else {
                taskStore.updateFilter({
                  start_date: null,
                });
              }
            }}
          />,
          <DatePicker
            placeholder="截止时间"
            showTime
            style={{ width: 220 }}
            onChange={(time) => {
              if (time) {
                taskStore.updateFilter({
                  due_date: time.toDate(),
                });
              } else {
                taskStore.updateFilter({
                  due_date: null,
                });
              }
            }}
          />,

          <SelectCreator
            label="创建者"
            onChange={(value: unknown, option: any) => {
              taskStore.updateFilter({
                creator: value,
              });
            }}
          ></SelectCreator>,
          <SelectCreator
            label="负责人"
            onChange={(value: unknown, option: any) => {
              taskStore.updateFilter({
                assignee: value,
              });
            }}
          ></SelectCreator>,
          <ProFormSelect
            label={"我关注的"}
            style={{ width: 150 }}
            request={async () => {
              return [
                { label: "全部任务", value: "" },
                { label: "我关注的", value: getLoginUser().mobile },
              ];
            }}
            onChange={(value: any, option: any) => {
              if (!!value) {
                taskStore.updateFilter({
                  follower: value.value,
                });
              } else {
                taskStore.updateFilter({
                  follower: "",
                });
              }
            }}
            placeholder=""
            fieldProps={{
              labelInValue: true,
            }}
          />,
        ]}
      />
      <TaskDetailView taskStore={taskStore} onRef={ChildRef}></TaskDetailView>
    </>
  );
}
export default observer(AllTaskView);
