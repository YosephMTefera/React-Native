import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/sub-sections/home/Header";
import Posts from "../components/sub-sections/home/Posts";
import Categories from "../components/sub-sections/home/Categories";

const Home = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,

        backgroundColor: "white",
        zIndex: 1,
      }}
    >
      <Header />
      <Categories />

      <Posts />
    </SafeAreaView>
  );
};

export default Home;
