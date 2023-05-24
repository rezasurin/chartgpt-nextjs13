"use client"
import React from "react";
import { getValidVegaSpec } from "../utils";
import ReactVega from "./ReactVega";

const VizChat = ({ messages, dataset }) => {
  return (
    <div
      className="border-2 border-zinc-100 dark:border-zinc-800 overflow-y-auto"
      style={{ maxHeight: "80vh" }}
    >
      {messages?.map((message, idx) => {
        if (message.role === "assistant") {
          const spec = getValidVegaSpec(message.content);

          if (spec) {
            return (
              <div>
                <div className="grow pl-8">
                  <ReactVega spec={spec} data={dataset?.dataSource ?? []} />
                </div>
              </div>
            );
          }
        }
      })}
    </div>
  );
};

export default VizChat;
