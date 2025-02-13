import * as os from "node:os";
import { execSync } from "child_process";
import { guidV4 } from "./user";

export enum DEVICE {
  WINDOWS = "windows",
  MACOS = "mac",
  UNKNOWN = "unknown",
}

export interface DeviceInfo {
  deviceName: string;
  deviceNo: string;
  deviceVersion: string;
  deviceModel: DEVICE;
}

export function getDeviceInfo(): DeviceInfo {
  const deviceInfo: DeviceInfo = {
    deviceName: "",
    deviceNo: guidV4(),
    deviceVersion: os.version(),
    deviceModel: DEVICE.UNKNOWN,
  };

  switch (process.platform) {
    case "win32": {
      deviceInfo.deviceName = encodeURI(process.env.COMPUTERNAME!);
      deviceInfo.deviceModel = DEVICE.WINDOWS;
      break;
    }
    case "darwin": {
      deviceInfo.deviceName = encodeURI(
        execSync("scutil --get ComputerName").toString().trim()
      );
      deviceInfo.deviceModel = DEVICE.MACOS;
      break;
    }
    default: {
      deviceInfo.deviceName = encodeURI(os.hostname());
    }
  }

  return deviceInfo;
}
