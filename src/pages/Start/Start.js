import 'react-native-gesture-handler';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';

import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import Logo from '../../assets/icons/Cashew.svg';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const Stack = createStackNavigator();

const Start = ({navigation}) => {
  return (
    <ScrollView>
      <View style={styles.Container}>
        <Logo height={height * 0.2} width={width * 0.4} style={styles.Logo} />
        <Text style={styles.textCashew}>Cashew</Text>
        <Text style={styles.textWelcome}>{`Welcome to Cashew 
A creative way to manage your cafe`}</Text>

        <TouchableOpacity
          style={styles.styleButton}
          onPress={() => navigation.navigate('Intro')}>
          <Text style={styles.styleTextButton}>Lets Start</Text>
        </TouchableOpacity>

        <Text style={styles.styleContinue}>Click to continue</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#FFF6DB',
  },
  Logo: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  textCashew: {
    fontFamily: 'Poppins-Bold',
    fontSize: height * 0.07,
  },
  textWelcome: {
    textAlign: 'center',
    fontSize: 'Roboto-Medium',
    fontSize: height * 0.02,
  },
  styleButton: {
    height: height * 0.08,
    width: width * 0.9,
    backgroundColor: '#FECE79',
    borderRadius: 30,
    marginTop: height * 0.35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleTextButton: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: height * 0.02,
  },
  styleContinue: {
    fontFamily: 'Roboto-Medium',
    fontSize: height * 0.02,
    marginTop: height * 0.03,
    paddingBottom: height * 0.035,
  },
});

export default Start;
