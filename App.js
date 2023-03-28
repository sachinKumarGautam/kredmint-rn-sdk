import { StyleSheet, View, Text, Button, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import WebOpen from "./src/screen/WebOpen";

const App = (props) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebOpen
        username={props?.username}
        page={props?.page} // profile & payment
        environments={props?.environments} // sandbox & production
        source={"BNPL"}
        invoiceNumber={props?.invoiceNumber}
        paymentDate={props?.paymentDate}
        amount={props?.amount}
      />

      {/*
      <WebOpen
        username={"7017370753"}
        page={"profile"} // profile & payment
        environments={"sandbox"} // sandbox & production
        source={"BNPL"}
        invoiceNumber={"123431"}
        paymentDate={1671129000000}
        amount={11223}
      />
    */}
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({});
