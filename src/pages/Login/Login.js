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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

import 'react-native-gesture-handler';

import {createStackNavigator} from '@react-navigation/stack';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {AccessToken, LoginManager} from 'react-native-fbsdk';

import Google from '../../assets/icons/Google.svg';
import Arrow from '../../assets/icons/Arrow.svg';
import Facebook from '../../assets/icons/Facebook.svg';
import Eye from '../../assets/icons/Eye.svg';
import {color} from 'react-native-reanimated';

const Stack = createStackNavigator();

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const Login = ({navigation}) => {
  const [wrongPass, setWrongPass] = useState('');
  const [showPass, setShowPass] = useState(true);
  const [allUser, setAlluser] = useState([]);
  const [userLogin, setUserLogin] = useState({
    idLogin: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [checkLogin, setCheckLogin] = useState(false);

  useEffect(() => {
    const logout = async () => {
      try {
        const keys = ['id_user', 'username', 'email', 'imageName'];
        await AsyncStorage.multiRemove(keys);
        navigation.navigate('Login');
      } catch (err) {
        console.log(err);
      }
    };

    GoogleSignin.configure({
      webClientId:
        '90600475081-l923qoic6cbpalvgo64s4v63vu393ujg.apps.googleusercontent.com',
    });

    const getData = async () => {
      await axios
        .get('https://cashewwww.000webhostapp.com/api/apiUser.php')
        .then(res => {
          setAlluser(res.data.data.result);
        })
        .catch(err => console.log(err));
    };
    getData();

    navigation.addListener('focus', () => {
      logout();
      getData();
    });
  }, [checkLogin]);

  const session_data = async (id, username, email, imageName) => {
    try {
      let keys = [
        ['id_user', id],
        ['username', username],
        ['email', email],
        ['imageName', imageName],
      ];
      await AsyncStorage.multiSet(keys);
    } catch (err) {
      console.log(err);
    }
  };

  let searchUsername = function (nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].username === nameKey) {
        return myArray[i];
      }
    }
  };

  let searchEmail = function (nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].email === nameKey) {
        return myArray[i];
      }
    }
  };

  let validateLogin = () => {
    if (userLogin.idLogin.includes('@')) {
      let i = searchEmail(userLogin.idLogin, allUser);

      const data = `email=${userLogin.idLogin}&password=${userLogin.password}`;

      axios
        .post(
          `https://cashewwww.000webhostapp.com/api/apiUser.php?op=login`,
          data,
        )
        .then(res => {
          if (res.data.status == 'correct') {
            session_data(i.id, i.username, res.data.email, i.image);
            navigation.navigate('Home');
          } else if (userLogin.idLogin === '' && userLogin.password == '') {
            setWrongPass('You have to fill in the input if you want to enter');
          } else {
            setWrongPass('The username or email you entered is wrong');
          }
        })
        .catch(err => console.log(err));
    } else {
      let i = searchUsername(userLogin.idLogin, allUser);

      const data = `username=${userLogin.idLogin}&password=${userLogin.password}`;

      axios
        .post(
          `https://cashewwww.000webhostapp.com/api/apiUser.php?op=login`,
          data,
        )
        .then(res => {
          if (res.data.status == 'correct') {
            session_data(i.id, res.data.username, i.email, i.image);
            navigation.navigate('Home');
          } else if (userLogin.idLogin === '' && userLogin.password == '') {
            setWrongPass('You have to fill in the input if you want to enter');
          } else {
            setWrongPass('The username or email you entered is wrong');
          }
        })
        .catch(err => console.log(err));
    }
  };

  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      let i = searchEmail(userInfo.user.email, allUser);

      const data = `email=${userInfo.user.email}&password=${userInfo.user.id}`;

      axios
        .post(
          `https://cashewwww.000webhostapp.com/api/apiUser.php?op=login`,
          data,
        )
        .then(res => {
          if (res.data.status == 'correct') {
            session_data(i.id, i.username, res.data.email, i.image);
            navigation.navigate('Home');
          } else {
            const data = `email=${userInfo.user.email}&password=${userInfo.user.id}`;
            axios
              .post(
                'https://cashewwww.000webhostapp.com/api/apiUser.php?op=create',
                data,
              )
              .then(res => {
                setCheckLogin(true);
                console.log(`succes ${res}`);
              })
              .catch(err => console.log(err));
          }
        })
        .catch(err => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  let autoRegist = () => {
    const data = `email=${userLogin.idLogin}&password=${userLogin.password}`;
    axios
      .post(
        'https://cashewwww.000webhostapp.com/api/apiUser.php?op=create',
        data,
      )
      .then(res => {
        console.log(`succes ${res}`);
      })
      .catch(err => console.log(err));
  };
  console.log(userLogin);

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
          console.log(result);
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

  const onInputChange = (value, input) => {
    setUserLogin({
      ...userLogin,
      [input]: value,
    });
  };

  return (
    <View style={styles.Container}>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{color: '#935218'}}
      />

      <TouchableOpacity onPress={() => navigation.navigate('Intro')}>
        <View>
          <Arrow
            style={styles.styleArrow}
            width={width * 0.1}
            height={height * 0.05}
          />
        </View>
      </TouchableOpacity>

      <Text style={styles.styleHeadlineText}>Login</Text>

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

      <Text style={styles.textMiddle}>Or Log In using</Text>

      <Text style={styles.wrongPassword}>{wrongPass}</Text>

      <View style={styles.styleParentInput}>
        <TextInput
          style={styles.styleInput}
          placeholder="Username or Email"
          onChangeText={idLogin => onInputChange(idLogin, 'idLogin')}
          placeholderTextColor="grey"
        />

        <View style={styles.parentButtonPass}>
          <TextInput
            secureTextEntry={showPass}
            style={styles.styleInput}
            placeholder="Password"
            onChangeText={password => onInputChange(password, 'password')}
            placeholderTextColor="grey"
          />

          <TouchableOpacity
            style={styles.eyeShowPass}
            onPress={() => showingPassword()}>
            <Eye height={height * 0.04} width={width * 0.4} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity>
        <Text style={styles.styleTextForgot}>Forgot your password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.parentLogin}
        onPress={() => validateLogin()}>
        <View style={styles.buttonLogin}>
          <Text style={styles.textLogin}>Log in</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.styleDontHave}
        onPress={() => navigation.navigate('Register')}>
        <Text style={styles.styleTextBottom}>
          Don’t have an account yet? Sign up
        </Text>
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
    marginTop: height * 0.03,
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
    fontSize: height * 0.015,
  },
  parentLogin: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonLogin: {
    width: width * 0.9,
    height: height * 0.07,
    backgroundColor: '#935218',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.04,
  },
  textLogin: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: height * 0.025,
  },
  styleDontHave: {
    marginTop: height * 0.13,
  },
  styleTextBottom: {
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

export default Login;
