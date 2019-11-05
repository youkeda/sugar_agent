import fs from "fs";
import path from "path";
import os from "os";
import { AgentStatus, Agent } from "../models/Agent";
import { isEmpty } from "lodash";
import { networkInterface as net, hostname } from "../util/Local";




let _status: AgentStatus = AgentStatus.waiting;

export const saveAgentStatus = (status: AgentStatus) => {
  _status = status;
};


/**
 * 更新状态
 */
function syncStatus(socketIo: SocketIOClient.Socket) {
  if (socketIo.connected) {
    socketIo.emit("register", {
      status: _status,
      sid: socketIo.id
    });
  }
  //每隔3分钟触发一次更新行为，确保agent状态是同步的
  setTimeout(() => {
    syncStatus(socketIo);
  }, 18000);
}


export const register = function(
  socketIo: SocketIOClient.Socket
) {
  const agent = new Agent();
  agent.ip = net.address;
  agent.mac = net.mac;
  agent.hostname = hostname;
  agent.status = _status;
  agent.sid = socketIo.id;
  console.log("register", agent);
  socketIo.emit("register", agent);
  setTimeout(() => {
    syncStatus(socketIo);
  }, 1000);
};
