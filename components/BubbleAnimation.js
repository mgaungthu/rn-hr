import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Easing,
  Image,
} from 'react-native';

export default class BubbleAnimation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: new Animated.Value(0),
      show: true,
      fadeAnim: new Animated.Value(0),
      translateY1: new Animated.Value(-290),
      translateX1: new Animated.Value(100),
      translateY2: new Animated.Value(290),
      translateX2: new Animated.Value(-100),
      fadeOutAnim: new Animated.Value(10),
      slideAnim: new Animated.Value(-500),
      animatedEnd:false,
      reduceScale: new Animated.Value(2.3),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.scale, {
      toValue: 5,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      this.setState({show: false});
      this.toggleView();
      this.animateViews();
    });
  }

  toggleView = () => {
    if (!this.state.show) {
      Animated.timing(this.state.fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    }
  };

  animateViews = () => {
    const duration = 300; // Adjust the duration as needed

    Animated.parallel([
      Animated.timing(this.state.translateY1, {
        toValue: -330, // Adjust the final translateY as needed
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.translateX1, {
        toValue: 180, // Adjust the final translateX as needed (positive for right)
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.translateY2, {
        toValue: 390, // Adjust the final translateY as needed
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.translateX2, {
        toValue: -209, // Adjust the final translateX as needed (negative for left)
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.reduceScale, {
        toValue: 1, // Adjust the final scale as needed
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(()=> {
      
      setTimeout(() => {
        this.showChildren()
        this.fadeOut()
      }, 800);
     
    });
  };

  fadeOut = () => {
    Animated.timing(this.state.fadeOutAnim, {
      toValue: 0, // Fades out to completely transparent
      duration: 1000, // Adjust the duration as needed
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      
      this.setState({animatedEnd:true})
      
    });
  };

  showChildren = () => {
    Animated.timing(this.state.fadeAnim, {
      toValue: 100,
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }

  // componentDidUpdate(prevProps) {
    
    
    
  // }



  render() {
    const size = 180;

    const opacityClearToVisible = {
      opacity: this.state.fadeAnim.interpolate({
        inputRange: [0, 15, 30],
        outputRange: [0, 0, 1],
        extrapolate: "clamp",
      }),
    }

    
    const appScale = {
      transform: [
        {
          scale: this.state.fadeAnim.interpolate({
            inputRange: [0, 7, 100],
            outputRange: [1.1, 1.05, 1],
          }),
        },
      ],
    }

    const logoScale = {
      transform: [
        {
          scale: this.state.fadeAnim.interpolate({
            inputRange: [0, 10, 100],
            outputRange: [1, 0.8, 10],
          }),
        },
      ],
    }

    const {children } = this.props;

    
    return (
     

      <>
      
        {this.state.show ? (
          <View
            style={[
              styles.container,
              {backgroundColor: this.state.show ? '#3377f1' : '#fff'}
            ]}>
            <Animated.View
              style={{
                position: 'absolute',
                backgroundColor: '#206aed',
                width: size,
                height: size,
                borderRadius: size / 2,
                transform: [
                  {
                    scale: this.state.scale,
                  },
                ],
              }}
            />
          </View>
        ) : (
          <>
            {!this.state.animatedEnd && (
              <>
                <Animated.View
                  style={[styles.boxWrapper,StyleSheet.absoluteFill, {opacity: this.state.fadeOutAnim}]}>
                  <Animated.View
                    style={[
                      styles.box,
                      {
                        transform: [
                          {translateY: this.state.translateY1},
                          {translateX: this.state.translateX1},
                          {scale: this.state.reduceScale,}
                        ],
                      },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.box,
                      {
                        transform: [
                          {translateY: this.state.translateY2},
                          {translateX: this.state.translateX2},
                        ],
                      },
                    ]}
                  />
                  <View style={{backgroundColor: 'transparent'}}>
                    <Animated.Image
                      source={require('../assets/images/logo/splash-logo.png')}
                      resizeMode="contain"
                      style={[styles.img, {opacity: this.state.fadeAnim},logoScale]}
                    />
                  </View>
                </Animated.View>
              </>
            )}

            <Animated.View style={[appScale, opacityClearToVisible,styles.flex]}>
                {children}
              </Animated.View>
              
          </>
        )}
      </>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#206aed',
  },
  img: {
    width: 180,
    height: 180,
  },
  box: {
    position: 'absolute',
    backgroundColor: '#206aed',
    width: 280,
    height: 280,
    borderRadius: 1000,
  },
  boxWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  flex: {
    flex: 1,
  },
});
