import { ProFormSelect, RequestOptionsType } from "@ant-design/pro-components";
import React from "react";
import { fetchGetUsers } from "../services/login.service";
import { UserInterface } from "../entities/user.entity";

function SelectCreator(_props: any) {
  return (
    <ProFormSelect
      name={_props.name || "teams"}
      label={_props.label}
      style={{ width: 150 }}
      request={async () => {
        const res: any = await fetchGetUsers();
        let _result: RequestOptionsType[] | PromiseLike<RequestOptionsType[]> =
          [];

        /**
           * 把所有用户组装成如下格式返回
           * [
              {
                label: 'Manager',
                options: [
                  { label: 'Jack', value: 'jack' },
                  { label: 'Lucy', value: 'lucy' },
                ],
              },
              {
                label: 'Engineer',
                options: [{ label: 'yiminghe', value: 'Yiminghe' }],
              },
            ]
           * 
           */
        if (res.data) {
          const data = res.data as Array<UserInterface>;
          let _groupMap = new Map();
          let _nonGroupList = [];

          for (const item of data) {
            if (item.teams && item.teams.length > 0) {
              for (const team of item.teams) {
                if (!_groupMap.has(team)) {
                  _groupMap.set(team, []);
                }
                let _value = _groupMap.get(team);
                _value.push({
                  label: item.nickname,
                  value: item.mobile,
                  key: `${
                    100000 + new Date().getTime() + Math.random() * 100000
                  }`,
                });
                _groupMap.set(team, _value);
              }
            } else {
              _nonGroupList.push({
                label: item.nickname,
                value: item.mobile,
                key: `${new Date().getTime() + Math.random() * 100000}`,
              });
            }
          }
          const _groupKeys = Array.from(_groupMap.keys());
          for (const key of _groupKeys) {
            _result.push({
              label: key,
              options: _groupMap.get(key),
            });
          }

          _result = [..._nonGroupList, ..._result];

          return _result;
        }
        return _result;
      }}
      onChange={_props.onChange}
      initialValue={_props.initialValues}
      placeholder=""
      fieldProps={{
        mode: "multiple",
        labelInValue: true,
      }}
    />
  );
}

export default SelectCreator;
