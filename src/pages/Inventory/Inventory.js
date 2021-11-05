import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';

import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

import Account from '../../assets/icons/Account.svg';
import IconHome from '../../assets/icons/Home.svg';
import IconNotification from '../../assets/icons/Notification.svg';
import IconInventory from '../../assets/icons/Inventory.svg';
import ArrowBottom from '../../assets/icons/ArrowBottom.svg';

import Spinner from 'react-native-loading-spinner-overlay';

import axios from 'axios';

const Stack = createStackNavigator();

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const Item = ({onPress, total, unit, inv_name}) => {
  return (
    <View>
      <TouchableOpacity style={styles.styleParentsSquare} onPress={onPress}>
        <View style={styles.styleSquareList}>
          <View style={styles.styleParentsTotal}>
            <Text style={styles.styleTotal}>{total}</Text>
            <Text style={styles.styleSatuan}>{unit}</Text>
          </View>
          <Text style={styles.styleNameDesc}>{inv_name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const Inventory = ({navigation}) => {
  const [idUser, setIdUser] = useState(0);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [nameImage, setNameImage] = useState('');
  const [dataInventory, setDataInventory] = useState([]);
  const [text, setText] = useState('');
  const [getAllNotif, setGetAllNotif] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getItem = async () => {
      try {
        await AsyncStorage.removeItem('id');
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(true);
      }
    };

    const getSession = async () => {
      try {
        const value = await AsyncStorage.multiGet([
          'id_user',
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
          setLoading(false);
        }
      } catch (e) {
        console.log(e);
        setLoading(true);
      }
    };
    getSession();

    const getData = async () => {
      await axios
        .get('https://cashewwww.000webhostapp.com/api/apiInventory.php')
        .then(res => {
          setDataInventory(res.data.data.result);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(true);
        });
    };
    getData();

    const AllNotif = async () => {
      await axios
        .get(
          `https://cashewwww.000webhostapp.com/api/apiNotifications.php?op=countUnread`,
        )
        .then(res => {
          setGetAllNotif(res.data.data.result.toString());
          setLoading(false);
        })
        .catch(err => {
          console.log(`err ${err}`);
          setLoading(true);
        });
    };
    AllNotif();

    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
      requestPermissions: Platform.OS === 'ios',
    });

    PushNotification.createChannel(
      {
        channelId: '1',
        channelName: 'My channel',
        channelDescription: 'A channel to categorise your notifications',
        playSound: false,
        soundName: 'default',
        vibrate: true,
      },
      created => console.log(`createChannel returned '${created}'`),
    );

    sendNotification();

    navigation.addListener('focus', () => {
      getData();
      getItem();
      sendNotification();
    });
  }, [getAllNotif]);

  const sendNotification = () => {
    ([] || dataInventory).map(item => {
      if (item.total <= 2) {
        PushNotification.localNotification({
          channelId: 1,
          title: 'Cashew',
          message: `Inventory anda yang bernama ${item.inventory_name} tersisa ${item.total} tolong harap diisi!!`,
        });
      }
    });
  };

  const session_item = async (id, inventory_name, total, unit, deadline) => {
    try {
      let keys = [
        ['id', id],
        ['inventory_name', inventory_name],
        ['total', total],
        ['unit', unit],
        deadline === null ? ['deadline', ''] : ['deadline', deadline],
      ];
      await AsyncStorage.multiSet(keys);
    } catch (err) {
      console.log(err);
    }
  };

  const SelectItem = get => {
    session_item(get.id, get.inventory_name, get.total, get.unit, get.deadline);
    navigation.navigate('EditInventory');
  };

  const newItemList =
    text == ''
      ? dataInventory
      : dataInventory.filter(item => {
          const newText = text.toLowerCase();
          return (
            `${item.inventory_name}`.toLowerCase().includes(newText) ||
            `${item.unit}`.toLowerCase().includes(text)
          );
        });

  const handleSearchInput = text => {
    if (!text) {
      setText('');
    } else {
      setText(text);
    }
  };

  return (
    <View style={styles.Container}>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{color: 'black'}}
      />

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
        <ScrollView>
          <View style={styles.styleParentsItem}>
            <View style={styles.styleParentsCategory}>
              <View style={styles.styleButtonCategory}>
                <TextInput
                  style={styles.styleNameCategory}
                  placeholder="Search"
                  onChangeText={text => handleSearchInput(text)}
                  placeholderTextColor="grey"
                />
                <ArrowBottom
                  width={width * 0.05}
                  height={height * 0.03}
                  style={styles.styleIconArrow}
                />
              </View>
            </View>
          </View>

          <View style={styles.styleMainList}>
            {(newItemList || []).map(item => {
              if (item.username === username && username.length > 0) {
                return (
                  <Item
                    key={item.id}
                    onPress={() => SelectItem(item)}
                    total={item.total}
                    unit={item.unit}
                    inv_name={item.inventory_name}
                  />
                );
              } else if (item.email === email) {
                return (
                  <Item
                    key={item.id}
                    onPress={() => SelectItem(item)}
                    total={item.total}
                    unit={item.unit}
                    inv_name={item.inventory_name}
                  />
                );
              }
            })}
          </View>
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.styleParentsAdding}
        onPress={() => navigation.navigate('AddingInventory')}>
        <Text style={styles.stylePlus}>+</Text>
      </TouchableOpacity>

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
  styleParentsCategory: {
    marginTop: height * 0.08,
    width: width * 0.8,
    height: height * 0.06,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  styleButtonCategory: {
    flexDirection: 'row',
  },
  styleIconArrow: {
    position: 'absolute',
    right: width * 0.06,
    bottom: height * 0.013,
  },
  styleNameCategory: {
    color: '#935218',
    width: width * 0.64,
    marginLeft: width * 0.03,
    fontFamily: 'Roboto-Regular',
    fontSize: height * 0.02,
  },
  styleParentsAdding: {
    width: width * 0.2,
    height: height * 0.1,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: height * 0.15,
    right: width * 0.05,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
  stylePlus: {
    fontSize: height * 0.08,
    color: '#935218',
  },
  styleMainList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: height * 0.04,
    marginBottom: height * 0.03,
  },
  styleParentsSquare: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: height * 0.005,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  styleSquareList: {
    height: height * 0.2,
    width: height * 0.2,
    backgroundColor: '#FEDC94',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  styleParentsTotal: {
    flexDirection: 'row',
  },
  styleTotal: {
    fontSize: height * 0.08,
    fontFamily: 'Poppins-Bold',
  },
  styleSatuan: {
    marginTop: height * 0.06,
    marginLeft: width * 0.02,
    fontWeight: 'bold',
  },
  styleNameDesc: {
    fontSize: height * 0.03,
    color: '#935218',
    fontWeight: 'bold',
    position: 'relative',
    bottom: height * 0.02,
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

export default Inventory;
