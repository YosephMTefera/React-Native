import { View, Text } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

const Success = ({ message }) => {
  return (
    <View
      style={{
        width: "70%",
        marginLeft: "auto",
        marginRight: "auto",
        position: "absolute",
        top: "50%",
        backgroundColor: "white",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        rowGap: 10,
      }}
    >
      <AntDesign name="checkcircle" size={50} color={"#0D5C63"} />
      <Text style={{ textAlign: "center", fontSize: 14 }}>{message}</Text>
    </View>
  );
};

export default Success;
