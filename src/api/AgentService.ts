import fs from "fs";
import path from "path";
import os from "os";
import { AgentStatus } from "../models/Agent";
import { isEmpty } from "lodash";
import { networkInterface as net } from "../util/Local";

const _workspace = path.join(os.homedir(), ".sugar");

if (!fs.existsSync(_workspace)) {
  fs.mkdirSync(_workspace);
}

export const workspace = _workspace;

const _agent: any = {};

export const saveAgentStatus = (status: AgentStatus) => {
  _agent.status = status;
  //fs.writeFileSync(_sugarFile, JSON.stringify(_agent), "utf-8");
};

export const getAgentStatus = () => {
  if (_agent.status) {
    return _agent.status;
  }
  return _agent.status || AgentStatus.waiting;
};
