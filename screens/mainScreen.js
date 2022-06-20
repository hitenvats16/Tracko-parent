import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
  Text,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import * as Location from "expo-location";
import { onValue, ref } from "firebase/database";
import { db } from "../firebase";
import { Button } from "@rneui/base";
import { AntDesign } from "@expo/vector-icons";

function calcDistance(lat1, lon1, lat2, lon2) {
  var R = 6371;
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

function toRad(Value) {
  return (Value * Math.PI) / 180;
}

export default function MainScreen() {
  const navigation = useNavigation();
  const params = useRoute().params;
  const [distance, setDistance] = useState(0);
  const [location, setLocation] = useState({
    accuracy: 32.645999908447266,
    altitude: 164.59999084472656,
    altitudeAccuracy: 3.7112390995025635,
    heading: 130.05311584472656,
    latitude: 28.6628205,
    longitude: 77.0464616,
    speed: 0.4832797646522522,
  });
  const [loading, setLoading] = useState(true);
  const [pathShown, setShown] = useState(false);

  const [busCoordinates, setCoords] = useState({
    accuracy: 32.645999908447266,
    altitude: 164.59999084472656,
    altitudeAccuracy: 3.7112390995025635,
    heading: 130.05311584472656,
    latitude: 28.6628205,
    longitude: 77.0464616,  
    speed: 0.4832797646522522,
  });

  const [coordArray, setArray] = useState([]);

  useEffect(() => {
    const dbRef = ref(db, params.title);
    onValue(dbRef, (snap) => {
      setCoords(snap.val().coords);
    });
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        ToastAndroid.showWithGravity(
          "Permission to access location was denied",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      setLoading(false);
    })();
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      titleAlign: "center",
      title: params.title,
      headerStyle: {
        backgroundColor: "#1AB6D1",
      },
      headerTintColor: "#fff",
      headerTitleAlign: "center",
    });
  });

  useEffect(() => {
    setArray([
      {
        longitude: location.longitude,
        latitude: location.latitude,
      },
      {
        longitude: busCoordinates.longitude,
        latitude: busCoordinates.latitude,
      },
    ]);
    setDistance(
      calcDistance(
        busCoordinates.latitude,
        busCoordinates.longitude,
        location.latitude,
        location.longitude
      )
    );
  }, [busCoordinates, location]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1AB6D1",
        }}
      >
        <ActivityIndicator size={"large"} color={"white"} />
      </View>
    )
  }

  return (
    <View style={styles.cont}>
      <MapView
        initialRegion={{
          latitude: busCoordinates.latitude,
          longitude: busCoordinates.longitude,
          latitudeDelta: 0.0622,
          longitudeDelta: 0.0121,
        }}  
        style={styles.map}
        userInterfaceStyle={"dark"}
        userLocationAnnotationTitle={"Current Loaction of a parent"}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        showsBuildings={true}
        toolbarEnabled={true}
        moveOnMarkerPress={true}
      >
        <Marker
          coordinate={coordArray[0]}
          title="Parents Location"
          description="This is the live location of a parent"
          key={1}
        />
        <Marker
          coordinate={coordArray[1]}
          title="Bus Location"
          description="This is the live location of a bus via driver's phone"
          flat={true}
          icon={require("../assets/bus.png")}
          key={2}
        />
        {pathShown && (
          <Polygon
            coordinates={coordArray}
            strokeColor={"#06113C"}
            strokeWidth={1}
          />
        )}
      </MapView>
      <View style={styles.speedCont}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "#ffce00",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 30,
              color: "#a6a6a6",
            }}
          >
            {Math.floor(busCoordinates?.speed)}
          </Text>
          <Text
            style={{
              fontSize: 15,
            }}
          >
            km/h
          </Text>
        </View>
        <View style={styles.subCont}>
          <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Estimated Distance: {Math.round(distance)} km</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
            Estimated Time:{" "}
            {Math.floor(busCoordinates.speed) == 0
              ? "-- "
              : (Math.round(distance / Math.floor(busCoordinates.speed)) * 60)}
             min
          </Text>
        </View>
      </View>
      {/* <Button title={"Show Path"} onPress={() => setShown(!pathShown)} buttonStyle={{ backgroundColor: '#ffce00' }}/> */}
    </View>
  );
}

const styles = StyleSheet.create({
  cont: {
    backgroundColor: "#06113C",
    flex: 1,
  },
  map: {
    flex: 1,
  },
  speedCont: {
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  subCont: {
    width: 250,
    height: 100,
    borderRadius: 10,
    backgroundColor: "#ffce00",
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'column'
  },
});