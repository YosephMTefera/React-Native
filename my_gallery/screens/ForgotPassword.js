import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import apiRequest from "../utils/request";
import Success from "../components/messages/Success";
import Error from "../components/messages/Error";

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [successText, setSuccesstext] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) return Alert.alert("Email is missing");
    try {
      setLoading(true);
      await apiRequest
        .post("/api/users/forgotPassword", { email: email.trim() })
        .then((res) => {
          setLoading(false);
          setSuccesstext(res.data.msg);
          setSuccess(true);
        })
        .catch((error) => {
          setLoading(false);
          setSuccess(false);
          Alert.alert(error.response.data.msg);
        });
    } catch (error) {
      setLoading(false);
      setServerError(true);
    }
  };
  if (serverError) return <Error />;
  return (
    <SafeAreaView>
      <View style={{ width: "95%", marginHorizontal: 20 }}>
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            marginTop: 10,
            backgroundColor: "#c9f2d4",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 100,
          }}
          onPress={() => navigation.pop()}
        >
          <MaterialIcons
            name="keyboard-arrow-left"
            size={30}
            color={"#0D5C63"}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          rowGap: 20,
        }}
      >
        <View
          style={{
            width: 100,
            height: 100,
            marginTop: 50,
            backgroundColor: "#c9f2d4",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 100,
          }}
        >
          <MaterialIcons name="lock" size={50} color={"#0D5C63"} />
        </View>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Forgot password?
        </Text>
        <Text
          style={{
            width: "70%",
            textAlign: "center",
            fontSize: 12,
            color: "gray",
          }}
        >
          Enter your registered email below to receive password reset
          instruction
        </Text>
        <View
          style={{
            width: "80%",
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
          <MaterialIcons name="mail" size={20} color={"#666"} />
          <TextInput
            mode="outlined"
            style={{ margin: 10 }}
            keyboardType="email-address"
            placeholder="Email"
            onChangeText={(e) => setEmail(e)}
          />
        </View>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity
            style={{
              width: "80%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#0D5C63",
              paddingVertical: 10,

              borderRadius: 20,
            }}
            onPress={handleForgotPassword}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
          </TouchableOpacity>
        )}
      </View>
      {success && <Success message={successText} />}
    </SafeAreaView>
  );
};

export default ForgotPassword;
