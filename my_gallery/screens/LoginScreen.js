import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import apiRequest from "../utils/request";
import Error from "../components/messages/Error";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await apiRequest
        .post("/api/users/login", {
          username,
          password,
        })
        .catch((error) => {
          setLoading(false);
          Alert.alert(error.response.data.message);
        });

      if (response?.status === 200) {
        setLoading(false);
        await AsyncStorage.setItem("token", response?.data?.token);
        await AsyncStorage.setItem("userID", response?.data?.user?._id);
        navigation.replace("Home Screen");
      }
    } catch (e) {
      setLoading(false);
      setServerError(true);
    }
  };

  const getToken = async () => {
    const token = await AsyncStorage.getItem("token");
    const userID = await AsyncStorage.getItem("userID");

    if (!token && !userID) {
      navigation.navigate("Login");
    } else {
      navigation.replace("Home Screen");
    }
  };

  useEffect(() => {
    getToken();
  }, []);
  if (serverError) return <Error />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "95%",
              marginHorizontal: "auto",
              flexDirection: "column",
              justifyContent: "center",
              paddingHorizontal: 25,
            }}
          >
            <Text
              style={{
                fontSize: 25,
                color: "#0D5C63",
                fontWeight: "bold",
                marginTop: 30,
              }}
            >
              Login
            </Text>

            <Text
              style={{
                fontSize: 12,
                color: "gray",
                marginTop: 10,
              }}
            >
              Please enter your username and password to login!
            </Text>

            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                marginRight: 20,
                marginTop: 50,
                borderColor: "#ccc",
                borderWidth: 1,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 10,
                marginBottom: 8,
              }}
            >
              <MaterialIcons name="person" size={20} color={"#666"} />
              <TextInput
                mode="outlined"
                style={{ margin: 10, width: "100%" }}
                placeholder="Username"
                onChangeText={(e) => setUsername(e)}
              />
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                marginRight: 20,
                marginTop: 20,
                borderColor: "#ccc",
                borderWidth: 1,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 10,
                marginBottom: 8,
              }}
            >
              <MaterialIcons name="lock" size={20} color={"#666"} />
              <TextInput
                mode="outlined"
                style={{ margin: 10, width: "100%" }}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={(e) => setPassword(e)}
              />
            </View>
            <TouchableOpacity
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
              onPress={() => navigation.navigate("Forgot Password")}
            >
              <Text style={{ color: "gray", fontSize: 12 }}>
                Forgot password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: "100%",
                marginTop: 30,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#0D5C63",
                paddingVertical: 10,
                paddingHorizontal: 8,
                borderRadius: 20,
              }}
              onPress={handleLogin}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {loading ? <ActivityIndicator /> : "Login"}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                width: "100%",
                marginLeft: "auto",
                marginRight: "auto",
                height: 0.5,
                backgroundColor: "gray",
                marginVertical: 30,
              }}
            />
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                columnGap: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Don't have an account yet? </Text>
              <Pressable onPress={() => navigation.navigate("Signup")}>
                <Text style={{ color: "#0D5C63", fontWeight: "bold" }}>
                  Sign up
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
