import {
  ActivityIndicator,
  FlatList,
  Modal,
  StatusBar,
  Text,
  View,
} from "react-native";
const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
  },
];

export default function TabOneScreen() {
  return (
    <FlatList
      data={DATA}
      className="bg-orange-500 transition-colors"
      renderItem={({ item }) => <Text>{item.title}</Text>}
      keyExtractor={(item) => item.id}
    />
  );
}
