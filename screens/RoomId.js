import { useNavigation } from "@react-navigation/native";
import { Button } from "@rneui/base";
import { useEffect, useLayoutEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { db} from "../firebase";
import { ref, child, get, set, onValue } from "firebase/database";

export function RoomId() {
  const navigation = useNavigation();
  const [roomId, setRoomId] = useState("");
  const [shown, setShown] = useState(false);
  const [loading,setloading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(()=>{
    setTimeout(() => {
      setShown(false);
    }, 10000);
  },[shown]);

  return (
    <View style={styles.cont}>
      <Text style={styles.text}>Enter Your Room Id</Text>
      <TextInput
        placeholder="RoomId"
        style={styles.inputbox}
        maxLength={10}
        onChangeText={(val) => {
          setRoomId(val);
        }}
        value={roomId}
      />
      <Button
        loading={loading}
        title={"Join Room"}
        onPress={async () => {
          setloading(true);
          const dbRef = ref(db);
          get(child(dbRef,roomId)).then(val=>{
              if(val.exists()) navigation.navigate("MainScreen",{
                  title: roomId
              });
              else setShown(true);
          }).finally(
            ()=>setloading(false)
          );
        }}
        disabled={!roomId || loading}
        buttonStyle={{
          backgroundColor: '#ffce00'
        }}
      />
      {shown && (
        <Text
          style={{
            color: "red",
            paddingTop: 10,
          }}
        >
          Room Doesn't Exist, Please try again with diffrent one
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cont: {
    flex: 1,
    backgroundColor: "#1AB6D1",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    paddingBottom: 10,
  },
  inputbox: {
    backgroundColor: "#eaecf0",
    width: 200,
    height: 40,
    borderRadius: 10,
    padding: 10,
    textAlign: "center",
    marginBottom: 10,
  },
});
