import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useSWR from "swr";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import apiRequest from "../utils/request";

const screenWidth = Dimensions.get("window").width;
const baseFontSize = 14;
const pixelRatio = screenWidth / 375;

const PostDetail = ({ route }) => {
  const { post } = route.params;
  const [userID, setUserID] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState("");
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
    refreshInterval: 1000,
  });

  const findUser = userData?.users?.find((user) => user?._id === userID);

  const handleLikedPost = async (id) => {
    try {
      await apiRequest
        .put(`/api/posts/like_Post/${id}`, { userID })
        .then(() => {
          mutate("/api/posts/get_posts");
        })
        .catch((error) => {
          setError(error.response.data.message);
        });
    } catch (error) {
      setServerError(true);
    }
  };

  const removeLikedPost = async (id) => {
    try {
      await apiRequest
        .put(`/api/posts/remove_like_post/${id}`, { userID })
        .then(() => {
          mutate("/api/posts/get_posts");
        })
        .catch((error) => {
          setError(error.response.data.message);
        });
    } catch (error) {
      setServerError(true);
    }
  };
  const handleUserFollow = async (id) => {
    try {
      await apiRequest
        .put("/api/users/follow-user", {
          userID: userID,
          usertobeFollowedID: id,
        })
        .then(() => {
          userMutate("/api/users/get_users");
        })
        .catch((error) => {
          setError(error.response.data.message);
        });
    } catch (error) {
      setServerError(true);
    }
  };
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
          setError(error.response.data.message);
        });
    } catch (error) {
      setServerError(true);
    }
  };
  const handleImageLoad = () => {
    setImageLoading(false);
  };
  const firstname = userData?.users?.find(
    (user) => user?._id === post?.userID
  )?.firstname;
  const middlename = userData?.users?.find(
    (user) => user?._id === post?.userID
  )?.middlename;
  const username = userData?.users?.find(
    (user) => user?._id === post?.userID
  )?.username;
  const profileImg = userData?.users?.find(
    (user) => user?._id === post?.userID
  )?.profileImg;
  const userLiked = post?.like?.some((user) => user?.user_id === userID);
  const userFollowed = findUser?.following?.some(
    (u) => u?.user_id === post?.userID
  );

  if (isLoading) return <ActivityIndicator />;

  if (userError || serverError) return <Error />;
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ width: "100%", backgroundColor: "white" }}>
        <View
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
              {profileImg && !profileImg === "" ? (
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
                  {firstname ? (
                    <Text
                      style={{
                        color: "white",
                        textTransform: "uppercase",
                      }}
                    >
                      {firstname?.[0]}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        color: "white",
                        textTransform: "uppercase",
                      }}
                    >
                      U
                    </Text>
                  )}
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
                {firstname} {middlename}
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
          {post?.userID !== userID && (
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
                    handleUserUnFollow(post?.userID);
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
                    handleUserFollow(post?.userID);
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
        </View>
        {imageLoading ? (
          <View
            style={{
              width: screenWidth,
              height: 300,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading...</Text>
          </View>
        ) : (
          <Image
            style={{ width: screenWidth, height: 300 }}
            source={{ uri: post?.filename }}
            onLoad={handleImageLoad}
          />
        )}
        <View
          style={{
            width: "90%",
            marginVertical: 20,
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
              columnGap: 20,
            }}
          >
            {userLiked ? (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 5,
                }}
                onPress={(e) => {
                  e.stopPropagation();
                  removeLikedPost(post?._id);
                }}
              >
                <AntDesign name="heart" size={20} color={"red"} />
                <Text>{post?.like?.length}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 5,
                }}
                onPress={(e) => {
                  e.stopPropagation();
                  handleLikedPost(post?._id);
                }}
              >
                <AntDesign name="hearto" size={20} color={"#0D5C63"} />
                <Text>{post?.like?.length}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                columnGap: 5,
              }}
            >
              <AntDesign name="eyeo" size={20} color={"#0D5C63"} />
              <Text>{post?.views?.length}</Text>
            </TouchableOpacity>
          </View>
          <Entypo name="dots-three-vertical" size={20} color={"#0D5C63"} />
        </View>
        <View
          style={{
            width: "90%",
            marginTop: 10,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Text style={{ lineHeight: 25, color: "gray", fontSize: 12 }}>
            {post?.caption}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PostDetail;
