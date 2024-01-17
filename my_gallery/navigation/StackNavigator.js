import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import LoginScreen from "../screens/LoginScreen";
import Home from "../screens/Home";
import ProfileView from "../components/ProfileView";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Community from "../components/Community";
import EditProfile from "../screens/EditProfile";
import Signup from "../screens/Signup";
import UserList from "../screens/UserList";
import { useSelector } from "react-redux";
import EditProfileSelction from "../screens/EditProfileSelction";
import { TouchableOpacity } from "react-native";
import PostDetail from "../screens/PostDetail";
import UserDetail from "../screens/UserDetail";
import Upload from "../components/Upload";
import DeleteAccount from "../screens/DeleteAccount";
import ForgotPassword from "../screens/ForgotPassword";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const BottomTabs = () => {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
            tabBarLabel: "Home",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <MaterialIcons name="home" size={24} color="#0D5C63" />
              ) : (
                <MaterialIcons name="home" size={24} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="Community"
          component={Community}
          options={{
            headerShown: false,
            tabBarLabel: "Community",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <MaterialIcons name="people" size={24} color="#0D5C63" />
              ) : (
                <MaterialIcons name="people-outline" size={24} color="black" />
              ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileView}
          options={{
            headerShown: false,
            tabBarLabel: "My Profile",
            tabBarLabelStyle: { color: "black" },
            tabBarIcon: ({ focused }) =>
              focused ? (
                <MaterialIcons name="person" size={24} color="#0D5C63" />
              ) : (
                <MaterialIcons name="person-outline" size={24} color="black" />
              ),
          }}
        />
      </Tab.Navigator>
    );
  };
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={({ navigation }) => ({
            headerShown: true,
            title: "Sign up",
            headerStyle: {
              backgroundColor: "white",
            },
            headerTitleStyle: {
              fontSize: 14,
              fontWeight: "bold",
              color: "#0D5C63",
            },
            headerTitleAlign: "center",

            headerTintColor: "#0D5C63",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={24} color="#0D5C63" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Forgot Password"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Home Screen"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="User List"
          component={UserList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="User Detail"
          component={UserDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Post Detail"
          component={PostDetail}
          options={({ route, navigation }) => ({
            headerShown: true,
            title: route.params.post?.title,
            headerStyle: {
              backgroundColor: "white",
            },
            headerTitleStyle: {
              fontSize: 14,
              fontWeight: "bold",
              color: "#0D5C63",
            },
            headerTitleAlign: "center",

            headerTintColor: "#0D5C63",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={24} color="#0D5C63" />
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen
          name="Edit Screen"
          component={EditProfile}
          options={{
            headerShown: true,
            title: "Edit your Profile?",

            headerStyle: {
              color: "#0D5C63",
            },
            headerTitleStyle: { fontSize: 14, fontWeight: "bold" },
            headerTintColor: "#0D5C63",
          }}
        />
        <Stack.Screen
          name="Edit Selection"
          component={EditProfileSelction}
          options={({ route, navigation }) => ({
            headerShown: true,
            title: route.params.editField,
            headerStyle: {
              backgroundColor: "white",
            },
            headerTitleStyle: {
              fontSize: 14,
              fontWeight: "bold",
              color: "#0D5C63",
            },
            headerTitleAlign: "center",

            headerTintColor: "#0D5C63",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={24} color="#0D5C63" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Upload"
          component={Upload}
          options={({ route, navigation }) => ({
            headerShown: true,
            title: "Upload",

            headerStyle: {
              backgroundColor: "white",
            },
            headerTitleStyle: {
              fontSize: 14,
              fontWeight: "bold",
              color: "#0D5C63",
            },
            headerTitleAlign: "left",

            headerTintColor: "#0D5C63",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={24} color="#0D5C63" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Delete Account"
          component={DeleteAccount}
          options={({ navigation }) => ({
            headerShown: true,
            title: "Delete Account",
            headerStyle: {
              backgroundColor: "white",
            },
            headerTitleStyle: {
              fontSize: 14,
              fontWeight: "bold",
              color: "#0D5C63",
            },
            headerTitleAlign: "center",

            headerTintColor: "#0D5C63",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={24} color="#0D5C63" />
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
