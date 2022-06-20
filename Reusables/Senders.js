import { View, StyleSheet, Text } from "react-native";

export default function Sender({msg,user}) {
  return (
    <View style={styles.cont}>
      <View style={{paddingBottom:7}}>
        <View style={styles.inner}>
          <Text style={styles.text}>{msg}</Text>
        </View>
        <Text style={{ color: 'white', marginLeft: 5, fontWeight:'bold', fontSize:10 }}>
          {user}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cont: {
    width: "100%",
    flex: 1,
    alignItems: "baseline",
    paddingHorizontal:10
  },
  inner: {
    backgroundColor:'white',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  text: {
    color: '#06113C',
  },
});