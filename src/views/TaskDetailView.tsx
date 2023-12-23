import { observer } from "mobx-react-lite";
import React, { useEffect, useImperativeHandle, useState } from "react";
import { TaskStore } from "../stores/TaskStore";
import { TaskInterface } from "../entities/task.entity";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  List,
  message,
  notification,
} from "antd";
import SelectCreator from "../components/SelectCreator";

import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import { getLoginUser } from "../utils/commonUtil";
const { TextArea } = Input;

function TaskDetailView({
  taskStore,

  onRef,
}: {
  taskStore: TaskStore;
  onRef: any;
}) {
  const [form] = Form.useForm();
  const [openDetail, setOpenDetail] = useState(false);

  const [formInitData, setFormInitData] = useState<any>();

  useEffect(() => {
    setTimeout(() => {
      form.resetFields();
    });
  }, [formInitData]);

  useImperativeHandle(onRef, () => {
    return {
      fatherOpen: fatherOpen,
    };
  });

  const fatherOpen = (data: any) => {
    if (data.assignee) {
      let assignee = data.assignee;
      let result = [];
      for (const item of assignee) {
        result.push({
          value: item?.mobile,
          label: item?.nickname,
        });
      }
      data.assignee = result;
    }

    if (data.follower) {
      let follower = data.follower;
      let result = [];
      for (const item of follower) {
        result.push({
          value: item?.mobile,
          label: item?.nickname,
        });
      }
      data.follower = result;
    }
    if (data.start_date) {
      data.start_date = moment(data.start_date);
    }
    if (data.due_date) {
      data.due_date = moment(data.due_date);
    }

    // setFormInitData({});

    setFormInitData(data);

    setOpenDetail(true);
  };

  const onDelete = async () => {
    taskStore.deleteTask(formInitData);
  };
  const onComplete = async () => {
    taskStore.completeTask(formInitData);
  };

  const onFinish = async (values: any) => {
    if (values.assignee && values.assignee.length === 0) {
      delete values.assignee;
    }
    if (values.follower && values.follower.length === 0) {
      delete values.follower;
    }

    if (values.start_date) {
      values.start_date = values.start_date.toDate();
    }
    if (values.due_date) {
      values.due_date = values.due_date.toDate();
    }
    if (values.sub_task_title) {
      const _user = getLoginUser();
      const sub_task = [];
      for (const _title of values.sub_task_title) {
        const _task = {
          UUID: uuidv4(),
          key: "",
          creator: {
            mobile: _user.mobile,
            nickname: _user.nickname,
          },
          title: _title,
          comment: [
            {
              description: `${_user.nickname} 创建了子任务`,
              user: {
                mobile: _user.mobile,
                nickname: _user.nickname,
              },
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          status: "进行中",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        sub_task.push(_task);
      }
      values.sub_task = sub_task;
    }

    if (values.add_comment) {
      const _user = getLoginUser();

      let _comment = formInitData.comment ?? [];

      values.comment = [
        ..._comment,
        {
          description: values.add_comment,
          user: {
            mobile: _user.mobile,
            nickname: _user.nickname,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      formInitData.comment = values.comment;
      setFormInitData(formInitData);
    }

    let _result: any = {};

    Object.keys(values).forEach(function (k) {
      if (!!values[k]) {
        _result[k] = values[k];
      }
    });

    if (_result.assignee) {
      let assignee = _result.assignee;
      let result = [];
      for (const item of assignee) {
        result.push({
          mobile: item?.value,
          nickname: item?.label,
        });
      }
      _result.assignee = result;
    }

    if (_result.follower) {
      let follower = _result.follower;
      let result = [];
      for (const item of follower) {
        result.push({
          mobile: item?.value,
          nickname: item?.label,
        });
      }
      _result.follower = result;
    }

    let result: TaskInterface = _result as TaskInterface;

    if (formInitData) {
      Object.assign(formInitData, result);
    }

    taskStore.preUpdateTask(formInitData);
    setOpenDetail(false);
  };

  return (
    <Drawer
      title="任务详情"
      placement="right"
      size={"large"}
      onClose={() => {
        setOpenDetail(false);
      }}
      open={openDetail}
    >
      <div>
        <Form
          form={form}
          labelAlign={"left"}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          initialValues={formInitData}
          onFinish={onFinish}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="负责人" name="assignee">
            <SelectCreator name="assignee"></SelectCreator>
          </Form.Item>

          <Form.Item name="start_date" label="开始时间">
            <DatePicker
              showTime
              showNow
              showToday
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>
          <Form.Item name="due_date" label="截止时间">
            <DatePicker
              showTime
              showNow
              showToday
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <TextArea rows={4} />
          </Form.Item>

          {(() => {
            if (!formInitData) {
              return <></>;
            }
            let sub_task = formInitData.sub_task;
            if (sub_task && sub_task.length > 0) {
              return (
                <>
                  <p>子任务</p>
                  {formInitData.sub_task.map((item: any) => {
                    return (
                      <ol>
                        <li
                          style={{ cursor: "pointer", color: "blue" }}
                          onClick={() => {
                            fatherOpen(item);
                          }}
                        >
                          {item.title}
                        </li>
                      </ol>
                    );
                  })}
                </>
              );
            }
            return <></>;
          })()}

          <Form.List initialValue={[]} name="sub_task_title" rules={[]}>
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => {
                  console.log(
                    "🚀 ~ file: TaskDetailView.tsx:230 ~ {fields.map ~ field:",
                    field
                  );
                  return (
                    <Form.Item
                      label="新建子任务"
                      required={false}
                      key={field.key}
                    >
                      <Form.Item
                        {...field}
                        validateTrigger={["onChange", "onBlur"]}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: "请输入子任务标题",
                          },
                        ]}
                        noStyle
                      >
                        <Input
                          placeholder="子任务标题"
                          style={{ width: "60%" }}
                        />
                      </Form.Item>
                      {fields.length >= 1 ? (
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          onClick={() => remove(field.name)}
                        />
                      ) : null}
                    </Form.Item>
                  );
                })}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: "60%" }}
                    icon={<PlusOutlined />}
                  >
                    添加子任务
                  </Button>

                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>

          <p>评论:</p>

          <List
            size="small"
            bordered
            dataSource={(formInitData && formInitData.comment) ?? []}
            renderItem={(item: any) => (
              <List.Item>{item.description}</List.Item>
            )}
          />

          <br></br>

          <Form.Item name="add_comment" label="发布评论">
            <TextArea showCount maxLength={100} placeholder="输入评论" />
          </Form.Item>

          <Form.Item label="关注人" name="follower">
            <SelectCreator name="follower"></SelectCreator>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            &nbsp;&nbsp;
            <Button danger onClick={onDelete}>
              删除
            </Button>
            &nbsp;&nbsp;
            <Button onClick={onComplete}>完成</Button>
          </Form.Item>
        </Form>
      </div>
    </Drawer>
  );
}

export default observer(TaskDetailView);
