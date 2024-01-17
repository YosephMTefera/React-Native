import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import apiRequest from "../utils/request";

const Signup = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [profession, setProfession] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);

  const handleSignup = async () => {
    if (!firstName) return Alert.alert("First name is missing");
    if (!middleName) return Alert.alert("Middle name is missing");
    if (!lastName) return Alert.alert("Last name is missing");
    if (!username) return Alert.alert("Username is missing");
    if (!email) return Alert.alert("Email is missing");
    if (!phone) return Alert.alert("Phone is missing");
    if (!country) return Alert.alert("Country is missing");
    if (!city) Alert.alert("City is missing");
    if (!profession) return Alert.alert("Profession is missing");
    if (!password) return Alert.alert("Password is missing");

    if (password === retypePassword) {
      try {
        await apiRequest
          .post("/api/users/register", {
            firstname: firstName,
            middlename: middleName,
            lastname: lastName,
            username,
            email,
            phone,
            password,
            country,
            city,
            profession,
          })
          .then(() => {
            setLoading(false);
            navigation.navigate("Login");
          })
          .catch((error) => {
            Alert.alert(error.response.data.message);
          });
      } catch (error) {
        setServerError(true);
      }
    } else {
      Alert.alert("Password and Ret-type password match!");
    }
  };
  if (serverError) return <Error />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView>
          <View
            style={{
              width: "95%",
              marginHorizontal: "auto",
              flexDirection: "column",
              paddingHorizontal: 25,
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                marginRight: 20,
                // marginTop: 30,
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
                placeholder="First Name"
                onChangeText={(e) => setFirstName(e)}
              />
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                marginRight: 20,
                marginTop: 10,
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
                placeholder="Middle Name"
                onChangeText={(e) => setMiddleName(e)}
              />
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                marginRight: 20,
                marginTop: 10,
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
                placeholder="Last Name"
                onChangeText={(e) => setLastname(e)}
              />
            </View>

            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                marginRight: 20,
                marginTop: 10,
                borderColor: "#ccc",
                borderWidth: 1,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 10,
                marginBottom: 8,
              }}
            >
              <MaterialIcons name="person-outline" size={20} color={"#666"} />
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
                marginTop: 10,
                borderColor: "#ccc",
                borderWidth: 1,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 10,
                marginBottom: 8,
              }}
            >
              <MaterialIcons name="email" size={20} color={"#666"} />
              <TextInput
                mode="outlined"
                style={{ margin: 10, width: "100%" }}
                placeholder="Email"
                keyboardType="email-address"
                onChangeText={(e) => setEmail(e)}
              />
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                marginRight: 20,
                marginTop: 10,
                borderColor: "#ccc",
                borderWidth: 1,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 10,
                marginBottom: 8,
              }}
            >
              <MaterialIcons name="phone" size={20} color={"#666"} />
              <TextInput
                mode="outlined"
                style={{ margin: 10, width: "100%" }}
                placeholder="phone"
                keyboardType="phone-pad"
                onChangeText={(e) => setPhone(e)}
              />
            </View>

            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                marginRight: 20,
                marginTop: 10,
                borderColor: "#ccc",
                borderWidth: 1,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 10,
                marginBottom: 8,
              }}
            >
              <Entypo name="globe" size={20} color={"#666"} />
              <TextInput
                mode="outlined"
                style={{ margin: 10, width: "100%" }}
                placeholder="Country"
                onChangeText={(e) => setCountry(e)}
              />
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                marginRight: 20,
                marginTop: 10,
                borderColor: "#ccc",
                borderWidth: 1,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 10,
                marginBottom: 8,
              }}
            >
              <MaterialIcons name="location-city" size={20} color={"#666"} />
              <TextInput
                mode="outlined"
                style={{ margin: 10, width: "100%" }}
                placeholder="City"
                onChangeText={(e) => setCity(e)}
              />
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                marginRight: 20,
                marginTop: 10,
                borderColor: "#ccc",
                borderWidth: 1,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 10,
                marginBottom: 8,
              }}
            >
              <Entypo name="globe" size={20} color={"#666"} />
              <TextInput
                mode="outlined"
                style={{ margin: 10, width: "100%" }}
                placeholder="Ex. Photographer"
                onChangeText={(e) => setProfession(e)}
              />
            </View>

            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                marginRight: 20,
                marginTop: 10,
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

            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                marginRight: 20,
                marginTop: 10,
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
                placeholder="Re-type password"
                secureTextEntry={true}
                onChangeText={(e) => setRetypePassword(e)}
              />
            </View>

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
              onPress={handleSignup}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {loading ? <ActivityIndicator /> : "Signup"}
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
              <Text>Have an account? </Text>
              <Pressable onPress={() => navigation.navigate("Login")}>
                <Text style={{ color: "#0D5C63", fontWeight: "bold" }}>
                  Login
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;
