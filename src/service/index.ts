import request from "../utils/request";

// 创建二维码
export const createQRCode = (uuid: string) =>
  request.get(`/api/user/public/connect/qrcode/${uuid}`);
// 获取扫码结果
// /api/user/public/connect/qrconnect?uuid=256f589d-292a-4418-33f9-1d4cb57bf83a
export const getQRCode = (uuid: string) =>
  request.get(`/api/user/public/connect/qrconnect?uuid=${uuid}`);
// /api/uc/public/v2new/account/login
export const uccLogin = (data: any) =>
  request.post("/api/uc/public/v2new/account/login", {
    isSendMessage: "1",
    client_secret: "f8a24f83bce48f6446f06b9095fd6c12",
    client_id: "1470305119391260673",
    authLoginDevice: "0",
    auth_type: "qr",
    ...data,
  });

export const imLogin = (data: any) =>
  request.post("/api/im/v1/login", {
    ...data,
  });

  