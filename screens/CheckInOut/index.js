import React, {useState, useEffect} from 'react';
import {View, Image, Text, StyleSheet, SafeAreaView, Alert, TouchableOpacity} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import Geolocation from '@react-native-community/geolocation';

MapboxGL.setAccessToken(
  'sk.eyJ1IjoiYXVuZ3RodTIiLCJhIjoiY2xuaWN2NXVpMW5kZzJrbWphcXlhbmxjcCJ9.X15nsu4Vl-WbEFRhoNBa0g',
);

const CheckInOut = () => {
  const [latLong, setLatLong] = useState([]);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        setLatLong([position.coords.longitude, position.coords.latitude]);
      },
      error => {
        alert(error.message);
      },
    );
  }, []);

  const getDeviceLocation = () => {
    Geolocation.requestAuthorization(
      success => {
        if (latLong.length === 0) {
          Geolocation.getCurrentPosition(position => {
            setLatLong([position.coords.longitude, position.coords.latitude]);
          });
        } else {
          setLatLong([]);
        }
      },
      error => {
        alert(error.message);
      },
    );
  };

  const createGeoJSONCircle = function (center, radiusInKm, points) {
    if (!points) points = 64;

    var coords = {
      latitude: center[1],
      longitude: center[0],
    };

    var km = radiusInKm;

    var ret = [];
    var distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
    var distanceY = km / 110.574;

    var theta, x, y;
    for (var i = 0; i < points; i++) {
      theta = (i / points) * (2 * Math.PI);
      x = distanceX * Math.cos(theta);
      y = distanceY * Math.sin(theta);

      ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]);

    return [ret];
  };

  const shape = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: createGeoJSONCircle([96.129173, 16.8161807], 0.1),
        },
      },
    ],
  };

  const MapView = () => {

    if (latLong.length > 0) {
      return (
        <MapboxGL.MapView
          style={styles.map}
          onPress={() => getDeviceLocation()}
          // scrollEnabled={false}
          scaleBarEnabled={false}
          attributionEnabled={false}
          logoEnabled={false}>
          <MapboxGL.Camera
            centerCoordinate={[96.129173, 16.8161807]}
            zoomLevel={15}
            animationMode="flyTo"
            animationDuration={2000}
            UserTrackingMode={true}
          />
          <MapboxGL.ShapeSource id="line1" shape={shape}>
            <MapboxGL.FillLayer
              id="sf2010CircleFill"
              sourceLayerID="sf2010"
              style={styles.circle}
            />
          </MapboxGL.ShapeSource>

          <MapboxGL.UserLocation showsUserHeadingIndicator={true} />
        </MapboxGL.MapView>
      );
    } else {
      return (
        <MapboxGL.MapView
          onPress={() => getDeviceLocation()}
          style={styles.map}
          // scrollEnabled={false}
          scaleBarEnabled={false}
          attributionEnabled={false}
          logoEnabled={false}>
          <MapboxGL.Camera
            centerCoordinate={[96.129173, 16.8161807]}
            zoomLevel={15}
            animationMode="flyTo"
            animationDuration={2000}
            UserTrackingMode={true}
          />
          <MapboxGL.ShapeSource id="line1" shape={shape}>
            <MapboxGL.FillLayer
              id="sf2010CircleFill"
              sourceLayerID="sf2010"
              style={styles.circle}
            />
          </MapboxGL.ShapeSource>
        </MapboxGL.MapView>
      );
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <MapView />
        <View style={styles.secWrapper}>
          <View>
            <Text style={styles.checkIntext}>Check In Time</Text>
          </View>
          <View style={{marginVertical: 13}}>
            <Text style={styles.clockText}>03:42:33 PM</Text>
          </View>
          <View>
            <Text style={styles.dateText}>Tuesday, 10 Oct 2023</Text>
          </View>
          <View style={{marginTop: 10}}>
            <Text style={styles.shiftText}>Front Office Shift-A</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={() => alert("clicked")}>
          <View style={styles.btnWrapper}>
            <Image
              source={require('../../assets/images/cursor.png')}
              style={styles.checkInOutBtn}
            />
          </View>
          </TouchableOpacity>
          
          <View>
            <Text style={styles.shiftText}>Open gps to check in/out</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CheckInOut;

const brownColor = '#797a7c';

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  map: {
    flex: 1,
  },
  circle: {
    fillColor: '#FF0000',
    fillOutlineColor: '#FF0000',
    fillOpacity: 0.6,
  },
  secWrapper: {
    flex: 1.3,
    alignItems: 'center',
    marginVertical: 25,
  },
  checkIntext: {
    color: '#4CAF50',
    fontSize: 19,
  },
  clockText: {
    fontSize: 40,
    color: brownColor,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 25,
    color: brownColor,
  },
  shiftText: {
    fontSize: 16,
    color: brownColor,
  },
  btnWrapper: {
    alignItems: 'center',
    justifyContent:'center',
    width: 140,
    height: 140,
    borderRadius: 100,
    backgroundColor: '#aed581',
    marginVertical:15
  },
  checkInOutBtn: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    
  },
});
