import fs from "fs";
import path from "path";
import os from "os";
import { AgentStatus } from "../models/Agent";
import { isEmpty } from "lodash";

const _sugarFile = path.join(os.homedir(), ".sugar");
const _agent: any = {};

export const saveAgentStatus = (status: AgentStatus) => {
  _agent.status = status;
  fs.writeFileSync(_sugarFile, JSON.stringify(_agent), "utf-8");
};

export const getAgentStatus = () => {
  if (_agent.status) {
    return _agent.status;
  }

  if (fs.existsSync(_sugarFile)) {
    const content = fs.readFileSync(_sugarFile, "utf8");
    const json = JSON.parse(content);
    for (const key in json) {
      _agent[key] = json[key];
    }
  }
  return _agent.status || AgentStatus.waiting;
};
