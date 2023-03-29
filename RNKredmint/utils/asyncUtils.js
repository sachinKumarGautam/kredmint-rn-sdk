import AsyncStorage from "@react-native-async-storage/async-storage";

function isJSON(str) {
  try {
    return JSON.parse(str) && !!str;
  } catch (e) {
    return false;
  }
}

class AsyncUtils {
  static AsyncKeysData = {
    bnplToken: "@bnplToken",
    clientToken: "@clientToken",
    sid: "@sid",
    userId: "@userId",
    partnerId: "@partnerId",
    mobile: "@mobile",
    productType: "@productType",
    kfsUrl: "@kfsurl",
    esignUrl: "@esignurl",
    enachUrl: "@enachurl",
  };

  static _storeAsyncData = async (storageKey, value) => {
    try {
      const jsonValue =
        typeof value === "string" ? value : JSON.stringify(value);
      await AsyncStorage.setItem(storageKey, jsonValue);

      return { msg: `Saving successful` };
    } catch (error) {
      //console.log(error);
      return { error: true, msg: `Saving failed` };
    }
  };
  static _retriveAsyncData = async (storageKey) => {
    try {
      const jsonValue = await AsyncStorage.getItem(storageKey);
      // return jsonValue;

      if (isJSON(jsonValue)) {
        return jsonValue !== null ? JSON.parse(jsonValue) : null;
      } else {
        return jsonValue !== null ? jsonValue : null;
      }

      // const ans = jsonValue !== null ? JSON.parse(jsonValue) : null;
      // return ans;
    } catch (error) {
      // error reading value
      console.log(error);
    }
  };
  static _removeAsyncData = async (storageKey) => {
    try {
      await AsyncStorage.removeItem(storageKey);
      return { msg: `Removing successful` };
    } catch (error) {
      //console.log(error);
      return { error: true, msg: `Removing failed` };
    }
  };
  static _clearAsyncData = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console("Failed to clear the async storage.", e);
    }
  };
}

export default AsyncUtils;
