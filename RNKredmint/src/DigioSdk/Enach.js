import React from "react";
import { View, Button, Text, SafeAreaView } from "react-native";

import { DigioRNComponent } from "./DIgioSdk";
export default class Enach extends React.Component {
  constructor(props) {
    super(props);

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

  onSuccess = (t) => {};

  onCancel = () => {
    this.props.navigation.navigate("Home");
  };

  componentDidMount = () => {};

  // componentDidUpdate() {
  //   this.props?.enachData(this.state.eNachData);
  // }
  render() {
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
