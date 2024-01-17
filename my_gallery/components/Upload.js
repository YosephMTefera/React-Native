import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiRequest from "../utils/request";
import { useNavigation } from "@react-navigation/native";
import useCategoryFetch from "../hooks/categoryFetch";
import * as DocumentPicker from "expo-document-picker";
import Error from "./messages/Error";

const Upload = () => {
  const navigation = useNavigation();
  const { categoryList } = useCategoryFetch();
  const [userID, setUserID] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseError, setResponseError] = useState("");
  const [size, setSize] = useState(0);
  const [serverError, setServerError] = useState(false);

  AsyncStorage.getItem("userID")
    .then((uid) => setUserID(uid))
    .catch((error) => console.log(error));

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

      const divider = 1024 * 1024;
      const finalSize = parseInt(imageFile.size) / divider;

      setSize(finalSize);

      setSelectedImage(imageFile);

      if (size > 10) {
        setResponseError("File to large. Size should be less than 10MB.");
      }
    } catch (error) {
      setResponseError(error.message);
    }
  };

  const handleUpload = async () => {
    try {
      if (userID && title && caption && category && image) {
        if (size < 10.0) {
          let uploadData = new FormData();

          uploadData.append("userID", userID);
          uploadData.append("title", title);
          uploadData.append("caption", caption);
          uploadData.append("category", category);
          uploadData.append("fileName", image?.name);
          uploadData.append("picture", image);
          setLoading(true);
          await apiRequest
            .post("/api/posts/add_post", uploadData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then(() => {
              setLoading(false);

              navigation.navigate("Home");
            })
            .catch((error) => {
              setLoading(false);
              setResponseError(error.response.data.message);
            });
        } else {
          setResponseError("File size should be less than 10MB.");
        }
      } else {
        setResponseError("Some of the required field are missing");
      }
    } catch (error) {
      setLoading(false);
      setServerError(true);
    }
  };
  if (serverError) return <Error />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          width: "95%",
          marginVertical: 20,
          marginBottom: image?.uri ? 50 : 20,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ rowGap: 20 }}
        >
          {responseError && (
            <View
              style={{
                marginVertical: 10,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                padding: 5,
              }}
            >
              <Text style={{ fontSize: 12, color: "gray" }}>
                {responseError}
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={openGallery}
            style={{
              width: "100%",
              minHeight: 200,
              justifyContent: "center",
              alignItems: "center",
              rowGap: 10,
              padding: 10,
              borderWidth: 1,
              borderColor: "lightgray",
              borderStyle: "dashed",
              borderRadius: 10,
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                rowGap: 10,
              }}
            >
              <MaterialIcons name="upload-file" size={25} color={"#0D5C63"} />
              <Text
                style={{ fontSize: 12, fontWeight: "bold", color: "#0D5C63" }}
              >
                Upload File
              </Text>
            </View>

            <Text
              style={{
                width: "80%",
                fontSize: 10,
                lineHeight: 20,
                textAlign: "center",
              }}
            >
              Please ensure images are of high resolution in format jpg, or png.
              Only upload media that you have the legal rights to. Maximum file
              size should be 10MB
            </Text>
          </TouchableOpacity>

          {image && (
            <View
              style={{ width: "100%", marginLeft: "auto", marginRight: "auto" }}
            >
              <Image
                resizeMode="contain"
                style={{ width: "100%", height: 200 }}
                source={{ uri: image?.uri }}

                // onLoad={handleImageLoad}
              />
            </View>
          )}
          {categoryList?.length > 0 && (
            <View style={{ rowGap: 10 }}>
              <Text
                style={{
                  fontSize: 14,
                  // textTransform: "uppercase",
                  fontWeight: "bold",
                  color: "#0D5C63",
                }}
              >
                Category
              </Text>
              <Dropdown
                style={{
                  borderWidth: 1,
                  borderColor: "lightgray",
                  padding: 4,
                  borderRadius: 5,
                }}
                placeholderStyle={{ marginVertical: 50 }}
                data={categoryList}
                maxHeight={200}
                labelField={"categoryName"}
                valueField={"_id"}
                placeholder="Select item"
                value={category}
                onChange={(item) => {
                  setCategory(item._id);
                }}
              />
            </View>
          )}

          <View style={{ rowGap: 10 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                color: "#0D5C63",
              }}
            >
              Title
            </Text>
            <TextInput
              mode="outlined"
              onChangeText={(e) => setTitle(e)}
              style={{
                borderWidth: 1,
                borderColor: "lightgray",
                width: "100%",
                padding: 10,
                borderRadius: 5,
              }}
            />
          </View>
          <View style={{ rowGap: 10 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                color: "#0D5C63",
              }}
            >
              Caption
            </Text>
            <TextInput
              mode="outlined"
              multiline
              style={{
                height: 200,
                borderWidth: 1,
                borderColor: "lightgray",
                width: "100%",
                padding: 10,
                borderRadius: 5,
              }}
              onChangeText={(e) => setCaption(e)}
            />
          </View>

          {loading ? (
            <ActivityIndicator />
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: "#0D5C63",
                padding: 10,
                borderRadius: 5,
                marginTop: 10,
              }}
              onPress={handleUpload}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 14,
                }}
              >
                Upload
              </Text>
            </TouchableOpacity>
          )}
        </KeyboardAvoidingView>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default Upload;
