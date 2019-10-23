import io from "socket.io-client";
import { SUGAR_URI } from "./util/secrets";
import { Task } from "./models/Task";
import { Agent, AgentStatus } from "./models/Agent";
import { networkInterface as net, hostname } from "./util/Local";

import logger from "./util/logger";
import { taskService } from "./api/TaskService";

const socket = io(SUGAR_URI);

function onTask(task: Task) {
  console.log(task);
}

function register() {
  const agent = new Agent();
  agent.ip = net.address;
  agent.mac = net.mac;
  agent.hostname = hostname;
  agent.status = taskService.getAgentStatus();
  agent.sid = socket.id;
  //logger.debug(taskService);
  socket.emit("register", agent);
}

function onRegister(isSuccess: any) {
  //接收服务器的注册任务
  register();
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

  taskService.run({});
}

init().then(() => {
  console.log("agent started");
});
