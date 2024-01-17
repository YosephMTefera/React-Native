import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiRequest from "../utils/request";
import useSWR from "swr";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const screenWidth = Dimensions.get("window").width;
const baseFontSize = 14;
const pixelRatio = screenWidth / 375;

const UserList = ({ route }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { state } = route.params;
  const [userID, setUserID] = useState("");
  const [serverError, setServerError] = useState(false);

  AsyncStorage.getItem("userID")
    .then((uid) => setUserID(uid))
    .catch((error) => setError(error));

  const userFetcher = (url) => apiRequest.get(url).then((res) => res?.data);
  const {
    data: userData,
    mutate: userMutate,
    isLoading,
    error: userError,
  } = useSWR("/api/users/get_users", userFetcher, {
    refreshInterval: 5000,
  });

  const findUser = userData?.users?.find((user) => user?._id === userID);

  const handleUserUnFollow = async (id) => {
    try {
      await apiRequest
        .put("/api/users/unfollow-user", {
          userID: userID,
          usertobeFollowedID: id,
        })
        .then(() => {
          userMutate("/api/users/get_users");
        })
        .catch((error) => {
          Alert.alert(error.response.data.message);
        });
    } catch (error) {
      setServerError(true);
    }
  };
  if (isLoading) return <ActivityIndicator />;

  if (userError || serverError) return <Error />;

  return (
    <ScrollView style={{ backgroundColor: "white", flex: 1 }}>
      <View
        style={{
          width: "90%",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: insets.top,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingVertical: 20,
          borderColor: "lightgray",
          borderBottomWidth: 0.5,
          columnGap: 20,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" color={"#0D5C63"} size={20} />
        </TouchableOpacity>

        <Text style={{ color: "#0D5C63", fontWeight: "bold" }}>{state}</Text>
      </View>
      <View style={{ marginTop: 20 }}>
        {state === "Following" ? (
          findUser?.following?.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>User not Avaialble</Text>
            </View>
          ) : (
            findUser?.following?.map((user, index) => {
              const firstname = userData?.users?.find(
                (u) => u?._id === user?.user_id
              )?.firstname;
              const middlename = userData?.users?.find(
                (u) => u?._id === user?.user_id
              )?.middlename;
              const lastname = userData?.users?.find(
                (u) => u?._id === user?.user_id
              )?.lastname;
              const username = userData?.users?.find(
                (u) => u?._id === user?.user_id
              )?.username;
              const profession = userData?.users?.find(
                (u) => u?._id === user?.user_id
              )?.profession;
              const profileImg = userData?.users?.find(
                (u) => u?._id === user?.user_id
              )?.profileImg;

              return (
                <View
                  key={index}
                  style={{
                    width: "95%",
                    marginVertical: 10,
                    marginLeft: "auto",
                    marginRight: "auto",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      columnGap: 10,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: "#0D5C63",
                        borderRadius: 20,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {profileImg ? (
                        <Image
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 100,
                          }}
                          source={{
                            uri: profileImg,
                          }}
                        />
                      ) : (
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            backgroundColor: "#0D5C63",
                            borderRadius: 20,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              textTransform: "uppercase",
                            }}
                          >
                            {firstname?.[0]}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={{ marginLeft: 10 }}>
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: "#0D5C63",
                          fontSize: baseFontSize * 0.875 * pixelRatio,
                        }}
                      >
                        {firstname} {middlename} {lastname}
                      </Text>
                      <Text
                        style={{
                          color: "gray",
                          fontSize: baseFontSize * 0.625 * pixelRatio,
                        }}
                      >
                        @{username}
                      </Text>
                    </View>
                  </View>

                  <>
                    <TouchableOpacity
                      style={{
                        borderWidth: 1,

                        borderColor: "#0D5C63",
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderRadius: 20,
                      }}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleUserUnFollow(user?._id);
                      }}
                    >
                      <Text
                        style={{
                          fontSize: baseFontSize * 0.75 * pixelRatio,
                          color: "#0D5C63",
                        }}
                      >
                        Unfollow
                      </Text>
                    </TouchableOpacity>
                  </>
                </View>
              );
            })
          )
        ) : findUser?.following?.length === 0 ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>User not Avaialble</Text>
          </View>
        ) : (
          findUser?.followers?.map((user, index) => {
            const firstname = userData?.users?.find(
              (u) => u?._id === user?.user_id
            )?.firstname;
            const middlename = userData?.users?.find(
              (u) => u?._id === user?.user_id
            )?.middlename;
            const lastname = userData?.users?.find(
              (u) => u?._id === user?.user_id
            )?.lastname;
            const username = userData?.users?.find(
              (u) => u?._id === user?.user_id
            )?.username;
            const profession = userData?.users?.find(
              (u) => u?._id === user?.user_id
            )?.profession;
            const profileImg = userData?.users?.find(
              (u) => u?._id === user?.user_id
            )?.profileImg;

            return (
              <View
                key={index}
                style={{
                  width: "95%",
                  marginVertical: 10,
                  marginLeft: "auto",
                  marginRight: "auto",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: 10,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: "#0D5C63",
                      borderRadius: 20,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {profileImg ? (
                      <Image
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 100,
                        }}
                        source={{
                          uri: profileImg,
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          backgroundColor: "#0D5C63",
                          borderRadius: 20,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            textTransform: "uppercase",
                          }}
                        >
                          {firstname?.[0]}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: "#0D5C63",
                        fontSize: baseFontSize * 0.875 * pixelRatio,
                      }}
                    >
                      {firstname} {middlename} {lastname}
                    </Text>
                    <Text
                      style={{
                        color: "gray",
                        fontSize: baseFontSize * 0.625 * pixelRatio,
                      }}
                    >
                      @{username}
                    </Text>
                  </View>
                </View>

                <>
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,

                      borderColor: "#0D5C63",
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      borderRadius: 20,
                    }}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleUserUnFollow(user?._id);
                    }}
                  >
                    <Text
                      style={{
                        fontSize: baseFontSize * 0.75 * pixelRatio,
                        color: "#0D5C63",
                      }}
                    >
                      Unfollow
                    </Text>
                  </TouchableOpacity>
                </>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

export default UserList;
