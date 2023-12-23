import { TaskInterface } from "../entities/task.entity";
import { UserInterface } from "../entities/user.entity";

export function getLoginUser(): UserInterface {
  const _userString = localStorage.getItem("user") as string;
  const _user = JSON.parse(_userString) as UserInterface;
  return _user;
}
/**
 * Generates a new key for each task in an array of tasks and its sub-tasks.
 *
 * @param {TaskInterface[]} tasks - The array of tasks.
 * @param {string} preKey - The prefix for the key.
 * @return {TaskInterface[]} - The modified array of tasks with updated keys.
 */
export function addTasksKey(
  tasks: TaskInterface[],
  preKey: string
): TaskInterface[] {
  if (tasks && tasks.length > 0) {
    for (let i = 0; i < tasks.length; i++) {
      const task: TaskInterface = tasks[i];
      if (task.title === "三级任务") {
        task.sub_task = [];
      }
      task.key = `${preKey}-${i}`;

      if (task.sub_task && task.sub_task.length > 0) {
        addTasksKey(task.sub_task, task.key);
      }
    }
  }
  return tasks;
}

export function treeReplace(
  source: TaskInterface[] | undefined,
  indexs: string[],
  target: TaskInterface
) {
  if (source == undefined) {
    return;
  }
  if (source[Number(indexs[0])].UUID === target.UUID) {
    source[Number(indexs[0])] = target;
  }

  let _index = indexs.slice(1, indexs.length);

  if (source[Number(indexs[0])].sub_task) {
    treeReplace(source[Number(indexs[0])].sub_task, _index, target);
  }
}

export function treeForeach(tree: TaskInterface[], func: Function) {
  tree.forEach((data) => {
    func(data);
    data.sub_task && treeForeach(data.sub_task, func); // 遍历子树
  });
}

export function treeToList(tree: any, result: any[] = [], level = 0) {
  tree.forEach((node: any) => {
    result.push(node);
    node.level = level + 1;
    node.sub_task && treeToList(node.sub_task, result, level + 1);
    node.sub_task = [];
  });
  return result;
}

export function listToTree(list: any[], task: TaskInterface) {
  let maxLevel = 0;

  let allMap: Map<string, any> = new Map();

  for (let i = 0; i < list.length; i++) {
    let item = list[i];
    if (item.level > maxLevel) {
      maxLevel = item.level;
    }
    allMap.set(item.key, item);
  }

  if (maxLevel >= 1) {
    loopMap(list, allMap, maxLevel);
  }

  if (task.key) {
    let key = task.key;
    if (key.length > 2) {
      key = task.key.slice(0, 2);
    }

    let resultTask = allMap.get(key);
    return resultTask;
  }

  return task;
}

function loopMap(list: any[], allMap: Map<string, any>, maxLevel: number) {
  for (let index = 0; index < list.length; index++) {
    let element = list[index];
    if (element.level === maxLevel) {
      // list = list.splice(index, 1);
      list = list.filter((value: any, i: number) => {
        if (index !== i) {
          return value;
        }
      });

      if (element.key.length > 2) {
        let sub_task = allMap.get(element.key);
        allMap.delete(element.key);
        let key = sub_task.key.slice(0, sub_task.key.length - 2);

        let fatherTask = allMap.get(key);

        if (fatherTask) {
          if (!fatherTask.sub_task) {
            fatherTask.sub_task = [];
          }
          fatherTask.sub_task.push(sub_task);

          //去重
          const obj: Map<string, any> = new Map();
          fatherTask.sub_task.reduce((item: any, next: any) => {
            if (!obj.get(next.UUID)) {
              item.push(next);
              obj.set(next.UUID, next);
            } else {
              obj.set(next.UUID, Object.assign(obj.get(next.UUID), next));
            }
            return item;
          }, []);
          let _sub_task: any[] = [];
          obj.forEach((element: any) => {
            _sub_task.push(element);
          });

          fatherTask.sub_task = _sub_task;

          //子任务完成，则主任务自动完成
          if (_sub_task.length > 0) {
            let completed = 0;
            _sub_task.forEach((element: any) => {
              if (element.status === "已完成") {
                completed++;
              }
            });
            if (completed === _sub_task.length) {
              fatherTask.status = "已完成";
            }
          }

          allMap.set(key, fatherTask);
        }
      } else {
      }

      index--;
    }
  }
  maxLevel--;
  if (maxLevel >= 1) {
    loopMap(list, allMap, maxLevel);
  }
}

export function hasSameItem(arr1: any, arr2: any) {
  return arr1.some((item: any) => {
    return arr2.some((_item: any) => {
      if (_item.value === item.mobile) {
        return true;
      }
    });
  });
}

export function dataFilter(_tasks: TaskInterface[], _filter: any) {
  _tasks = _tasks.filter((value: TaskInterface, index: number) => {
    let isReturn = true;

    /**
     * 任务状态筛选
     */
    if (_filter["status"] && _filter["status"] !== "") {
      if (value.status === _filter["status"]) {
        // return value;
      } else {
        isReturn = false;
      }
    }
    /**
     * 开始时间筛选
     */
    if (_filter["start_date"] && _filter["start_date"] !== "") {
      if (value.start_date) {
        if (new Date(value.start_date) > _filter["start_date"]) {
          // return value;
        } else {
          isReturn = false;
        }
      }
    }

    /**
     * 截止时间筛选
     */
    if (_filter["due_date"] && _filter["due_date"] !== "") {
      if (value.due_date) {
        if (new Date(value.due_date) > _filter["due_date"]) {
          // return value;
        } else {
          isReturn = false;
        }
      }
    }

    /**
     * 创建人筛选
     */
    if (_filter["creator"] && _filter["creator"].length > 0) {
      if (value.creator) {
        if (hasSameItem(value.creator, _filter["creator"])) {
        } else {
          isReturn = false;
        }
      }
    }

    /**
     * 负责人筛选
     */
    if (_filter["assignee"] && _filter["assignee"].length > 0) {
      if (value.assignee) {
        if (hasSameItem(value.assignee, _filter["assignee"])) {
        } else {
          isReturn = false;
        }
      }
    }

    /**
     * 关注者筛选
     */
    if (_filter["follower"] && _filter["follower"] !== "") {
      if (value.follower && value.follower.length > 0) {
        let _isHas = false;
        for (let index = 0; index < value.follower.length; index++) {
          const element = value.follower[index];
          if (element.mobile === _filter["follower"]) {
            _isHas = true;
            break;
          }
        }

        if (!_isHas) {
          isReturn = false;
        }
      } else {
        isReturn = false;
      }
    }

    if (value.sub_task) {
      value.sub_task = dataFilter(value.sub_task, _filter);
    }

    if (isReturn) {
      return value;
    }
  });
  return _tasks;
}
