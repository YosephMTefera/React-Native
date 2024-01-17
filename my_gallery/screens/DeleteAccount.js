import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import apiRequest from "../utils/request";
import { useNavigation } from "@react-navigation/native";
import Error from "../components/messages/Error";

const DeleteAccount = ({ route }) => {
  const navigation = useNavigation();
  const { id } = route.params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState(false);

  const handleDelete = async () => {
    try {
      if (id) {
        setLoading(true);
        await apiRequest
          .delete(`/api/users/deleteuser/${id}`)
          .then(() => {
            navigation.navigate("Login");
          })
          .catch((error) => {
            setError(error.response.data.msg);
          });
      }
    } catch (error) {
      setServerError(true);
    }
  };
  if (serverError) return <Error />;
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          marginVertical: 30,
          marginLeft: "auto",
          marginRight: "auto",
          width: "90%",
          rowGap: 20,
        }}
      >
        {error ? (
          <Text>{error}</Text>
        ) : (
          <Text>
            Are you sure you want to delete your account? this action is
            irreversable!
          </Text>
        )}

        {loading ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity
            onPress={handleDelete}
            style={{
              backgroundColor: "red",
              paddingVertical: 10,
              paddingHorizontal: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "white", textAlign: "center", fontSize: 14 }}>
              Delete my account
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default DeleteAccount;
