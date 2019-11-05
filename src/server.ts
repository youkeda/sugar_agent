import io from "socket.io-client";
import { SUGAR_URI } from "./util/secrets";
import { Task } from "./models/Task";
import { taskService } from "./service/TaskService";
import { register } from "./service/AgentService";
import fs from "fs";
import os from "os";
import path from "path";

const socketIo = io(`${SUGAR_URI}/agent`);
const browserIo = io(`${SUGAR_URI}/browser`);

function onTask(task: Task) {
  taskService.run(task, socketIo, browserIo);
}

function onConnected() {
  console.log("agent connect to", SUGAR_URI);

  register(socketIo);
  //记录上一次的id，如果上一次ID和当前不同，触发删除逻辑
  const lastIdPath = path.join(os.homedir(), ".lastsid");
  let lastSid = "";
  if (fs.existsSync(lastIdPath)) {
    lastSid = fs.readFileSync(lastIdPath, { encoding: "utf-8" });
  }
  if (lastSid && socketIo.id !== lastSid) {
    //执行删除上一个ID行为
    socketIo.emit("remove", lastSid);
  }
  lastSid = socketIo.id;
  fs.writeFileSync(lastIdPath, lastSid, { encoding: "utf-8" });
}

/**
 * 程序主入口
 */
async function main() {
  socketIo.on("connect", onConnected);
  socketIo.on("task", onTask);
  socketIo.on("disconnect", function() {
    //console.log("disconnected");
  });
  browserIo.on("connect", function() {
    //console.log("browserIo connected");
  });
}

main().then(() => {
  console.log("agent started");
});
