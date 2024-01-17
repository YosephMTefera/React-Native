import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import apiRequest from "../../../utils/request";
import useSWR from "swr";
const Header = () => {
  const navigation = useNavigation();

  const fetcher = (url) => apiRequest.get(url).then((res) => res?.data);
  const { mutate } = useSWR("/api/posts/get_posts", fetcher, {
    refreshInterval: 5000,
  });
  const handleRefresh = async () => {
    try {
      mutate("/api/posts/get_posts");
    } catch (error) {
      setServerError(true);
    }
  };

  return (
    <View
      style={{
        width: "90%",
        marginVertical: 10,
        marginLeft: "auto",
        marginRight: "auto",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 4,
      }}
    >
      <View>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#0D5C63" }}>
          [MY Gallery]
        </Text>
      </View>
      <View style={{ flexDirection: "row", columnGap: 10 }}>
        <TouchableOpacity
          onPress={handleRefresh}
          style={{ flexDirection: "row", columnGap: 20 }}
        >
          <MaterialIcons name="refresh" size={24} color="#0D5C63" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Upload")}
          style={{ flexDirection: "row", columnGap: 20 }}
        >
          <MaterialIcons name="add" size={24} color="#0D5C63" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
