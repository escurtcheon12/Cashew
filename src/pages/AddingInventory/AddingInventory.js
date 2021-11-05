import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Dimensions,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableHighlight,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';

import 'react-native-gesture-handler';

import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Account from '../../assets/icons/Account.svg';
import IconHome from '../../assets/icons/Home.svg';
import IconNotification from '../../assets/icons/Notification.svg';
import IconInventory from '../../assets/icons/Inventory.svg';
import axios from 'axios';

const Stack = createStackNavigator();

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const AddingInventory = ({navigation}) => {
  const [idUser, setIdUser] = useState(0);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [nameImage, setNameImage] = useState('');
  const [number, setNumber] = useState(0);
  const [dataInventory, setDataInventory] = useState({
    inventory_name: '',
    unit: '',
  });
  const [getAllNotif, setGetAllNotif] = useState(0);

  useEffect(() => {
    const getSession = async () => {
      try {
        const value = await AsyncStorage.multiGet([
          'id',
          'username',
          'email',
          'imageName',
        ]);
        if (value !== null) {
          console.log(value);
          setIdUser(parseInt(value[0][1]));
          setUsername(value[1][1]);
          setEmail(value[2][1]);
          setNameImage(value[3][1]);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getSession();
  }, [getAllNotif]);

  const AllNotif = async () => {
    await axios
      .get(
        `https://cashewwww.000webhostapp.com/api/apiNotifications.php?op=countUnread`,
      )
      .then(res => {
        setGetAllNotif(res.data.data.result.toString());
      })
      .catch(err => {
        console.log(`err ${err}`);
      });
  };
  AllNotif();

  const handlePlus = number => {
    setNumber(number + 1);
  };

  const handleMinus = number => {
    if (number > 0) setNumber(number - 1);
  };

  const onInputChange = (value, input) => {
    setDataInventory({
      ...dataInventory,
      [input]: value,
    });
  };

  console.log(username);

  const handleButton = () => {
    const data = `username=${username}&email=${email}&inventory_name=${dataInventory.inventory_name}&total=${number}&unit=${dataInventory.unit}`;

    if (dataInventory.inventory_name && number && dataInventory.unit) {
      axios
        .post(
          `https://cashewwww.000webhostapp.com/api/apiInventory.php?op=create`,
          data,
        )
        .then(res => {
          console.log('succes');
          navigation.navigate('Inventory');
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      alert('Should Fill This Input');
    }
  };

  return (
    <View style={styles.Container}>
      <View style={styles.styleNav}>
        <Text style={styles.HeadlineText}>Cashew</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Account')}
          style={styles.styleAccount}>
          <View style={styles.styleCircleAccount}>
            <Account width={width * 0.1} height={height * 0.05} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.styleMain}>
        <View style={styles.styleParentsMenu}>
          <View style={styles.styleParentsInput}>
            <Text style={styles.styleText}> Inventory Name </Text>
            <TextInput
              style={styles.styleInput}
              onChangeText={value => onInputChange(value, 'inventory_name')}
              placeholderTextColor="grey"
            />
          </View>

          <View style={styles.styleParentsTotal}>
            <TouchableOpacity onPress={() => handleMinus(number)}>
              <View style={styles.styleOperator}>
                <Text style={styles.styleFontOperator}>-</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.styleParentsSquareTotal}>
              <Text style={styles.styleText}>Total</Text>
              <View style={styles.styleSquareTotal}>
                <Text style={styles.valueTotal}>{number}</Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => handlePlus(number)}>
              <View style={styles.styleOperator}>
                <Text style={styles.styleFontOperator}>+</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.styleParentsInput}>
            <Text style={styles.styleText}> Unit </Text>
            <TextInput
              style={styles.styleInput}
              onChangeText={value => onInputChange(value, 'unit')}
              placeholderTextColor="grey"
            />
          </View>

          <TouchableOpacity onPress={() => handleButton()}>
            <View style={styles.styleButtonOK}>
              <Text style={styles.styleOK}>OK</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.styleFooter}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          style={styles.parentsIconsFooter}>
          <View style={styles.styleIconFooter}>
            <IconNotification height={height * 0.05} width={width * 0.1} />

            {getAllNotif != 0 ? (
              <View style={styles.styleNumberNotif}>
                <Text style={styles.styleNumber}>{getAllNotif}</Text>
              </View>
            ) : (
              <View></View>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={styles.parentsIconsFooter}>
          <View style={styles.styleparentHome}>
            <View style={styles.styleIconFooter}>
              <IconHome height={height * 0.04} width={width * 0.1} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.parentsIconsFooter}
          onPress={() => navigation.navigate('Inventory')}>
          <View style={styles.styleIconFooter}>
            <IconInventory height={height * 0.05} width={width * 0.1} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'white',
  },
  styleNav: {
    flexDirection: 'row',
    height: height * 0.1,
    backgroundColor: '#FEDC94',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowRadius: 16.0,
    elevation: 24,
  },
  HeadlineText: {
    fontSize: height * 0.035,
    marginTop: height * 0.025,
    marginLeft: width * 0.05,
    fontFamily: 'Poppins-Bold',
    color: '#3C3535',
  },
  styleAccount: {
    position: 'absolute',
    right: width * 0.08,
    top: height * 0.02,
  },
  styleFooter: {
    height: height * 0.13,
    backgroundColor: '#FEB749',
    flex: 0.2,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -10,
    flexDirection: 'row',
  },
  styleParentMenu: {
    marginTop: height * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
  },
  styleSquareMenu: {
    width: width * 0.9,
    height: height * 0.12,
    backgroundColor: '#935218',
    borderRadius: 30,
    flexDirection: 'row',
    marginTop: height * 0.03,
  },
  styleSquareMenuShift: {
    width: width * 0.9,
    height: height * 0.12,
    backgroundColor: '#31C11A',
    borderRadius: 30,
    flexDirection: 'row',
    marginTop: height * 0.25,
  },
  styleSquareMenuRun: {
    width: width * 0.9,
    height: height * 0.12,
    backgroundColor: 'red',
    borderRadius: 30,
    flexDirection: 'row',
    marginTop: height * 0.25,
  },
  styleSquareIcon: {
    height: height * 0.06,
    width: width * 0.1,
    borderRadius: 8,
    backgroundColor: '#C4C4C4',
    marginLeft: width * 0.08,
    marginTop: height * 0.03,
  },
  styleTextMenu: {
    fontSize: height * 0.05,
    fontFamily: 'Poppins-Medium',
    color: 'white',
    marginLeft: width * 0.08,
    marginTop: height * 0.023,
  },
  styleIconFooter: {
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: height * 0.03,
    marginBottom: height * 0.03,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  styleCircleAccount: {
    height: height * 0.07,
    width: width * 0.13,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: '#FCE1A7',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  styleparentHome: {
    height: height * 0.08,
    width: width * 0.13,
    borderRadius: 18,
    borderColor: 'white',
    backgroundColor: '#935218',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.01,
  },
  parentsIconsFooter: {
    marginLeft: width * 0.17,
    marginTop: height * 0.01,
  },
  styleParentsItem: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  styleMain: {
    marginBottom: height * 0.05,
  },
  styleParentsMenu: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  styleParentsInput: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'left',
  },
  styleText: {
    fontFamily: 'Poppins-Medium',
    color: '#935218',
    marginBottom: height * 0.02,
    fontSize: height * 0.02,
  },
  styleInput: {
    width: width * 0.8,
    height: height * 0.05,
    borderWidth: 1,
    borderRadius: 30,
    paddingLeft: width * 0.02,
    fontSize: height * 0.02,
    color: 'black',
  },
  styleParentsTotal: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  styleOperator: {
    height: height * 0.1,
    width: width * 0.2,
    borderRadius: 50,
    backgroundColor: '#FEB749',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.08,
  },
  styleFontOperator: {
    fontSize: height * 0.07,
    color: '#935218',
    fontFamily: 'Poppins-Medium',
  },
  styleSquareTotal: {
    height: height * 0.16,
    width: width * 0.2,
    borderWidth: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  styleParentsSquareTotal: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: width * 0.1,
    marginRight: width * 0.09,
    marginTop: height * 0.01,
    marginBottom: height * 0.02,
  },
  styleButtonOK: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.8,
    height: height * 0.1,
    backgroundColor: '#935218',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'white',
    marginTop: height * 0.04,
  },
  styleOK: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: height * 0.06,
  },
  valueTotal: {
    textAlign: 'center',
    alignContent: 'center',
    fontSize: height * 0.08,
  },
  styleNumberNotif: {
    height: height * 0.03,
    width: width * 0.05,
    borderRadius: 50,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: -10,
    top: -5,
  },
  styleNumber: {
    color: 'white',
    fontSize: height * 0.015,
  },
});

export default AddingInventory;
