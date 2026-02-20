import React, { useEffect, useRef } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  View,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Circle animations
  const circle1Scale = useRef(new Animated.Value(0)).current;
  const circle2Scale = useRef(new Animated.Value(0)).current;
  const circle3Scale = useRef(new Animated.Value(0)).current;
  const circle1Opacity = useRef(new Animated.Value(0.8)).current;
  const circle2Opacity = useRef(new Animated.Value(0.8)).current;
  const circle3Opacity = useRef(new Animated.Value(0.8)).current;

  // Floating particles
  const particle1Y = useRef(new Animated.Value(0)).current;
  const particle2Y = useRef(new Animated.Value(0)).current;
  const particle3Y = useRef(new Animated.Value(0)).current;
  const particle4Y = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    // your existing animation code...

    const timer = setTimeout(() => {
      navigation.replace('AuthNavigator'); // replace prevents going back to splash
    }, 2000); // 3 seconds splash duration

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Logo entrance animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      }),
    ).start();

    // Expanding circles animation
    const animateCircles = () => {
      Animated.loop(
        Animated.stagger(300, [
          Animated.parallel([
            Animated.sequence([
              Animated.timing(circle1Scale, {
                toValue: 1.5,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.timing(circle1Scale, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(circle1Opacity, {
                toValue: 0,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.timing(circle1Opacity, {
                toValue: 0.8,
                duration: 0,
                useNativeDriver: true,
              }),
            ]),
          ]),
          Animated.parallel([
            Animated.sequence([
              Animated.timing(circle2Scale, {
                toValue: 1.5,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.timing(circle2Scale, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(circle2Opacity, {
                toValue: 0,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.timing(circle2Opacity, {
                toValue: 0.8,
                duration: 0,
                useNativeDriver: true,
              }),
            ]),
          ]),
          Animated.parallel([
            Animated.sequence([
              Animated.timing(circle3Scale, {
                toValue: 1.5,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.timing(circle3Scale, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(circle3Opacity, {
                toValue: 0,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.timing(circle3Opacity, {
                toValue: 0.8,
                duration: 0,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ]),
      ).start();
    };

    setTimeout(() => animateCircles(), 500);

    // Floating particles
    const animateParticle = (particle: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(particle, {
            toValue: -30,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(particle, {
            toValue: 30,
            duration: 2500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    animateParticle(particle1Y, 0);
    animateParticle(particle2Y, 600);
    animateParticle(particle3Y, 1200);
    animateParticle(particle4Y, 1800);
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FEF9E7" barStyle="dark-content" />

      {/* Animated background circles */}
      <Animated.View
        style={[
          styles.backgroundCircle,
          {
            transform: [{ scale: circle1Scale }],
            opacity: circle1Opacity,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.backgroundCircle,
          {
            transform: [{ scale: circle2Scale }],
            opacity: circle2Opacity,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.backgroundCircle,
          {
            transform: [{ scale: circle3Scale }],
            opacity: circle3Opacity,
          },
        ]}
      />

      {/* Floating decorative particles */}
      <Animated.View
        style={[
          styles.particle,
          styles.particle1,
          { transform: [{ translateY: particle1Y }] },
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          styles.particle2,
          { transform: [{ translateY: particle2Y }] },
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          styles.particle3,
          { transform: [{ translateY: particle3Y }] },
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          styles.particle4,
          { transform: [{ translateY: particle4Y }] },
        ]}
      />

      {/* Rotating outer ring */}
      <Animated.View
        style={[
          styles.outerRing,
          {
            transform: [{ rotate: rotation }],
          },
        ]}
      />

      {/* Logo with animation */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <View style={styles.logoBackground}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9E7', // light yellow background
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logoBackground: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: (width * 0.5) / 2,
    backgroundColor: '#FFFBEA',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#CCCCCC',
    // shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: width * 0.38,
    height: width * 0.38,
  },
  backgroundCircle: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: (width * 0.6) / 2,
    // backgroundColor: '#FDE68A',
    backgroundColor: '#E0E0E0',
    opacity: 0.3,
  },
  outerRing: {
    position: 'absolute',
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: (width * 0.65) / 2,
    borderWidth: 2,
    // borderColor: '#FBBF24',
    borderColor: '#D6D6D6',
    borderStyle: 'dashed',
    opacity: 0.3,
  },
  particle: {
    position: 'absolute',
    backgroundColor: '#9E9E9E',
    //  backgroundColor: '#F59E0B',
    borderRadius: 50,
    opacity: 0.4,
  },
  particle1: {
    width: 8,
    height: 8,
    top: height * 0.25,
    left: width * 0.15,
  },
  particle2: {
    width: 6,
    height: 6,
    top: height * 0.3,
    right: width * 0.2,
  },
  particle3: {
    width: 10,
    height: 10,
    bottom: height * 0.3,
    left: width * 0.25,
  },
  particle4: {
    width: 7,
    height: 7,
    bottom: height * 0.25,
    right: width * 0.15,
  },
});
