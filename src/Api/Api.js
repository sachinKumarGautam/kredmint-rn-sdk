import axios from "axios";
import AsyncUtils from "../../utils/asyncUtils";

const bn = "1";
const os = "webos";
const dt = "browser";

const GenerateRandomNumber = async () => {
  var navigator_info = window.navigator;
  var screen_info = window.screen;
  var uid = navigator_info.mimeTypes.length;
  uid += navigator_info.userAgent.replace(/\D+/g, "");
  uid += navigator_info.plugins.length;
  uid += screen_info.height || "";
  uid += screen_info.width || "";
  uid += screen_info.pixelDepth || "";

  var RandomNumber = new Date().valueOf();

  uid += RandomNumber;
  var value = uid;

  return value;
};

const handleError = async (response) => {
  if (response.status >= 200 && response.status <= 299) {
    const awaitedResponse = await response.json();

    if (
      (awaitedResponse && awaitedResponse.error) ||
      (awaitedResponse && awaitedResponse.errorMessage)
    ) {
      if (awaitedResponse.error == "invalid_token") {
        throw awaitedResponse.error;
      } else {
        throw awaitedResponse.errorMessage || awaitedResponse.error_description;
      }
    } else {
      return awaitedResponse;
    }
  } else {
    const data = await response.json();

    if (response.status == 401) {
      throw "invalid_token";
    } else {
      const error =
        (data && data?.errorMessage) ||
        data?.msg ||
        "Something went wrong, Please try again";
      throw error;
    }
  }
};

export const getProfileUrl = async (username, source, environments) => {
  var URL = "";
  if (environments == "production") {
    URL = "https://user.kredmint.in";
  } else {
    URL = "https://user-dev.kredmint.in";
  }

  const data = {
    username: username,
    source: source,
    page: "profile",
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic UXFwd2RaNlZiVGtOcG0wRmtYc2NDekd5ZDY6VzRwcW9YUndKN2RzeUczejh3dWd5OEJERDd2SHZy",
    },
  };
  try {
    const res = await axios.post(URL + "/user/eligibility", data, config);

    return res;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getPaymentUrl = async (
  username,
  source,
  invoiceNumber,
  paymentDate,
  amount,
  environments
) => {
  var URL = "";
  if (environments == "production") {
    URL = "https://user.kredmint.in";
  } else {
    URL = "https://user-dev.kredmint.in";
  }

  const data = {
    username: username,
    page: "payment",
    source: source,
    invoiceNumber: invoiceNumber,
    paymentDate: paymentDate,
    amount: amount,
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic UXFwd2RaNlZiVGtOcG0wRmtYc2NDekd5ZDY6VzRwcW9YUndKN2RzeUczejh3dWd5OEJERDd2SHZy",
    },
  };

  try {
    const res = await axios.post(URL + "/user/eligibility", data, config);
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const enachApi = async (data) => {
  const url = "production";
  if (data.environments == "") {
    url = `https://user.kredmint.in/user/mandate?userId=${data.userId}`;
  } else {
    url = `https://user-dev.kredmint.in/user/mandate?userId=${data.userId}`;
  }
  const randvalue = new Date().valueOf() + data.userId;

  const bnplToken = await AsyncUtils._retriveAsyncData(
    AsyncUtils.AsyncKeysData.bnplToken
  );

  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${bnplToken}`);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("did", randvalue);
  myHeaders.append("bn", bn);
  myHeaders.append("os", os);
  myHeaders.append("dt", dt);

  var raw = JSON.stringify({
    sid: data.sid,
    status: data.status,
    documentId: data.documentId,
    digioResponse: {
      digioDocId: data.digio_ref_id,
      message: data.message,
      txnId: "",
    },
  });

  var requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return new Promise((resolve, reject) => {
    fetch(url, requestOptions)
      .then(handleError)
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
