import { MaterialIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import apiRequest from "../utils/request";
import useSWR from "swr";
import Error from "../components/messages/Error";
import * as DocumentPicker from "expo-document-picker";

const EditProfile = () => {
  const navigation = useNavigation();
  const [id, setID] = useState("");
  const [size, setSize] = useState(0);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");
  const [serverError, setServerError] = useState(false);
  const [image, setSelectedImage] = useState(null);

  AsyncStorage.getItem("userID")
    .then((uid) => setID(uid))
    .catch((error) => setError(error));

  const userFetcher = (url) => apiRequest.get(url).then((res) => res?.data);
  const {
    data: userData,
    isLoading,
    error: userError,
  } = useSWR("/api/users/get_users", userFetcher, {
    refreshInterval: 1000,
  });
  const findUser = userData?.users?.find((user) => user?._id === id);

  const openGallery = async () => {
    try {
      const docRes = await DocumentPicker.getDocumentAsync({
        type: "image/*",
      });

      const assets = docRes.assets;

      if (!assets) return;

      const fileContent = docRes.assets[0];

      const imageFile = {
        name: fileContent.name,
        uri: fileContent.uri,
        type: fileContent.mimeType,
        size: fileContent.size,
      };
      if (imageFile) setSelectedImage(imageFile);
      const divider = 1024 * 1024;
      const finalSize = parseInt(imageFile.size) / divider;

      setSize(finalSize);

      if (size > 10) {
        setError("File to large. Size should be less than 10MB.");
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const handleUpload = async () => {
    try {
      if (image) {
        if (size < 10.0) {
          let uploadData = new FormData();
          uploadData.append("fileName", image?.name);
          uploadData.append("picture", image);
          if (id) {
            await apiRequest
              .put(`/api/users/updateUser/${id}`, uploadData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then(() => {
                navigation.goBack();
              })
              .catch((error) => {
                Alert.alert(error.response.data.msg);
              });
          }
        } else {
          Alert.alert("File size should be less than 10MB.");
        }
      } else {
        Alert.alert("Some of the required field are missing");
      }
    } catch (error) {
      setServerError(true);
    }
  };
  if (isLoading) return <ActivityIndicator />;
  if (userError || serverError) return <Error />;

  return (
    <ScrollView
      style={{
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          width: "70%",
          flexDirection: "row",
          justifyContent: image ? "space-between" : "center",
          alignItems: "center",
          marginVertical: 40,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {findUser?.profileImg ? (
          <View style={{ position: "relative" }}>
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
            <Pressable
              onPress={openGallery}
              style={{
                width: 30,
                height: 30,
                borderRadius: 100,
                position: "absolute",
                top: 5,
                right: -5,
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
                opacity: 0.7,
              }}
            >
              <MaterialIcons
                name="camera-enhance"
                color={"#0D5C63"}
                style={{ zIndex: 10000000 }}
                size={30}
              />
            </Pressable>
          </View>
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
        {image && (
          <View style={{ marginLeft: "auto", marginRight: "auto" }}>
            <Image
              style={{
                width: 100,
                height: 100,
                backgroundColor: "gray",
                borderRadius: 100,
              }}
              source={{ uri: image?.uri }}

              // onLoad={handleImageLoad}
            />
          </View>
        )}
      </View>
      {image && (
        <Pressable
          onPress={handleUpload}
          style={{
            width: "40%",
            marginLeft: "auto",
            marginRight: "auto",
            backgroundColor: "#0D5C63",
            padding: 10,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 12,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Update profile image
          </Text>
        </Pressable>
      )}
      <ScrollView
        style={{
          width: "95%",
          marginTop: 20,
          marginLeft: "auto",
          marginRight: "auto",
          rowGap: 15,
        }}
      >
        <View>
          <Text style={{ color: "gray" }}>Personal Information</Text>
        </View>
        <View
          style={{
            // borderWidth: 2,
            // borderColor: "red",
            rowGap: 20,
          }}
        >
          <View
            style={{
              width: "95%",
              marginTop: 10,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onPress={() => {
                navigation.navigate("Edit Selection", {
                  editField: "Name",
                });
              }}
            >
              <View>
                <Text>Name</Text>
              </View>
              <View>
                <Text style={{ fontSize: 12 }}>
                  {findUser?.firstname} {findUser?.middlename}{" "}
                  {findUser?.lastname}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {/* username */}

          <View
            style={{
              width: "95%",
              marginTop: 10,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onPress={() => {
                navigation.navigate("Edit Selection", {
                  editField: "Username",
                });
              }}
            >
              <View>
                <Text>Username</Text>
              </View>
              <View>
                <Text style={{ fontSize: 12 }}>@{findUser?.username}</Text>
              </View>
            </TouchableOpacity>
          </View>
          {/* Email */}

          <View
            style={{
              width: "95%",
              marginTop: 10,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onPress={() => {
                navigation.navigate("Edit Selection", {
                  editField: "Email Address",
                });
              }}
            >
              <View>
                <Text>Email Address</Text>
              </View>
              <View>
                <Text style={{ fontSize: 12 }}>{findUser?.email}</Text>
              </View>
            </TouchableOpacity>
          </View>
          {/* Phone Number */}
          <View
            style={{
              width: "95%",
              marginTop: 10,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onPress={() => {
                navigation.navigate("Edit Selection", {
                  editField: "Phone Number",
                });
              }}
            >
              <View>
                <Text>Phone Number</Text>
              </View>
              <View>
                <Text style={{ fontSize: 12 }}>{findUser?.phone}</Text>
              </View>
            </TouchableOpacity>
          </View>
          {/* Country */}

          <View
            style={{
              width: "95%",
              marginTop: 10,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onPress={() => {
                navigation.navigate("Edit Selection", {
                  editField: "Country",
                });
              }}
            >
              <View>
                <Text>Country</Text>
              </View>
              <View>
                <Text style={{ fontSize: 12 }}>{findUser?.country}</Text>
              </View>
            </TouchableOpacity>
          </View>
          {/* City */}
          <View
            style={{
              width: "95%",
              marginTop: 10,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onPress={() => {
                navigation.navigate("Edit Selection", {
                  editField: "City",
                });
              }}
            >
              <View>
                <Text>City</Text>
              </View>
              <View>
                <Text style={{ fontSize: 12 }}>{findUser?.city}</Text>
              </View>
            </TouchableOpacity>
          </View>
          {/* profession */}
          <View
            style={{
              width: "95%",
              marginTop: 10,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onPress={() => {
                navigation.navigate("Edit Selection", {
                  editField: "Profession",
                });
              }}
            >
              <View>
                <Text>Profession</Text>
              </View>
              <View>
                <Text style={{ fontSize: 12 }}>{findUser?.profession}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: "95%",
              marginTop: 10,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onPress={() => {
                navigation.navigate("Edit Selection", {
                  editField: "Interests",
                  findUser: findUser,
                  // userMutate: userMutate,
                });
              }}
            >
              <View>
                <Text>Interests</Text>
              </View>
              <View style={{ flexDirection: "row", columnGap: 5 }}>
                {findUser?.interesets?.length === 0 ? (
                  <Text>Add interest</Text>
                ) : (
                  findUser?.interesets?.map((pro, index) => {
                    return (
                      <Text key={index} style={{ fontSize: 12 }}>
                        {pro},
                      </Text>
                    );
                  })
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          width: "95%",
          marginLeft: "auto",
          marginRight: "auto",
          marginVertical: 50,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("Delete Account", { id: id })}
          style={{
            backgroundColor: "red",
            paddingVertical: 10,
            paddingHorizontal: 10,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: "white", textAlign: "center", fontSize: 14 }}>
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditProfile;
