import { View, Text, Image, Pressable } from "react-native";
import React from "react";

const Error = () => {
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        style={{
          width: 200,
          height: 200,
        }}
        source={require("../../assets/connection-lost.png")}
      />

      <Text
        style={{
          width: "60%",
          fontSize: 12,
          marginVertical: 30,
          textAlign: "center",
        }}
      >
        Connection Lost. Please check your internet connection and try again!
      </Text>
    </View>
  );
};

export default Error;
