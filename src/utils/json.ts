// json parse
export const jsonParse = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    // console.error("JSON parse error", e);
    return null;
  }
};

export const jsonStringify = (obj) => {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    // console.error("JSON stringify error", e);
    return null;
  }
};
