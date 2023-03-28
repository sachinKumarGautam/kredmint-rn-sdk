import React from "react";
import { View, Button, Text, SafeAreaView } from "react-native";

import { DigioRNComponent } from "./DIgioSdk";
export default class Enach extends React.Component {
  constructor(props) {
    super(props);
    console.log("customUrlcustomUrl", props?.customUrl?.split("/")[5]);
    this.state = {
      digioDocumentId: props?.customUrl?.split("/")[5],
      digioUserIdentifier: props?.customUrl?.split("/")[7],
      //   digioLoginToken: 'Pass GWT token Id here',
      options: {
        is_redirection_approach: "true",
        is_iframe: false,
        environment: "production",
        redirect_url: props?.customUrl,
        logo: "yourlogourl",
        theme: {
          primaryColor: "#234FDA",
          secondaryColor: "#234FDA",
        },
      },
      eNachData: null,
    };
  }

  onSuccess = (t) => {
    console.log("enach success");
    console.log(t + " Response from Digio SDk ");
  };

  onCancel = () => {
    this.props.navigation.navigate("Home");
    console.log("enach failure ");
    console.log("Cancel Response from Digio SDk ");
  };

  componentDidMount = () => {};

  // componentDidUpdate() {
  //   this.props?.enachData(this.state.eNachData);
  // }
  render() {
    console.log("props", this.props, this.props?.customUrl?.split("/")[5]);

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <DigioRNComponent
          onSuccess={this.onSuccess}
          onCancel={this.onCancel}
          options={this.state.options}
          digioDocumentId={this.state.digioDocumentId}
          identifier={this.state.digioUserIdentifier}
          digioToken={this.state.digioLoginToken}
          customoutput={(value) => {
            this.setState({ ...this.state, enachData: value });

            this.props?.enachData(value);
          }}
        />
      </SafeAreaView>
    );
  }
}
