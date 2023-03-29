# React Native SDK of Kredmint

## Installation

# With expo

```bash
  npm i react-native-kredmint
```

# With CLI

```bash
  npm i react-native-kredmint @react-native-async-storage/async-storage react-native-webview
```

## Usage/Examples

```javascript
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import React from "react";
import RnKredmint from "react-native-kredmint";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <RnKredmint
        username={"Number"}
        page={"profile"} // profile & payment
        environments={"sandbox"} // sandbox & production
        source={"source"} //BNPL
        invoiceNumber={""}
        paymentDate={0}
        amount={0}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
```
