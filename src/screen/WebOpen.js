import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import { getProfileUrl, getPaymentUrl, enachApi } from "../Api/Api";
import AsyncUtils from "../../utils/asyncUtils";
import Enach from "../DigioSdk/Enach";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getKeyValue_ = (key, arr) => {
  const ans = arr.reduce((acc, curr) => {
    if (Object.keys(curr)[0] == key) {
      acc = Object.values(curr)[0];
    }
    return acc;
  }, undefined);

  return ans;
};
const getUrlParamsArray_ = (str) => {
  if (str.includes("?") == false) {
    return false;
  } else {
    const arr = str.split("?");
    const newArr = arr[1].split("&");
    const ans = newArr.map((s) => {
      const st = s.split("=");
      return {
        [st[0]]: st[1],
      };
    });
    return ans;
  }
};

const WebOpen = (props) => {
  const [url, setUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [loading, setLoading] = useState(false);

  const [showEnach, setShowEnach] = useState(false);
  const [digioUrl, setDigioUrl] = useState("");

  useEffect(() => {
    if (props?.page == "profile") {
      fetchProfileUrl();
    } else if (props?.page == "payment") {
      fetchPaymentUrl();
    }
  }, []);

  const fetchProfileUrl = async () => {
    const sendData = [props?.username, props?.source, props?.environments];

    try {
      setUrl("");
      const res = await getProfileUrl(...sendData);

      setUrl(res.data.payload.landingUrl);

      const queryString = res.data.payload.landingUrl;

      const requiredArr = getUrlParamsArray_(queryString);

      let obj = {};
      if (requiredArr != false) {
        if (queryString.includes("authscreen")) {
          const sid = getKeyValue_("sid", requiredArr);
          const token = getKeyValue_("token", requiredArr);
          const userId = getKeyValue_("userId", requiredArr);
          const mobile = getKeyValue_("mobile", requiredArr);
          const clientToken = getKeyValue_("clientToken", requiredArr);
          const partnerId = getKeyValue_("partnerId", requiredArr);

          obj = {
            sid: sid,
            token: token,
            userId: userId,
            mobile: mobile,
            clientToken: clientToken,
            partnerId: partnerId,
          };
        }

        await AsyncUtils._storeAsyncData(
          AsyncUtils.AsyncKeysData.bnplToken,
          obj.token
        );
        await AsyncUtils._storeAsyncData(AsyncUtils.AsyncKeysData.sid, obj.sid);
        await AsyncUtils._storeAsyncData(
          AsyncUtils.AsyncKeysData.userId,
          obj.userId
        );
        await AsyncUtils._storeAsyncData(
          AsyncUtils.AsyncKeysData.mobile,
          obj.mobile
        );
        await AsyncUtils._storeAsyncData(
          AsyncUtils.AsyncKeysData.clientToken,
          obj.clientToken
        );
        await AsyncUtils._storeAsyncData(
          AsyncUtils.AsyncKeysData.partnerId,
          obj.partnerId
        );
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.errorMessage || "Something Went Wrong");
    }
  };

  const fetchPaymentUrl = async () => {
    const sendData = [
      props?.username,
      props?.source,
      props?.invoiceNumber,
      props?.paymentDate,
      props?.amount,
      props?.environments,
    ];
    try {
      setUrl("");
      const res = await getPaymentUrl(...sendData);
      setUrl(res.data.payload.landingUrl);
    } catch (err) {
      setErrorMsg(err.response?.data?.errorMessage || "Something Went Wrong");
    }
  };

  const onMessage = (event) => {
    let data = event.nativeEvent.data;
  };

  const onNavigationStateChange = async (data) => {
    const allKeys = await AsyncStorage.getAllKeys();
    const bnplToken = await AsyncUtils._retriveAsyncData(
      AsyncUtils.AsyncKeysData.bnplToken
    );

    console.log("data", data.url, data.title);

    if (data.title == "ENachScreen") {
      const requiredArr = getUrlParamsArray(data.url);
      let enachPageUrl = "";

      if (requiredArr != false) {
        if (data.url.includes("enachPageUrl=")) {
          enachPageUrl = getKeyValue("enachPageUrl", requiredArr);
        }
      }
      var str = enachPageUrl;
      var obj = {
        "%3A": ":",
        "%2F": "/",
        "%23": "#",
      };
      const regx = /%3A|%2F|%23/g;
      const ans = str.replace(regx, (matched) => obj[matched]);

      setDigioUrl(ans);
      setShowEnach(true);
    } else {
      setShowEnach(false);
      setDigioUrl("");
    }
  };

  const getKeyValue = (key, arr) => {
    const ans = arr.reduce((acc, curr) => {
      if (Object.keys(curr)[0] == key) {
        acc = Object.values(curr)[0];
      }
      return acc;
    }, undefined);

    return ans;
  };

  const getUrlParamsArray = (str) => {
    if (str.includes("?") == false) {
      return false;
    } else {
      const arr = str.split("?");
      const newArr = arr[1].split("&");
      const ans = newArr.map((s) => {
        const st = s.split("=");
        return {
          [st[0]]: st[1],
        };
      });
      return ans;
    }
  };

  const updateStatus = (data) => {
    if (data.status == "success") {
      //setShowEnach(false);

      updateData(data);
    }
  };

  const updateData = async (data) => {
    const bnplUserId = await AsyncUtils._retriveAsyncData(
      AsyncUtils.AsyncKeysData.userId
    );
    const bnplSid = await AsyncUtils._retriveAsyncData(
      AsyncUtils.AsyncKeysData.sid
    );
    const URLdata = digioUrl.split("/");
    const options = {
      sid: bnplSid,
      documentId: URLdata[5].startsWith("ENA") ? URLdata[5] : null,
      digio_ref_id: data?.digio_doc_id,
      message:
        data?.message == "Process%20completed." ? "Process completed" : "",
      txn_id: "",
      status: "SUCCESS",
      userId: bnplUserId,
      environments: props?.environments,
    };

    try {
      setLoading(true);

      const res = await enachApi(options);

      setShowEnach(false);
      setLoading(false);
      // redirectScreen();
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {url ? (
        <View style={{ flex: 1 }}>
          {!showEnach ? (
            <View style={{ flex: 1 }}>
              <WebView
                source={{ uri: url }}
                allowFileAccess={true}
                geolocationEnabled={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onMessage={onMessage}
                onError={(e) => {
                  console.warn("error occured digi webview", e);
                }}
                onNavigationStateChange={(data) =>
                  onNavigationStateChange(data)
                }
              />
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <Enach
                customUrl={digioUrl}
                enachData={(data) => {
                  updateStatus(data);
                }}
              />
            </View>
          )}
        </View>
      ) : null}
      {errorMsg ? (
        <Text style={{ textAlign: "center" }}>{errorMsg}</Text>
      ) : null}
    </SafeAreaView>
  );
};

export default WebOpen;

const styles = StyleSheet.create({});
