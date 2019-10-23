export interface Task {
  _id?: string;
  resourceType: TaskResourceType;
  resourceUrl: string;
  steps: TaskStep[];
  status: TaskStatus;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * 资源类型
 */
export enum TaskResourceType {
  /**
   * git 资源类型
   */
  git,
  /**
   *  tar 压缩类型
   */
  gz
}

/**
 * 任务状态
 */
export enum TaskStatus {
  /**
   * 创建的状态
   */
  created = "created",
  /**
   * 工作的状态
   */
  working = "working",
  /**
   * 执行成功的状态
   */
  completed = "completed",
  /**
   * 执行失败的状态
   */
  failed = "failed"
}

/**
 * 任务步骤
 */
export interface TaskStep {
  /**
   * 任务名称
   */
  name: string;
  /**
   * 命令
   */
  commands: string[];

  message: Message;
  /**
   * 环境参数
   */
  envs: any;
}

export class Message {
  taskId: string;
  body: string;
  /**
   * 消息时间 yyyy-MM-dd HH:mm:ss
   */
  time: string;
  /**
   * 消息输出类型
   */
  stdType: StdType;
}

export enum StdType {
  out,
  err
}
