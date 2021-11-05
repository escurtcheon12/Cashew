import 'react-native-gesture-handler';

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  Dimensions,
} from 'react-native';

import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import ImagesIntro1 from '../../assets/icons/ImageIntro1.svg';
import ImagesIntro2 from '../../assets/icons/ImageIntro2.svg';
import ImagesIntro3 from '../../assets/icons/ImageIntro3.svg';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import Swiper from 'react-native-swiper';

const Stack = createStackNavigator();

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const Intro = ({navigation}) => {
  return (
    <View style={styles.Container}>
      <Swiper
        paginationStyle={styles.stylePagination}
        style={styles.styleSwiper}
        loop={true}
        autoplay={true}>
        <ImagesIntro1
          width={width * 0.6}
          height={height * 0.7}
          style={styles.styleImage}
        />
        <ImagesIntro2
          width={width * 0.6}
          height={height * 0.7}
          style={styles.styleImage}
        />
        <ImagesIntro3
          width={width * 0.6}
          height={height * 0.7}
          style={styles.styleImage}
        />
      </Swiper>

      <Text style={styles.styleHeadlineEasy}>Easy your Cashier</Text>

      <Text style={styles.styleParagraph}>{`Custom and fast planning
        with a low price`}</Text>

      <TouchableOpacity
        style={styles.styleButtonFirst}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.styleTextButtonFirst}> Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.styleButtonSecond}
        onPress={() => navigation.navigate('Register')}>
        <Text style={styles.styleTextButtonSecond}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'column',
    backgroundColor: '#FFF6DB',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  styleImage: {
    marginLeft: width * 0.2,
    flex: 1,
    position: 'absolute',
    top: -80,
    alignItems: 'center',
    alignContent: 'center',
  },
  stylePagination: {
    marginTop: 10,
  },
  styleHeadlineEasy: {
    fontFamily: 'Poppins-Bold',
    fontSize: height * 0.035,
  },
  styleParagraph: {
    fontFamily: 'Roboto-Regular',
    fontSize: height * 0.02,
    marginBottom: 97,
  },
  styleButtonFirst: {
    height: height * 0.08,
    width: width * 0.85,
    backgroundColor: '#935218',
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleButtonSecond: {
    marginBottom: 63,
    marginTop: 18,
    height: height * 0.08,
    width: width * 0.85,
    backgroundColor: '#FECE79',
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleTextButtonFirst: {
    fontSize: height * 0.02,
    color: 'white',
    fontFamily: 'Poppins-Bold',
  },
  styleTextButtonSecond: {
    color: 'black',
    fontFamily: 'Poppins-Bold',
    fontSize: height * 0.02,
  },
});

export default Intro;
