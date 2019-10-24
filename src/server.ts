import io from "socket.io-client";
import { SUGAR_URI } from "./util/secrets";
import { Task, TaskStatus } from "./models/Task";
import { Agent, AgentStatus } from "./models/Agent";
import { networkInterface as net, hostname } from "./util/Local";

import logger from "./util/logger";
import { taskService } from "./api/TaskService";
import { getAgentStatus } from "./api/AgentService";

const socket = io(SUGAR_URI);

function onTask(task: Task) {
  taskService.run(task, socket);
}

/**
 * 更新状态
 */
function update() {
  if (socket.connected) {
    socket.emit("register", {
      mac: net.mac,
      status: getAgentStatus(),
      sid: socket.id
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
  agent.sid = socket.id;
  console.log("register", agent);
  socket.emit("register", agent);

  setTimeout(() => {
    update();
  }, 3000);
}

function onRegister(isSuccess: any) {
  //接收服务器的注册任务
  register(AgentStatus.waiting);
}

async function init() {
  socket.on("connect", function() {
    console.log("agent connect to", SUGAR_URI);
  });
  socket.on("task", onTask);
  socket.on("onRegister", onRegister);

  socket.on("disconnect", function() {
    console.log("disconnected");
  });
}

init().then(() => {
  console.log("agent started");
});
