import { useState,useEffect, useRef} from 'react';
import { View } from 'react-native';
import {styles} from './style';
import MapView, {Marker} from 'react-native-maps';
import {requestForegroundPermissionsAsync, getCurrentPositionAsync, 
LocationObject,
watchPositionAsync, 
Accuracy, 
LocationAccuracy
} from 'expo-location';

export default function App() {
  const [location,setLocation] = useState<LocationObject | null>(null);

  const mapRef = useRef<MapView>(null)

  async function requestLocationPermissions(){
    const { granted } = await requestForegroundPermissionsAsync();

    if(granted){
      const CurrentPosition = await getCurrentPositionAsync();
      setLocation(CurrentPosition);

      console.log("Localização atual: ", CurrentPosition)
    }
  }
  useEffect(() => {
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      TimeIntervel: 1000,
      distanceIntervel: 1
    }, (response) => {
      console.log("Nova localização: ", response);
      setLocation(response);
      mapRef.current?.animateCamera({
        pitch: 70,
        center: response.coords
      })
    });
  },[]);

  return (
    <View style={styles.container}>
      {

      location &&

      <MapView

      ref= {mapRef}

      style={styles.map}

      initialRegion={{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005. 
        }}>

      <Marker
      coordinate={{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,

      }}
      ></Marker>
      </MapView>

      }
    </View>
  );
}
