import React from 'react';
import {View, StyleSheet} from 'react-native';
import MapboxGL from '@rnmapbox/maps';


MapboxGL.setAccessToken(
  'sk.eyJ1IjoiYXVuZ3RodTIiLCJhIjoiY2xuaWN2NXVpMW5kZzJrbWphcXlhbmxjcCJ9.X15nsu4Vl-WbEFRhoNBa0g',
);



const MapView = ({getDeviceLocation, latLong}) => {
    

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
