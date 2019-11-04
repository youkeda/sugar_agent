import io from "socket.io-client";
import { SUGAR_URI } from "./util/secrets";
import { Task, TaskStatus } from "./models/Task";
import { Agent, AgentStatus } from "./models/Agent";
import { networkInterface as net, hostname } from "./util/Local";

import logger from "./util/logger";
import { taskService } from "./api/TaskService";
import { getAgentStatus } from "./api/AgentService";


const socketIo = io(`${SUGAR_URI}/agent`);
const browserIo = io(`${SUGAR_URI}/browser`);

function onTask(task: Task) {
  taskService.run(task, socketIo, browserIo);
}


/**
 * 更新状态
 */
function update() {
  if (socketIo.connected) {
    socketIo.emit("register", {
      mac: net.mac,
      status: getAgentStatus(),
      sid: socketIo.id
    });
  }
  setTimeout(() => {
    update();
  }, 3000);
}

function register(status: AgentStatus) {
  const agent = new Agent();
  agent.ip = net.address;
  agent.mac = net.mac;
  agent.hostname = hostname;
  agent.status = status;
  agent.sid = socketIo.id;
  console.log("register", agent);
  socketIo.emit("register", agent);

  setTimeout(() => {
    update();
  }, 3000);
}

function onRegister(isSuccess: any) {
  //接收服务器的注册任务
  console.log(isSuccess);
  register(AgentStatus.waiting);
}

async function init() {
  socketIo.on("connect", function() {
    console.log("agent connect to", SUGAR_URI);
  });
  socketIo.on("task", onTask);
  socketIo.on("onRegister", onRegister);

  socketIo.on("disconnect", function() {
    console.log("disconnected");
  });

  browserIo.on("connect", function() {
    console.log("browserIo connected");
  });
}

init().then(() => {
  console.log("agent started");
});
