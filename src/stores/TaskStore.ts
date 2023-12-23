import { makeAutoObservable, runInAction } from "mobx";
import { TaskInterface } from "../entities/task.entity";
import { message, notification } from "antd";
import {
  fetchGetTask,
  fetchPostTask,
  fetchPutTask,
} from "../services/task.service";
import {
  addTasksKey,
  dataFilter,
  hasSameItem,
  listToTree,
  treeToList,
} from "../utils/commonUtil";

export class TaskStore {
  allTasks: TaskInterface[] = [];
  currentShowTasks: TaskInterface[] = [];

  filter: any = {};

  constructor() {
    makeAutoObservable(this);
    this.getTask();
  }

  updateFilter(filter: any) {
    this.filter = Object.assign(this.filter, filter);
    this.showTask();
  }

  async getTask() {
    const res: any = await fetchGetTask();
    if (res.data) {
      this.allTasks = res.data;
      this.showTask();
    }
  }

  filterAction() {
    let _tasks = this.allTasks;

    _tasks = dataFilter(_tasks, this.filter);

    return _tasks;
  }

  showTask() {
    runInAction(() => {
      let _tasks = this.filterAction();

      _tasks = addTasksKey(_tasks, "");
      /**
       * 遍历所有task，包括子task，给所有task添加key,是为了完成子任务时，方便索引父任务
       */
      this.currentShowTasks = _tasks;
    });
  }

  async addTask(task: TaskInterface) {
    await fetchPostTask(task);
    this.getTask();
  }

  preUpdateTask(task: TaskInterface) {
    if (task.key) {
      let key = task.key;
      if (key.length > 2) {
        key = task.key.slice(0, 2);
      }
      let _currentShowTasks = this.currentShowTasks;

      _currentShowTasks = _currentShowTasks.filter(
        (value: any, index: number) => {
          if (value.key === key) {
            return value;
          }
        }
      );

      //树转为List
      let listAll = treeToList(_currentShowTasks);

      for (let i = 0; i < listAll.length; i++) {
        let item = listAll[i];
        if (item.key === task.key) {
          listAll[i] = Object.assign(listAll[i], task);
          break;
        }
      }

      let resultTask = listToTree(listAll, task);
      this.updateTask(resultTask);
    }
  }
  async updateTask(task: TaskInterface | undefined): Promise<boolean> {
    if (task === undefined) {
      return false;
    }
    const res: any = await fetchPutTask(task.UUID, task);
    if (res.data) {
      this.allTasks = res.data;
      this.showTask();
      notification.success({
        message: ``,
        description: "更新成功",
        placement: "topRight",
      });
      return true;
    }
    notification.error({
      message: ``,
      description: "更新失败",
      placement: "topRight",
    });
    return false;
  }

  async deleteTask(task: TaskInterface) {
    if (task.key) {
      //树转为List
      let listAll = treeToList(this.currentShowTasks);

      listAll = listAll.filter((value: any, index: number) => {
        if (value.key !== task.key) {
          return value;
        }
      });

      let resultTask = listToTree(listAll, task);
      this.updateTask(resultTask);
    }
  }
  async completeTask(task: TaskInterface) {
    if (task.key) {
      //树转为List
      let listAll = treeToList(this.currentShowTasks);

      for (let i = 0; i < listAll.length; i++) {
        let item = listAll[i];
        if (item.key === task.key) {
          listAll[i].status = "已完成";
          break;
        }
      }

      let resultTask = listToTree(listAll, task);
      this.updateTask(resultTask);
    }
  }

  async workingTask(task: TaskInterface) {
    if (task.key) {
      //树转为List
      let listAll = treeToList(this.currentShowTasks);

      for (let i = 0; i < listAll.length; i++) {
        let item = listAll[i];
        if (item.key === task.key) {
          listAll[i].status = "进行中";
          break;
        }
      }

      let resultTask = listToTree(listAll, task);
      this.updateTask(resultTask);
    }
  }
}

export default new TaskStore();
