"use client"
import React from "react";
import { getValidVegaSpec } from "../utils";
import ReactVega from "./ReactVega";
// import ReactEcharts from "echarts-for-react"
import { ReactEChart } from "./ReactEchart";

const VizChat = ({ messages, dataset }) => {
  return (
    <div
      className="border-2 border-zinc-100 dark:border-zinc-800 overflow-y-auto w-full bg-red400"
      style={{ maxHeight: "80vh" }}
    >
      {messages?.map((message, idx) => {
        if (message.role === "assistant") {
          const spec = getValidVegaSpec(message.content);
        //   const spec = {
        //     "tooltip": {
        //         "trigger": "axis",
        //         "axisPointer": {
        //             "type": "shadow"
        //         }
        //     },
        //     "grid": {
        //         "left": "3%",
        //         "right": "4%",
        //         "bottom": "3%",
        //         "containLabel": true
        //     },
        //     "xAxis": {
        //         "type": "value"
        //     },
        //     "yAxis": {
        //         "type": "category",
        //         "data": [
        //             "Country or Area"
        //         ]
        //     },
        //     "series": [
        //         {
        //             "name": "Value",
        //             "type": "bar",
        //             "data": [
        //                 {
        //                     "value": 123456,
        //                     "name": "Country A"
        //                 },
        //                 {
        //                     "value": 98765,
        //                     "name": "Country B"
        //                 },
        //                 {
        //                     "value": 87654,
        //                     "name": "Country C"
        //                 },
        //                 {
        //                     "value": 76543,
        //                     "name": "Country D"
        //                 },
        //                 {
        //                     "value": 65432,
        //                     "name": "Country E"
        //                 },
        //                 {
        //                     "value": 54321,
        //                     "name": "Country F"
        //                 },
        //                 {
        //                     "value": 43210,
        //                     "name": "Country G"
        //                 },
        //                 {
        //                     "value": 32109,
        //                     "name": "Country H"
        //                 },
        //                 {
        //                     "value": 21098,
        //                     "name": "Country I"
        //                 },
        //                 {
        //                     "value": 10987,
        //                     "name": "Country J"
        //                 }
        //             ]
        //         }
        //     ]
        // }

          if (spec) {
            return (
              <div className="w-full">
                <div className="grow pl-8">
                  <ReactVega spec={spec} data={dataset?.dataSource ?? []} />
                  {/* <ReactEChart  data={dataset?.dataSource ?? []} option={spec.option} fields={dataset?.fields} /> */}
                </div>
              </div>
            );
          } else {
            return (
              <div className="border-b flex- flex-col border-white">
                {
                  JSON.stringify(message.content)
                }
              </div>
            )
          }
        }
      })}
      
      {/* <ReactEChart option={{}} data={dataset?.dataSource ?? []} fields={dataset?.fields ?? []} /> */}
    </div>
  );
};

export default VizChat;
