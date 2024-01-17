import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiRequest from "../utils/request";
import { useNavigation } from "@react-navigation/native";
import useSWR from "swr";

const screenWidth = Dimensions.get("window").width;
const baseFontSize = 14;
const pixelRatio = screenWidth / 375;
const Community = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [userID, setUserID] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState(false);
  AsyncStorage.getItem("userID")
    .then((uid) => setUserID(uid))
    .catch((error) => console.log(error));

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
  const notfollowingUsers = userData?.users?.filter(
    (user) =>
      !findUser?.following?.some((follow) => follow?.user_id === user?._id)
  );

  const userNotFollowing = notfollowingUsers?.filter(
    (user) => user?._id !== userID
  );

  const handleUserFollow = async (id) => {
    try {
      setLoading(true);
      await apiRequest
        .put("/api/users/follow-user", {
          userID: userID,
          usertobeFollowedID: id,
        })
        .then(() => {
          setLoading(false);
          userMutate("/api/users/get_users");
        })
        .catch((error) => {
          setLoading(false);
          setError(error.response.data.message);
        });
    } catch (error) {
      setServerError(true);
    }
  };
  const handleUserUnFollow = async (id) => {
    try {
      setLoading(true);
      await apiRequest
        .put("/api/users/unfollow-user", {
          userID: userID,
          usertobeFollowedID: id,
        })
        .then(() => {
          setLoading(false);

          userMutate("/api/users/get_users");
        })
        .catch((error) => {
          setLoading(false);
          setError(error.response.data.message);
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
          width: "100%",
          marginTop: insets.top,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 20,
          borderColor: "lightgray",
          borderBottomWidth: 0.5,
          columnGap: 20,
        }}
      >
        <Text style={{ color: "#0D5C63", fontWeight: "bold" }}>
          Discover People
        </Text>
      </View>
      {error && error !== "" && (
        <View style={{ width: "100%", height: 50, backgroundColor: "red" }}>
          <View
            style={{
              width: "80%",
              marginLeft: "auto",
              marginRight: "auto",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>{error}</Text>
          </View>
        </View>
      )}
      {userNotFollowing?.length === 0 ? (
        <View
          style={{
            flex: 1,
            paddingVertical: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ marginVertical: 10, fontSize: 14 }}>
            User not Avaialble
          </Text>
        </View>
      ) : loading ? (
        <ActivityIndicator />
      ) : (
        userNotFollowing?.map((user, index) => {
          const userFollowed = findUser?.following?.some(
            (u) => u?.user_id === user?._id
          );
          return (
            <Pressable
              onPress={() => {
                navigation.navigate("User Detail", {
                  iD: user?._id,
                });
              }}
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
                  {user?.profileImg ? (
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 100,
                      }}
                      source={{
                        uri: user?.profileImg,
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
                        {user?.firstname?.[0]}
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
                    {user?.firstname} {user?.middlename}
                  </Text>
                  <Text
                    style={{
                      color: "gray",
                      fontSize: baseFontSize * 0.625 * pixelRatio,
                    }}
                  >
                    @{user?.profession}
                  </Text>
                </View>
              </View>
              {user?._id !== userID && (
                <>
                  {userFollowed ? (
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
                  ) : (
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#0D5C63",
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderRadius: 20,
                      }}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleUserFollow(user?._id);
                      }}
                    >
                      <Text
                        style={{
                          fontSize: baseFontSize * 0.75 * pixelRatio,
                          color: "white",
                        }}
                      >
                        Follow
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </Pressable>
          );
        })
      )}
    </ScrollView>
  );
};

export default Community;
