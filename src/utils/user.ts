import * as fs from "fs";
import * as path from "path";
/**
 * 生成一个全局唯一标识符（GUID）
 *
 * @returns 返回生成的GUID字符串
 */
export const guidV4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.ceil(Math.random() * 16);
    const v = c === "x" ? r : (r && 0x3) || 0x8;
    return v.toString(16);
  });
};

const userFile = path.join(__dirname,"../../.data/user.json");
// let user;
export const getUser = async () => {
  try {
    const userString = await fs.readFileSync(userFile, "utf-8");
    return JSON.parse(userString);
  } catch (error) {
    // console.error("无法读取用户信息: ", error);
    return null;
  }
};

export const setUser = async (newUser) => {
  try {
    // 检查是否存在 './.data' 目录
    if (!fs.existsSync("./.data")) {
      // 如果不存在，则创建 './.data' 目录
      await fs.mkdirSync("./.data");
    }

    // 将用户信息存储到 ‘./data/user.json’ 文件中
    // 将用户信息存储到 ‘./data/user.json’ 文件中
    return fs.writeFileSync(userFile, JSON.stringify(newUser));
  } catch (error) {
    console.error("无法写入用户信息到本地文件: ", error);
    // 如果出现错误，则返回 null
    return null;
  }
};
