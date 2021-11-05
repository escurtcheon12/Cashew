import axios from 'axios';
import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  scrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Dimensions,
} from 'react-native';

import 'react-native-gesture-handler';

import {createStackNavigator} from '@react-navigation/stack';

import Google from '../../assets/icons/Google.svg';
import Arrow from '../../assets/icons/Arrow.svg';
import Facebook from '../../assets/icons/Facebook.svg';
import Eye from '../../assets/icons/Eye.svg';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {AccessToken, LoginManager} from 'react-native-fbsdk';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {Directions} from 'react-native-gesture-handler';

const Stack = createStackNavigator();

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const Register = ({navigation}) => {
  const [allUser, setAllUser] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secondPassword, setSecondPassword] = useState('');
  const [wrongPass, setWrongPass] = useState('');
  const [showPass, setShowPass] = useState(true);
  const [userGoogleLogin, setUserGoogleLogin] = useState({});

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '90600475081-l923qoic6cbpalvgo64s4v63vu393ujg.apps.googleusercontent.com',
    });

    getData();
  }, []);

  const getData = async () => {
    await axios
      .get('https://cashewwww.000webhostapp.com/api/apiUser.php')
      .then(res => {
        setAllUser(res.data.data.result);
      })
      .catch(err => console.log(err));
  };

  console.log(allUser);

  const postData = () => {
    const data = `username=${username}&password=${password}&email=${email}`;

    if (allUser && allUser.length === 0) {
      if (password === secondPassword) {
        axios
          .post(
            'https://cashewwww.000webhostapp.com/api/apiUser.php?op=create',
            data,
          )
          .then(res => {
            console.log(res);

            setUsername('');
            setEmail('');
            setPassword('');
            setSecondPassword('');
            navigation.navigate('Login');
          })
          .catch(err => console.log(err));
      } else {
        setWrongPass(`the first password and the second password 
    are not the same`);
      }
    } else {
      const dataFilter = `username=${username}&email=${password}`;

      if (password === secondPassword) {
        axios
          .post(
            'https://cashewwww.000webhostapp.com/api/apiUser.php?op=filterRegister',
            dataFilter,
          )
          .then(res => {
            if (res.data.status === 'none')
              axios
                .post(
                  'https://cashewwww.000webhostapp.com/api/apiUser.php?op=create',
                  data,
                )
                .then(res => {
                  console.log(res);

                  setUsername('');
                  setEmail('');
                  setPassword('');
                  setSecondPassword('');
                  navigation.navigate('Login');
                })
                .catch(err => console.log(err));
            else if (res.data.status === 'registered')
              setWrongPass(`Username and Email already registered`);
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  };

  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserGoogleLogin({userInfo});
    } catch (error) {
      console.log(error);
    }
  };

  const FacebookLogin = () => {
    LoginManager.logInWithPermissions(['public_profile']).then(
      function (result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log(
            'Login success with permissions: ' +
              result.grantedPermissions.toString(),
          );
        }
      },
      function (error) {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  const showingPassword = () => {
    setShowPass(false);
    if (showPass === false) {
      setShowPass(true);
    }
  };

  return (
    <View style={styles.Container}>
      <TouchableOpacity onPress={() => navigation.navigate('Intro')}>
        <View>
          <Arrow
            style={styles.styleArrow}
            width={width * 0.1}
            height={height * 0.05}
          />
        </View>
      </TouchableOpacity>

      <Text style={styles.styleHeadlineText}>Register</Text>

      <View style={styles.styleParentIcon}>
        <TouchableOpacity onPress={() => googleLogin()}>
          <View style={styles.buttonGoogle}>
            <Google width={33} height={33} style={styles.iconGoogle} />

            <Text style={styles.textGoogle}>Google</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => FacebookLogin()}>
          <View style={styles.buttonFacebook}>
            <Facebook style={styles.iconFacebook} width={33} height={33} />
            <Text style={styles.textFacebook}>Facebook</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.textMiddle}>Or Sign up using</Text>

      <Text style={styles.wrongPassword}>{wrongPass}</Text>

      <View style={styles.styleParentInput}>
        <TextInput
          style={styles.styleInput}
          placeholder="Username"
          value={username}
          onChangeText={value => {
            setUsername(value);
          }}
          placeholderTextColor="grey"
        />

        <TextInput
          style={styles.styleInput}
          placeholder="Email"
          value={email}
          onChangeText={value => {
            setEmail(value);
          }}
          placeholderTextColor="grey"
        />

        <View style={styles.parentButtonPass}>
          <TextInput
            secureTextEntry={showPass}
            style={styles.styleInput}
            placeholder="Password"
            value={password}
            onChangeText={value => {
              setPassword(value);
            }}
            placeholderTextColor="grey"
          />

          <TouchableOpacity
            style={styles.eyeShowPass}
            onPress={() => showingPassword()}>
            <Eye height={height * 0.04} width={width * 0.4} />
          </TouchableOpacity>
        </View>

        <TextInput
          secureTextEntry={showPass}
          style={styles.styleInput}
          placeholder="Second Password"
          value={secondPassword}
          onChangeText={value => {
            setSecondPassword(value);
          }}
          placeholderTextColor="grey"
        />
      </View>

      <TouchableOpacity style={styles.parentSignUp} onPress={postData}>
        <View style={styles.buttonSignUp}>
          <Text style={styles.textSignUp}>Sign Up</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#FFF6DB',
  },
  styleArrow: {
    marginLeft: width * 0.08,
    marginTop: height * 0.03,
  },
  styleHeadlineText: {
    marginTop: height * 0.04,
    marginLeft: width * 0.1,
    fontFamily: 'Poppins-Bold',
    fontSize: height * 0.04,
  },
  styleParentIcon: {
    flexDirection: 'row',
    marginTop: height * 0.04,
  },
  buttonGoogle: {
    width: width * 0.4,
    height: height * 0.07,
    backgroundColor: 'white',
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: width * 0.08,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  buttonFacebook: {
    width: width * 0.4,
    height: height * 0.07,
    backgroundColor: '#3498DB',
    borderRadius: 50,
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  iconGoogle: {
    marginLeft: width * 0.04,
  },
  textGoogle: {
    marginLeft: width * 0.05,
    fontSize: height * 0.02,
    fontFamily: 'Poppins-Bold',
  },
  textFacebook: {
    marginLeft: width * 0.03,
    fontSize: height * 0.02,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  iconFacebook: {
    marginLeft: width * 0.04,
  },
  textMiddle: {
    textAlign: 'center',
    marginTop: height * 0.05,
    marginBottom: height * 0.02,
    fontSize: height * 0.02,
    fontFamily: 'Roboto-Regular',
  },
  styleInput: {
    marginTop: height * 0.02,
    fontSize: height * 0.02,
    width: width * 0.9,
    height: height * 0.075,
    backgroundColor: 'white',
    borderRadius: 30,
    alignItems: 'center',
    padding: 15,
    color: 'black',
  },
  styleParentInput: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleTextForgot: {
    marginTop: height * 0.03,
    textAlign: 'right',
    marginRight: width * 0.08,
  },
  parentSignUp: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  buttonSignUp: {
    width: width * 0.9,
    height: height * 0.07,
    backgroundColor: '#935218',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSignUp: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: height * 0.025,
  },
  styleTextBottom: {
    marginTop: height * 0.13,
    textAlign: 'center',
    fontSize: height * 0.018,
  },
  wrongPassword: {
    textAlign: 'center',
    color: '#EA4335',
  },
  parentButtonPass: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeShowPass: {
    position: 'absolute',
    left: width * 0.6,
    bottom: height * 0.02,
  },
});

export default Register;
