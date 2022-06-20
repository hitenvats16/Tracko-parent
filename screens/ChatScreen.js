import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import Sender from "../Reusables/Senders";

function ChatScreen() {
  const params = useRoute()?.params;
  const navigation = useNavigation();
  const id = params.id;
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat Room",
      headerStyle: { backgroundColor: "#1ab6d1" },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const [arr, setArr] = useState([]);

  useEffect(() => {
    let docRef = doc(db, params.room);
    let col = collection(docRef, "chats");
    let q = query(col, orderBy("timeStamp", "asc"));
    onSnapshot(q, (snap) => {
      const temp = snap.docs.map((e) => {
        let message = e.data().message;
        return <Sender user={"Driver"} msg={message} />;
      });
      setArr(temp);
    });
  }, []);

  const scrollRef = useRef();

  return (
    <>
      <ScrollView style={styles.container} ref={scrollRef} onContentSizeChange={()=>{ scrollRef.current.scrollToEnd({animated: true}) }}>{arr}</ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1ab6d1",
  },
  base: {
    flexDirection: "row",
  },
});

export default ChatScreen;