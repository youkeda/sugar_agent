import os, { NetworkInterfaceInfo } from "os";
import cp from "child_process";

const getNetworkInterface = function(): NetworkInterfaceInfo | null {
  const networkInterfaces = os.networkInterfaces();
  for (const dev in networkInterfaces) {
    const item = networkInterfaces[dev];
    for (let i = 0; i < item.length; i++) {
      const details = item[i];
      if (details.family == "IPv4") {
        if (details.address != "127.0.0.1") {
          return details;
        }
      }
    }
  }
  return null;
};
export const networkInterface = getNetworkInterface();

const getHostName = function() {
  switch (process.platform) {
    case "win32":
      return process.env.COMPUTERNAME;
    case "darwin":
      return cp
        .execSync("scutil --get ComputerName")
        .toString()
        .trim();
    default:
      return os.hostname();
  }
};

export const hostname = getHostName();
