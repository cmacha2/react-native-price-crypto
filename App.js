import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import CoinItem from "./components/CoinItem";

const App = () => {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
    );
    const data = await res.json();
    setCoins(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={style.container}>
      <StatusBar backgroundColor={"white"} />
      <View style={style.header}>
        <Text style={style.title}>Top Coins</Text>
        <TextInput
          onChangeText={(text) => setSearch(text)}
          style={style.input}
          placeholderTextColor="#858585"
          placeholder="Search a coin"
        />
      </View>
      <FlatList
        style={style.list}
        data={coins.filter(
          (coin) =>
            coin.name.toLowerCase().includes(search.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(search.toLowerCase())
        )}
        renderItem={({ item }) => {
          return <CoinItem coin={item} />;
        }}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true);
          await loadData();
          console.log("refreshed");
          setRefreshing(false);
        }}
      />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: "#141414",
    alignItems: "center",
    flex: 1,
  },
  title: {
    color: "#fff",
    marginTop: 10,
    fontSize: 20,
    marginBottom: 10,
  },
  list: {
    width: "85%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 10,
  },
  input: {
    color: "#fff",
    borderBottomColor: "#4657CE",
    borderBottomWidth: 1,
    width: "40%",
    textAlign: "center",
  },
});

export default App;
