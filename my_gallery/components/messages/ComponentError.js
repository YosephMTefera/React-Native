import { View, Text } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

const ComponentError = ({ errorMessage }) => {
  return (
    <View style={{ position: "absolute", left: "25%", top: "50%" }}>
      <View
        style={{
          width: 300,
          height: 200,
          backgroundColor: "white",
          borderRadius: 10,
          rowGap: 20,
          padding: 10,
        }}
      >
        <MaterialIcons name="error" color={"#0D5C63"} size={30} />
        <Text>{errorMessage}</Text>
      </View>
    </View>
  );
};

export default ComponentError;
