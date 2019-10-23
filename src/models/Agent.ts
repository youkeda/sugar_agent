export class Agent {
  ip: string;
  hostname: string;
  mac: string;
  status: AgentStatus;
  /**
   * socket ID
   */
  sid: string;
}

export enum AgentStatus {
  creating="creating",
  working = "working",
  waiting = "waiting",
  offline = "offline"
}
