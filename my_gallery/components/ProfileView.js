import { MaterialIcons } from "@expo/vector-icons";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import apiRequest from "../utils/request";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useSWR from "swr";

const width = Dimensions.get("window").width;

const ProfileView = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [id, setID] = useState("");
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState(false);

  const getUserID = async () => {
    await AsyncStorage.getItem("userID")
      .then((uid) => setID(uid))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getUserID();
  }, []);

  useEffect(() => {
    handleRefresh();
  }, [id]);

  const fetcher = (url) => apiRequest.get(url).then((res) => res?.data);
  const {
    data: postData,

    error: postError,
    isLoading,
  } = useSWR("/api/posts/get_posts", fetcher, {
    refreshInterval: 5000,
  });

  const findPost = postData?.posts?.filter((post) => post?.userID === id);

  const handleLogout = async () => {
    navigation.navigate("Login");
    await AsyncStorage.clear();
  };

  const userFetcher = (url) => apiRequest.get(url).then((res) => res?.data);
  const {
    data: userData,
    mutate,
    error: userError,
  } = useSWR("/api/users/get_users", userFetcher, {
    refreshInterval: 5000,
  });
  const findUser = userData?.users?.find((user) => user?._id === id);

  const handleRefresh = async () => {
    try {
      mutate("/api/users/get_users");
    } catch (error) {
      setServerError(true);
    }
  };
  if (isLoading) return <ActivityIndicator />;

  if (postError || userError || serverError) return <Error />;

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <View
        style={{
          width: "100%",
          height: "100%",
          marginTop: insets.top - 20,
        }}
      >
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
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",

            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 20, color: "#0D5C63" }}>
            My Profile
          </Text>
          <View
            style={{
              flexDirection: "row",
              columnGap: 30,
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={handleRefresh}>
              <MaterialIcons name="refresh" size={20} color={"#0D5C63"} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Edit Screen")}
            >
              <MaterialIcons name="edit" size={20} color={"#0D5C63"} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout}>
              <MaterialIcons name="logout" size={20} color={"#0D5C63"} />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            marginTop: 50,
            rowGap: 10,
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {findUser?.profileImg ? (
            <Image
              style={{
                width: 100,
                height: 100,
                backgroundColor: "gray",
                borderRadius: 100,
              }}
              source={{
                uri: findUser?.profileImg,
              }}
            />
          ) : (
            <View
              style={{
                width: 100,
                height: 100,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 100,
                backgroundColor: "#0D5C63",
              }}
            >
              <Text style={{ color: "white" }}>
                {findUser?.firstname ? findUser?.firstname[0] : "-"}
              </Text>
            </View>
          )}

          <Text style={{ color: "#0D5C63", fontSize: 16, fontWeight: "bold" }}>
            {findUser?.firstname} {findUser?.middlename} {findUser?.lastname}
          </Text>
          <Text style={{ fontSize: 10, color: "gray" }}>
            @{findUser?.username}
          </Text>
        </View>

        <View
          style={{
            width: "80%",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: 30,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() =>
              navigation.navigate("User List", {
                state: "Following",
              })
            }
          >
            <Text
              style={{ fontWeight: "bold", fontSize: 14, color: "#0D5C63" }}
            >
              {findUser?.following?.length}
            </Text>
            <Text style={{ fontSize: 12, color: "gray" }}>Following</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("User List", {
                state: "Follower",
              })
            }
            style={{ flexDirection: "column", alignItems: "center" }}
          >
            <Text
              style={{ fontWeight: "bold", fontSize: 14, color: "#0D5C63" }}
            >
              {findUser?.followers ? findUser?.followers?.length : "-"}
            </Text>
            <Text style={{ fontSize: 12, color: "gray" }}>Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: "column", alignItems: "center" }}
          >
            <Text
              style={{ fontWeight: "bold", fontSize: 14, color: "#0D5C63" }}
            >
              {findPost ? findPost?.length : "-"}
            </Text>
            <Text style={{ fontSize: 12, color: "gray" }}>Posts</Text>
          </TouchableOpacity>
          <View>
            <Text
              style={{ fontWeight: "bold", fontSize: 12, color: "#0D5C63" }}
            >
              {findUser?.status ? "Public" : "Private"}
            </Text>
            <Text style={{ fontSize: 12, color: "gray" }}>Status</Text>
          </View>
        </View>
        <View
          style={{
            width: "70%",
            marginTop: 20,
            marginLeft: "auto",
            marginRight: "auto",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            columnGap: 5,
            flexWrap: "wrap",
          }}
        >
          {findUser?.interesets &&
            findUser?.interesets?.map((interest, index) => {
              return (
                <View
                  key={index}
                  style={{
                    backgroundColor: "#0D5C63",
                    color: "white",

                    borderRadius: 20,

                    paddingVertical: 5,
                    paddingHorizontal: 14,
                  }}
                >
                  <Text style={{ fontSize: 12, color: "white" }}>
                    {interest ? interest : "-"}
                  </Text>
                </View>
              );
            })}
        </View>
        <View style={{ marginTop: 20 }}>
          <View
            style={{
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto",
              marginVertical: 20,
            }}
          >
            <Text
              style={{ color: "#0D5C63", fontWeight: "bold", fontSize: 18 }}
            >
              Posts
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "flex-start",
              flexWrap: "wrap",
              columnGap: 0.5,
            }}
          >
            {findPost?.map((post, index) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Post Detail", {
                      post: post,
                    })
                  }
                  key={index}
                >
                  <Image
                    style={{ width: width / 3.1, height: width / 3.1 }}
                    source={{ uri: post?.filename }}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileView;
