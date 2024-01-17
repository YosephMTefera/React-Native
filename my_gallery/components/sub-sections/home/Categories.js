import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import useCategoryFetch from "../../../hooks/categoryFetch";
import { postAction } from "../../../REDUX/postSlice";

const Categories = () => {
  const dispatch = useDispatch();
  const { category } = useSelector((state) => state.posts);
  const { categoryList } = useCategoryFetch();

  return (
    <View
      style={{
        width: "90%",
        // marginVertical: 1,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{
          width: "100%",
          overflow: "scroll",
        }}
        contentContainerStyle={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {categoryList &&
          categoryList?.map((categoryID, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={
                  category === categoryID?._id
                    ? {
                        fontWeight: "bold",
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        backgroundColor: "#0D5C63",
                        borderRadius: 20,
                        marginVertical: 20,
                        marginRight: 15,
                      }
                    : {
                        marginRight: 10,
                      }
                }
                onPress={() =>
                  dispatch(postAction.setCategory(categoryID?._id))
                }
              >
                {/* <MaterialIcons name=""/> */}
                <Text
                  style={
                    category === categoryID?._id
                      ? {
                          textTransform: "uppercase",
                          fontSize: 10,
                          color: "white",
                          fontWeight: "bold",
                          textAlign: "center",
                        }
                      : {
                          textTransform: "uppercase",
                          fontSize: 10,

                          marginRight: 15,
                        }
                  }
                >
                  {categoryID?.categoryName}
                </Text>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
};

export default Categories;
