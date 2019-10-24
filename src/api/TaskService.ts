import fs from "fs";
import path from "path";
import os from "os";
import { AgentStatus } from "../models/Agent";
import { Task, TaskStatus, TaskResourceType, Message } from "../models/Task";
import { isEmpty } from "lodash";
import { spawn, exec, execSync } from "child_process";
import moment from "moment";

import { saveAgentStatus, workspace as root } from "./AgentService";

class TaskService {
  task: Task;

  run = async (task: Task, socket: SocketIOClient.Socket) => {
    console.log("start task:");
    this.task = task;
    saveAgentStatus(AgentStatus.working);
    socket.emit("task", { ...task, status: TaskStatus.working });

    const workspace = `${root}/${task._id}`;
    // 创建临时目录
    fs.mkdirSync(workspace);
    console.log(workspace);
    try {
      if (task.resourceType == TaskResourceType.gz) {
        execSync(
          `wget ${task.resourceUrl} -O project.tar.gz;mkdir project;cd project;tar -zxvf ../project.tar.gz`,
          {
            cwd: workspace
          }
        );
      } else {
        console.log(task.resourceUrl);
      }
    } catch (error) {
      saveAgentStatus(AgentStatus.waiting);
      socket.emit("task", { ...task, status: TaskStatus.failed });
      //任务执行失败，返回
      return;
    }

    console.log(workspace);

    task.status = TaskStatus.completed;
    for (let i = 0; i < task.steps.length; i++) {
      const step = task.steps[i];

      const shfile = `${workspace}/step_${i}.sh`;
      let command = "";
      for (let j = 0; j < step.commands.length; j++) {
        command += `echo \$ ${step.commands[j]}\n${step.commands[j]}\n`;
      }
      //const command = step.commands.join("\n");
      fs.writeFileSync(shfile, command, "utf-8");
      const result = await this.runCommand(task._id,workspace, `sh ${shfile}`,socket);
      if (!result) {
        task.status = TaskStatus.failed;
        break;
      }
    }
    socket.emit("task", task);
    saveAgentStatus(AgentStatus.waiting);
    exec(`rm -rf ${workspace}`, () => {
      console.log(`任务执行结束,清理 ${workspace}`);
    });
  };

  runCommand = (taskId: string,workspace: string, command: string, socket: SocketIOClient.Socket): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      console.log(command);
      let line = "";
      const ls = exec(
        command,
        {
          encoding: "utf-8",
          maxBuffer: 2048 * 100000,
          cwd: `${workspace}/project`
        },
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
          line = line.replace(`${workspace}/project`,"");
          process.stdout.write(line);
          const message = new Message();
          message.taskId = taskId;
          message.body= line;
          message.time = moment().format("YYYY-MM-DD hh:mm:ss");
          socket.emit("message",message);
          line = "";
        }
      };
      ls.stdout.on("data", handler);
      ls.stderr.on("data", handler);
    });
  };
}

export const taskService = new TaskService();
