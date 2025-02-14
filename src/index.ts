import * as api from "./service";
import { guidV4 } from "./utils/user";
import * as QRCode from "qrcode";
import { setUser, getUser } from "./utils/user";
import { jsonParse, jsonStringify } from "./utils/json";
import { EventEmitter } from "events";
import * as wfc from "@vv/node-wfc";
import { continueConversation } from "./utils/ai";
import * as dayjs from "dayjs";

wfc.setAppName("vv-chat");

wfc.setUserDataPath("./.wfc");

wfc.setAppDataPath("./.data");

wfc.eventEmitter = new EventEmitter();

// const timer = setInterval(() => {
//   try {
//     continueConversation('hello');
//   } catch (error) {
//     console.error(error);
// }
// }, 3000);

wfc.setReceiveMessageListener(
  onMessage,
  onMessage,
  onMessage,
  onMessage,
  onMessage
);

const uccLogin = async (token) => {
  try {
    const res: any = await api.uccLogin({
      password: token,
    });
    if (res.code !== 10000) {
      throw new Error(res.msg);
    }

    await setUser(res.data);
    imLogin(res.data);
    console.log("UCC登录成功");
  } catch (error) {
    console.error(error);
  }
};

const imLogin = async (data) => {
  try {
    const res: any = await api.imLogin({
      displayName: data.name,
      userCode: data.userCode,
      mobile: data.mobile,
      email: data.email,
      clientId: wfc.getClientId(),
      platform: 4,
      deviceName: "mac",
    });
    console.log("IM登录成功");
    const { userId, token, routeIp } = res.data;

    wfc.connect(userId, token, routeIp);
  } catch (error) {
    console.error(error);
  }
};

let timer = null;
const start = async () => {
  const uuid = guidV4();

  // console.log(wfc.getConnectionStatus(), getUser());

  try {
    const res = await api.createQRCode(uuid);
    const url = res.data + "&device=pc";

    QRCode.toString(
      url,
      { type: "terminal", width: 400, height: 400 },
      (error, url) => {
        if (error) throw error;
        console.log(url);
      }
    );
  } catch (error) {
    console.log(error);
  }

  timer = setInterval(async () => {
    try {
      const res = await api.getQRCode(uuid);
      if (res.data.code === 405) {
        clearInterval(timer);
        uccLogin(res.data.ext);
      } else if ([406].includes(res.data.code)) {
        clearInterval(timer);
        start();
      }
      // console.log("扫码结果: ", res.data);
    } catch (error) {
      console.error(error);
    }
  }, 1000);
};

start();

async function onMessage(e: any) {
  try {
    if (wfc.getConnectionStatus() !== 1) {
      return;
    }
    clearInterval(timer);
    const data = jsonParse(e)?.[0];
    const currentUser = await getUser();
    if (
      !data ||
      data.from === currentUser.userCode ||
      data.content.type !== 1
    ) {
      return;
    }

    const msg = {
      type: 1,
      searchableContent:'',
      pushContent: "",
      content: "",
      binaryContent: "",
      localContent: "",
      mediaType: 0,
      remoteMediaUrl: "",
      localMediaPath: "",
      mentionedType: 0,
      mentionedTargets: [],
    }

    const isAt = data.content?.searchableContent?.includes("@DeepSeek");
    if(data.content?.searchableContent==='打卡'){
      msg.searchableContent = `您已打卡成功，打卡时间：${new Date().toLocaleString()}，打卡地点：百环大厦，打卡备注：无`;
    }else{
      const result = await continueConversation(
        data.content?.searchableContent?.replace("@DeepSeek ", "")
      );
      msg.searchableContent = result;
    }


    
   
    wfc.sendMessage(
      jsonStringify(data.conversation),
      jsonStringify(msg),
      [],
      0,
      (e) => {
        console.log(e);
      },
      (e) => {
        console.log(e);
      },
      (e) => {
        console.log(e);
      },
      (error) => {
        console.log(error);
      }
    );
  } catch (error) {
    console.error(error);
  }
}

console.log(`应用启动成功, 等待扫码`);
