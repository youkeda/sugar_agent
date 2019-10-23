import fs from "fs";
import path from "path";
import os from "os";
import { AgentStatus } from "../models/Agent";
import { Task, TaskStatus } from "../models/Task";
import { isEmpty } from "lodash";
import { spawn, exec, execFile } from "child_process";

class TaskService {
  task: Task;

  _sugarFile: string;

  constructor() {
    this._sugarFile = path.join(os.homedir(), ".sugar");
    if (fs.existsSync(this._sugarFile)) {
      const content = fs.readFileSync(this._sugarFile, "utf8");
      this.task = JSON.parse(content);
    }
  }

  _save = (task: Task): void => {
    this.task = task;
    fs.writeFileSync(this._sugarFile, JSON.stringify(task), "utf-8");
  };

  getAgentStatus = (): AgentStatus => {
    if (!isEmpty(this.task)) {
      if (
        this.task.status == TaskStatus.completed ||
        this.task.status == TaskStatus.failed
      ) {
        return AgentStatus.waiting;
      } else {
        return AgentStatus.working;
      }
    } else {
      return AgentStatus.waiting;
    }
  };
  /**
   *  export J=xxx
   *  echo J
   */
  run = (task: Task): void => {
    const ls = exec(
      "sh ~/test.sh ",
      { encoding: "utf-8", maxBuffer: 2048 * 2048 } /*options, [optional]*/,
      (err, stdout, stderr) => {
        if (err) {
          // console.error(err);
        }
        //console.log("aaa:",stdout);
      }
    );
    let line = "";
    ls.stdout.on("data", function(data) {
      line += data;
      
      if (data == "\n") {
          process.stdout.write(line);
        line = "";
      }
    });

    ls.stderr.on("data", function(data) {
      console.log("stderr: " + data);
    });

    ls.on("exit", function(code) {
      console.log("child process exited with code " + code);
    });

    this._save(task);
  };
}

export const taskService = new TaskService();
