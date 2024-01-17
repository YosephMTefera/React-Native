import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import useSWR from "swr";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import apiRequest from "../../../utils/request";
import Error from "../../messages/Error";

const screenWidth = Dimensions.get("window").width;
const baseFontSize = 14;
const pixelRatio = screenWidth / 375;

const Posts = () => {
  const navigation = useNavigation();
  const { category } = useSelector((state) => state.posts);
  const [userID, setUserID] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [error, setError] = useState("");

  AsyncStorage.getItem("userID")
    .then((uid) => setUserID(uid))
    .catch((error) => console.log(error));

  const fetcher = (url) => apiRequest.get(url).then((res) => res?.data);
  const {
    data,
    mutate,
    isLoading,
    error: postError,
  } = useSWR("/api/posts/get_posts", fetcher, {
    refreshInterval: 5000,
  });

  const userFetcher = (url) => apiRequest.get(url).then((res) => res?.data);
  const {
    data: userData,
    mutate: userMutate,
    error: userError,
  } = useSWR("/api/users/get_users", userFetcher, {
    refreshInterval: 1000,
  });

  const filteredPost = data?.posts?.filter(
    (post) => post.category === category
  );
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
        .then((res) => {
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
        .then((res) => {
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

  if (error)
    return Alert.alert(
      "Error ocuured",
      "Something went wrong",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => console.log("OK Pressed"),
        },
      ],
      { cancelable: false }
    );

  if (isLoading) return <ActivityIndicator />;

  if (postError || userError || serverError) return <Error />;

  return (
    <ScrollView
      style={{
        flex: 1,
      }}
    >
      {isLoading && userData?.users ? (
        <ActivityIndicator />
      ) : (
        <>
          {category === "65859d27f8e02b0d9d69624f" ? (
            data?.posts?.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "bold", color: "#0D5C63" }}>
                  No Data Available
                </Text>
              </View>
            ) : (
              data?.posts?.map((post, index) => {
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
                const userLiked = post?.like?.some(
                  (user) => user?.user_id === userID
                );
                const userFollowed = findUser?.following?.some(
                  (u) => u?.user_id === post?.userID
                );

                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Post Detail", {
                        post: post,
                      })
                    }
                    key={index}
                    style={{ width: "100%", backgroundColor: "white" }}
                  >
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
                        <TouchableOpacity
                          onPress={(e) => {
                            e.stopPropagation();
                            navigation.navigate("User Detail", {
                              iD: post?.userID,
                            });
                          }}
                          style={{ marginLeft: 10 }}
                        >
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
                        </TouchableOpacity>
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
                            <AntDesign
                              name="hearto"
                              size={20}
                              color={"#0D5C63"}
                            />
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
                    </View>
                  </TouchableOpacity>
                );
              })
            )
          ) : filteredPost?.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "bold", color: "#0D5C63" }}>
                No Data Available
              </Text>
            </View>
          ) : (
            filteredPost?.map((post, index) => {
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
              const userLiked = post?.like?.some(
                (user) => user?.user_id === userID
              );
              const userFollowed = findUser?.following?.some(
                (u) => u?.user_id === post?.userID
              );

              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Post Detail", {
                      post: post,
                    })
                  }
                  key={index}
                  style={{ width: "100%", backgroundColor: "white" }}
                >
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
                            style={{ width: 40, height: 40, borderRadius: 100 }}
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
                  {!post?.filename && post?.filename === "" ? (
                    <View
                      style={{
                        width: screenWidth,
                        height: 300,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ActivityIndicator size="large" color="#0000ff" />
                      <Text style={{ fontSize: 200, color: "red" }}>
                        Loading...
                      </Text>
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
                          <AntDesign
                            name="hearto"
                            size={20}
                            color={"#0D5C63"}
                          />
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
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </>
      )}
    </ScrollView>
  );
};

export default Posts;
