import { ProFormSelect } from "@ant-design/pro-components";
import React from "react";

function SelectGroup() {
  return (
    <ProFormSelect
      name="teams"
      label="加入团队"
      request={async () => [
        { label: "开发1队", value: "开发1队" },
        { label: "开发2队", value: "开发2队" },
      ]}
      placeholder=""
      fieldProps={{
        mode: "multiple",
      }}
    />
  );
}

export default SelectGroup;
