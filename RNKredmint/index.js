import { StyleSheet, View, Text, Button, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import WebOpen from "./src/screen/WebOpen";

const RnKredmint = (props) => {
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
    </SafeAreaView>
  );
};

export default RnKredmint;

const styles = StyleSheet.create({});
