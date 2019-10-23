import fs from "fs";
import path from "path";
import os from "os";
import { AgentStatus } from "../models/Agent";
import { Task, TaskStatus } from "../models/Task";
import { isEmpty } from "lodash";
import { spawn, exec, execFile } from "child_process";
import moment from "moment";

import { saveAgentStatus, getAgentStatus } from "./AgentService";

class TaskService {
  task: Task;

  run = async (task: Task, socket: SocketIOClient.Socket) => {
    console.log("start task:");
    this.task = task;
    saveAgentStatus(AgentStatus.working);
    socket.emit("task", { ...task, status: TaskStatus.working });

    for (let i = 0; i < task.steps.length; i++) {
      const step = task.steps[i];

      const shfile = `/tmp/${task._id}.sh`;
      let command = "echo $ ${shfile}";
      for (let j = 0; j < step.commands.length; j++) {
        command += `echo \$ ${step.commands[j]}\n${step.commands[j]}\n`;
      }
      //const command = step.commands.join("\n");
      fs.writeFileSync(shfile, command, "utf-8");
      const result = await this.runCommand(`sh ${shfile}`);
      if (!result) {
        task.status = TaskStatus.failed;
        socket.emit("task", { ...task, status: TaskStatus.failed });
        break;
      }
    }
    socket.emit("task", { ...task, status: TaskStatus.completed });

    saveAgentStatus(AgentStatus.waiting);
  };

  runCommand = (command: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      console.log(command);
      let line = "";
      const ls = exec(
        command,
        { encoding: "utf-8", maxBuffer: 2048 * 100000 },
        (err, stdout, stderr) => {
          if (err || stderr) {
            resolve(false);
            return;
          }
          resolve(true);
        }
      );

      const handler = (data: string) => {
        if (line == "") {
          //line += moment().format("YYYY-MM-DD hh:mm:ss") + " ";
        }
        line += data;
        if (data.endsWith("\n") || data.endsWith("\r")) {
          process.stdout.write(line);
          line = "";
        }
      };
      ls.stdout.on("data", handler);
      ls.stderr.on("data", handler);
    });
  };
}

export const taskService = new TaskService();
