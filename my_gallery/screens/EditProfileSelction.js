import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  CountryButton,
  CountryPicker,
} from "react-native-country-codes-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import apiRequest from "../utils/request";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ComponentError from "../components/messages/ComponentError";
import { interestsData } from "../utils/data";
import Error from "../components/messages/Error";
import useSWR from "swr";

const EditProfileSelction = ({ route }) => {
  const navigation = useNavigation();
  const { editField, findUser } = route.params;
  const [id, setID] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [profession, setProfession] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [componentError, setComponentError] = useState(false);
  const [componentErrorText, setComponentErrorText] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [serverError, setServerError] = useState(false);

  const getUserID = async () => {
    await AsyncStorage.getItem("userID")
      .then((uid) => setID(uid))
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    getUserID();
  }, []);

  const userFetcher = (url) => apiRequest.get(url).then((res) => res?.data);
  const { mutate: userMutate, error: userError } = useSWR(
    "/api/users/get_users",
    userFetcher,
    {
      refreshInterval: 1000,
    }
  );
  const handleInterestClick = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(
        selectedInterests.filter((item) => item !== interest)
      );
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleAddInterests = async () => {
    try {
      if (selectedInterests.length === 0) {
        setSelectedError("You must select atleast one interest");
      } else {
        apiRequest
          .put(`/api/users/interests/addInterests/${id}`, {
            interests: selectedInterests,
          })
          .then(() => {
            userMutate("/api/users/get_users");
            navigation.goBack();
          })
          .catch((error) => {
            Alert.alert(error.response.data.message);
          });
      }
    } catch (error) {
      setLoading(false);
      setServerError(true);
    }
  };

  const handleRemoveInterest = async (interest) => {
    try {
      apiRequest
        .put(`/api/users/interests/removeOneInterest/${id}`, {
          interest: interest,
        })
        .then(() => {
          userMutate("/api/users/get_users");
        })
        .catch((error) => {
          Alert.alert(error.response.data.message);
        });
    } catch (error) {
      setLoading(false);
      setServerError(true);
    }
  };

  const handleUserUpdate = async () => {
    try {
      if (id) {
        setLoading(true);
        await apiRequest
          .put(`/api/users/updateUser/${id}`, {
            firstname: firstName,
            middlename: middleName,
            lastname: lastName,
            username,
            email,
            phone,
            country,
            city,
            profession,
          })
          .then(() => {
            setLoading(false);
            navigation.goBack();
          })
          .catch((error) => {
            setLoading(false);
            setComponentError(true);
            setComponentErrorText(error.response.data.message);
          });
      }
    } catch (error) {
      setLoading(false);
      setServerError(true);
    }
  };

  if (serverError || userError) return <Error />;
  return (
    <SafeAreaView
      style={{
        backgroundColor: "white",
        flex: 1,
        width: "100%",
      }}
    >
      {editField === "Name" && (
        <View
          style={{
            marginTop: 30,
            width: "90%",
            marginRight: "auto",
            marginLeft: "auto",
          }}
        >
          <Text style={{ fontWeight: "bold", color: "#0D5C63" }}>
            Firstname
          </Text>
          <TextInput
            mode="outlined"
            style={{
              marginVertical: 10,
              width: "100%",
              borderWidth: 1,
              borderColor: "#0D5C63",
              borderRadius: 5,
              padding: 10,
            }}
            placeholder="Abebe"
            onChangeText={(e) => setFirstName(e)}
          />
          <Text style={{ fontWeight: "bold", color: "#0D5C63" }}>
            Middlename
          </Text>
          <TextInput
            mode="outlined"
            style={{
              marginVertical: 10,
              width: "100%",
              borderWidth: 1,
              borderColor: "#0D5C63",
              borderRadius: 5,
              padding: 10,
            }}
            placeholder="Kebede"
            onChangeText={(e) => setMiddleName(e)}
          />
          <Text style={{ fontWeight: "bold", color: "#0D5C63" }}>LastName</Text>
          <TextInput
            mode="outlined"
            style={{
              marginVertical: 10,
              width: "100%",
              borderWidth: 1,
              borderColor: "#0D5C63",
              borderRadius: 5,
              padding: 10,
            }}
            placeholder="Kasu"
            onChangeText={(e) => setLastname(e)}
          />
        </View>
      )}
      {editField === "Username" && (
        <View
          style={{
            marginTop: 30,
            width: "90%",
            marginRight: "auto",
            marginLeft: "auto",
          }}
        >
          <Text style={{ fontWeight: "bold", color: "#0D5C63" }}>Username</Text>
          <TextInput
            mode="outlined"
            style={{
              marginVertical: 10,
              width: "100%",
              borderWidth: 1,
              borderColor: "#0D5C63",
              borderRadius: 5,
              padding: 10,
            }}
            placeholder="abebe123"
            onChangeText={(e) => setUsername(e)}
          />
        </View>
      )}
      {editField === "Email Address" && (
        <View
          style={{
            marginTop: 30,
            width: "90%",
            marginRight: "auto",
            marginLeft: "auto",
          }}
        >
          <Text style={{ fontWeight: "bold", color: "#0D5C63" }}>
            Email Address
          </Text>
          <TextInput
            mode="outlined"
            style={{
              marginVertical: 10,
              width: "100%",
              borderWidth: 1,
              borderColor: "#0D5C63",
              borderRadius: 5,
              padding: 10,
            }}
            placeholder="user@example.com"
            onChangeText={(e) => setEmail(e)}
          />
        </View>
      )}
      {editField === "Phone Number" && (
        <View
          style={{
            marginTop: 30,
            width: "90%",
            marginRight: "auto",
            marginLeft: "auto",
          }}
        >
          <Text style={{ fontWeight: "bold", color: "#0D5C63" }}>
            Phone Number
          </Text>
          <TextInput
            mode="outlined"
            keyboardType="number-pad"
            style={{
              marginVertical: 10,
              width: "100%",
              borderWidth: 1,
              borderColor: "#0D5C63",
              borderRadius: 5,
              padding: 10,
            }}
            placeholder="945887522"
            onChangeText={(e) => setPhone(e)}
          />
        </View>
      )}
      {editField === "Country" && (
        <View
          style={{
            marginTop: 20,
            width: "90%",
            marginRight: "auto",
            marginLeft: "auto",
          }}
        >
          <Text style={{ fontWeight: "bold", color: "#0D5C63" }}>Country</Text>
          <TouchableOpacity
            onPress={() => setShow(true)}
            style={{
              marginVertical: 10,
              width: "100%",
              borderWidth: 1,
              borderColor: "#0D5C63",
              borderRadius: 5,
              padding: 10,
            }}
          >
            {country ? (
              <Text
                style={{
                  color: "#0D5C63",
                  fontSize: 14,
                }}
              >
                {country}
              </Text>
            ) : (
              <Text
                style={{
                  color: "#0D5C63",
                  fontSize: 14,
                }}
              >
                Choose Country
              </Text>
            )}
          </TouchableOpacity>

          <CountryPicker
            show={show}
            pickerButtonOnPress={(item) => {
              setCountry(item.name.en);
              setShow(false);
            }}
            ListHeaderComponent={ListHeaderComponent}
            popularCountries={["en", "ua", "pl"]}
          />
        </View>
      )}
      {editField === "City" && (
        <View
          style={{
            marginTop: 30,
            width: "90%",
            marginRight: "auto",
            marginLeft: "auto",
          }}
        >
          <Text style={{ fontWeight: "bold", color: "#0D5C63" }}>City</Text>
          <TextInput
            mode="outlined"
            style={{
              marginVertical: 10,
              width: "100%",
              borderWidth: 1,
              borderColor: "#0D5C63",
              borderRadius: 5,
              padding: 10,
            }}
            placeholder="Addis Ababa"
            onChangeText={(e) => setCity(e)}
          />
        </View>
      )}
      {editField === "Profession" && (
        <View
          style={{
            marginTop: 30,
            width: "90%",
            marginRight: "auto",
            marginLeft: "auto",
          }}
        >
          <Text style={{ fontWeight: "bold", color: "#0D5C63" }}>
            Profession
          </Text>
          <TextInput
            mode="outlined"
            style={{
              marginVertical: 10,
              width: "100%",
              borderWidth: 1,
              borderColor: "#0D5C63",
              borderRadius: 5,
              padding: 10,
            }}
            placeholder="ex. Photographer"
            onChangeText={(e) => setProfession(e)}
          />
        </View>
      )}

      {editField === "Interests" && (
        <View
          style={{
            marginTop: 30,
            width: "90%",
            marginRight: "auto",
            marginLeft: "auto",
          }}
        >
          {selectedInterests?.length !== 0 && (
            <View
              style={{
                width: "100%",

                marginLeft: "auto",
                marginRight: "auto",
                columnGap: 20,
              }}
            >
              <Text
                style={{
                  marginVertical: 10,
                  color: "#0D5C63",
                  fontWeight: "bold",
                }}
              >
                Your selected interests:
              </Text>
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  rowGap: 20,
                  flexWrap: "wrap",
                  padding: 2,
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    width: "90%",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    columnGap: 20,
                  }}
                >
                  {selectedInterests.map((interest, index) => (
                    <View
                      key={index}
                      style={{
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        fontSize: 12,
                        backgroundColor: "#0D5C63",
                        color: "white",
                        borderRadius: 20,
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 12 }}>
                        {interest}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
          <View
            style={{
              width: "100%",
              marginVertical: 30,
              marginLeft: "auto",
              marginRight: "auto",
              flexDirection: "row",
              justifyContent: "flex-start",
              columnGap: 20,
              rowGap: 10,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {interestsData.map((interest, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: "lightgray",
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  fontSize: 14,
                  borderRadius: 20,
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={selectedInterests.includes(interest) ? "selected" : ""}
                  onPress={() => handleInterestClick(interest)}
                >
                  <Text>{interest}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          {findUser?.interesets?.length !== 0 && (
            <View
              style={{
                width: "95%",
                marginLeft: "auto",
                marginRight: "auto",
                marginVertical: 40,
                padding: 20,
                rowGap: 10,
              }}
            >
              <View>
                <Text
                  style={{ fontSize: 18, color: "#0D5C63", fontWeight: "bold" }}
                >
                  Your interests
                </Text>
              </View>
              <View
                style={{ rowGap: 20, marginVertical: 10 }}
                className="row-gap-[20px] my-[30px]"
              >
                {findUser?.interesets?.map((interest, index) => {
                  console.log(interest);
                  return (
                    <View
                      key={index}
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        columnGap: 20,
                      }}
                    >
                      <Text style={{ color: "gray" }}>{interest}</Text>

                      <TouchableOpacity
                        onPress={() => handleRemoveInterest(interest)}
                      >
                        <MaterialIcons name="delete" size={20} color={"gray"} />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      )}

      <View
        style={{
          width: "95%",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: 10,
        }}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: "#0D5C63",
              paddingVertical: 10,
              paddingHorizontal: 10,
              borderRadius: 5,
            }}
            onPress={
              editField === "Interests" ? handleAddInterests : handleUserUpdate
            }
          >
            <Text style={{ color: "white", textAlign: "center", fontSize: 14 }}>
              Update
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {componentError && <ComponentError errorMessage={componentErrorText} />}
    </SafeAreaView>
  );
};

export default EditProfileSelction;

function ListHeaderComponent({ countries, lang, onPress }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={{
        paddingBottom: 20,
      }}
    >
      <View
        style={{
          marginTop: insets.top,
          padding: 10,
          flexDirection: "row",
          columnGap: 10,
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" color={"#0D5C63"} size={25} />
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: "bold",
            color: "#0D5C63",
          }}
        >
          Choose your country
        </Text>
      </View>
      {countries?.map((country, index) => {
        return (
          <CountryButton
            key={index}
            item={country}
            name={country?.name?.[lang || "en"]}
            onPress={() => onPress(country)}
          />
        );
      })}
    </SafeAreaView>
  );
}
