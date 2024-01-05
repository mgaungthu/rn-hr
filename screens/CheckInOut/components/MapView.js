import React, {useCallback, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {keepToken} from '../../../api';

const arrayToken = [
  'pk.eyJ1IjoiYXVuZ3RodTIiLCJhIjoiY2xkeTVjdjF0MDBobTNwbXZrZmVpa2w3dCJ9.Pvtw_NER5ewgMH8Eldd44w',
  'pk.eyJ1IjoibmF5bGlua3lhdyIsImEiOiJjbHBrbHd4MTYwYmRoMmlsYmp0azFmd2xoIn0.3MNwOD7jVy22DSTTcvv9vA',
  'pk.eyJ1IjoidGhpaGF3aW4iLCJhIjoiY2xwcWJhcXZwMWs2ZzJxbGVxamowMGtkNCJ9.HTBeVB2bZQ5XNcRdiXRvTg',
];

const randomIndex = Math.floor(Math.random() * arrayToken.length);

MapboxGL.setAccessToken(arrayToken[randomIndex]);

const MapView = ({latLong, getDeviceLocation, user_info}) => {
  // keepToken(accessToken)
  const createGeoJSONCircle = useCallback((center, radiusInKm, points) => {
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
  }, []);

  const shape = useMemo(() => {
    // console.log('Calculating shape...'); // Add this log
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: createGeoJSONCircle(
              [user_info.location.longitude, user_info.location.latitude],
              0.1,
            ),
          },
        },
      ],
    };
  }, [
    createGeoJSONCircle,
    user_info.location.longitude,
    user_info.location.latitude,
  ]);

  const MapViewWrapper = useMemo(() => {
    if (latLong.length > 0) {
      return (
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
      );
    }
    return null;
  }, [latLong]);

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

      {MapViewWrapper}
    </MapboxGL.MapView>
  );
};

export default React.memo(MapView);

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
