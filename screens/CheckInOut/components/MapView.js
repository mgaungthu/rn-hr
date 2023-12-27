import React from 'react';
import {View, StyleSheet} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { keepToken } from '../../../api';

const arrayToken = [
  'pk.eyJ1IjoiYXVuZ3RodTIiLCJhIjoiY2xkeTVjdjF0MDBobTNwbXZrZmVpa2w3dCJ9.Pvtw_NER5ewgMH8Eldd44w',
  'pk.eyJ1IjoibmF5bGlua3lhdyIsImEiOiJjbHBrbHd4MTYwYmRoMmlsYmp0azFmd2xoIn0.3MNwOD7jVy22DSTTcvv9vA',
  'pk.eyJ1IjoidGhpaGF3aW4iLCJhIjoiY2xwcWJhcXZwMWs2ZzJxbGVxamowMGtkNCJ9.HTBeVB2bZQ5XNcRdiXRvTg',
];

const randomIndex = Math.floor(Math.random() * arrayToken.length);

MapboxGL.setAccessToken(arrayToken[randomIndex]);




const MapView = ({getDeviceLocation, latLong,user_info}) => {


  // keepToken(accessToken)
  const createGeoJSONCircle = function (center, radiusInKm, points) {
    if (!points) points = 64;


    var coords = {
      latitude: parseFloat(center[1]),
      longitude: parseFloat(center[0]),
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
          coordinates: createGeoJSONCircle([user_info.location.longitude, user_info.location.latitude], 0.1),
        },
      },
    ],
  };

  // console.log(user_info.location.latitude) 

  return (
    <MapboxGL.MapView
      style={{flex: 1}}
      onPress={() => getDeviceLocation()}
      // scrollEnabled={false}
      scaleBarEnabled={false}
      attributionEnabled={false}
      logoEnabled={false}>
      <MapboxGL.ShapeSource id="line1" shape={shape}>
        <MapboxGL.FillLayer
          id="sf2010CircleFill"
          sourceLayerID="sf2010"
          style={styles.circle}
        />
      </MapboxGL.ShapeSource>

      {latLong.length > 0 && (
        <View>
          <MapboxGL.Camera
            centerCoordinate={latLong}
            zoomLevel={15}
            animationMode="flyTo"
            animationDuration={2000}
            UserTrackingMode={true}
          />
          <MapboxGL.UserLocation showsUserHeadingIndicator={true} />
        </View>
      )}
    </MapboxGL.MapView>
  );
};

export default MapView;

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
});
