import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  scrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStackNavigator} from '@react-navigation/stack';

import Arrow from '../../assets/icons/Arrow.svg';
import ArrowCategory from '../../assets/icons/ArrowBottom.svg';
import AccountNotif from '../../assets/icons/AccountNotif.svg';
import Trash from '../../assets/icons/Trash.svg';
import ArrowBottom from '../../assets/icons/ArrowBottom.svg';

import LinearGradient from 'react-native-linear-gradient';

import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';

import {deleteAllInventory} from '../../redux/actions';

import {useDispatch, useSelector} from 'react-redux';

const Stack = createStackNavigator();

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const rightSwipe = onPressDelete => {
  return (
    <TouchableOpacity style={styles.styleDeleteBox} onPress={onPressDelete}>
      <View>
        <Trash height={30} width={30} />
      </View>
    </TouchableOpacity>
  );
};

const ListNotif = ({date, name, desc, time, onPressDelete, onPressData}) => {
  return (
    <Swipeable renderRightActions={() => rightSwipe(onPressDelete)}>
      <TouchableOpacity onPress={onPressData}>
        <View style={styles.styleContainerDate}>
          <View style={styles.styleParentsDate}>
            <View style={styles.styleTextDate}>
              <Text style={styles.styleDate}>{date + ', ' + time}</Text>
              <Text style={styles.styleNameDate}>{name}</Text>
              <Text style={styles.styleDescDate}>{desc}</Text>
            </View>
            <AccountNotif
              style={styles.styleImageDate}
              height={54}
              width={54}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const Notifications = ({navigation}) => {
  const globalState = useSelector(state => state);
  const dispatch = useDispatch();
  const [idUser, setIdUser] = useState(0);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [dataNotif, setDataNotif] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(``);
  const [statusDelete, setStatusDelete] = useState(false);
  const [noPayment, setNoPayment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(deleteAllInventory(globalState.reducer));

    const getData = async () => {
      await axios
        .get('https://cashewwww.000webhostapp.com/api/apiNotifications.php')
        .then(res => {
          setDataNotif(res.data.data.result);
          setLoading(false);
        })
        .catch(err => console.log(err));
    };
    getData();

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
          setLoading(false);
        }
      } catch (e) {
        console.log(e);
      }
    };

    getSession();

    if (statusDelete === true) {
      alert('Item Deleted');
      setStatusDelete(false);
    }
  }, [statusDelete]);

  const dateString = date => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    let dateObject = new Date(date);
    let yearNumber = dateObject.getFullYear();
    let monthNumber = dateObject.getMonth();
    let monthName = monthNames[monthNumber];
    let dateNumber = dateObject.getDate();
    let fullDate = `${yearNumber} ${monthName} ${dateNumber}`;

    return fullDate;
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  let formatDate = date => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const readNotif = async id => {
    const data = `status=read&date=${
      date === '' ? formatDate(new Date()) : date
    }`;

    await axios
      .post(
        `https://cashewwww.000webhostapp.com/api/apiNotifications.php?op=update&id=${id}`,
        data,
      )
      .then(res => {
        console.log(res.data.data.result);
      })
      .catch(err => {
        console.log(err);
      });
  };

  let handleDelete = id => {
    axios
      .post(
        `https://cashewwww.000webhostapp.com/api/apiNotifications.php?op=delete&id=${id}`,
      )
      .then(res => {
        console.log('item deleted');
        setStatusDelete(true);
      })
      .catch(err => {
        console.log('item failed deleted' + err);
      });
  };

  const handleConfirm = date => {
    setDate(formatDate(date));
    hideDatePicker();
  };

  const session_data_notif = async no_payment => {
    try {
      AsyncStorage.setItem('no_payment', no_payment);
    } catch (err) {
      console.log(err);
    }
  };

  const SelectItem = getData => {
    session_data_notif(getData.no_payment);
    navigation.navigate('Detail');
  };

  console.log(noPayment);

  return (
    <View style={styles.Container}>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{color: 'black'}}
      />

      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <View>
          <Arrow
            style={styles.styleArrow}
            width={width * 0.1}
            height={height * 0.05}
          />
        </View>
      </TouchableOpacity>

      <View style={styles.styleBarTop}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={['#FFBB55', '#FFF6DB']}
          style={styles.linearGradient}>
          <Text style={styles.styleTextTop}>Notifications</Text>
        </LinearGradient>
      </View>

      <ScrollView>
        <View style={styles.styleParentsListData}>
          <TouchableOpacity onPress={showDatePicker}>
            <View style={styles.styleDropDown}>
              <Text style={styles.textCategory}>
                {date === ''
                  ? dateString(formatDate(new Date()))
                  : dateString(date)}
              </Text>
              <ArrowBottom
                width={width * 0.05}
                height={height * 0.03}
                style={styles.styleIconArrow}
              />
            </View>
          </TouchableOpacity>

          {(dataNotif || []).map(item => {
            if (formatDate(item.date) === date) {
              if (item.username === username && username.length > 0) {
                readNotif(item.id);
                return (
                  <ListNotif
                    key={item.id}
                    onPressDelete={() => handleDelete(item.id)}
                    date={dateString(item.date)}
                    time={item.time}
                    name={item.cashier_name}
                    desc={item.message}
                    onPressData={() => SelectItem(item)}
                  />
                );
              } else if (item.email === email) {
                readNotif(item.id);
                return (
                  <ListNotif
                    key={item.id}
                    onPressDelete={() => handleDelete(item.id)}
                    date={dateString(item.date)}
                    time={item.time}
                    name={item.cashier_name}
                    desc={item.message}
                    onPressData={() => SelectItem(item)}
                  />
                );
              }
            } else if (formatDate(item.date) === formatDate(new Date())) {
              if (item.username === username) {
                readNotif(item.id);
                return (
                  <ListNotif
                    key={item.id}
                    onPressDelete={() => handleDelete(item.id)}
                    date={dateString(item.date)}
                    time={item.time}
                    name={item.cashier_name}
                    desc={item.message}
                    onPressData={() => SelectItem(item)}
                  />
                );
              } else if (item.email === email) {
                readNotif(item.id);
                return (
                  <ListNotif
                    key={item.id}
                    onPressDelete={() => handleDelete(item.id)}
                    date={dateString(item.date)}
                    time={item.time}
                    name={item.cashier_name}
                    desc={item.message}
                    onPressData={() => SelectItem(item)}
                  />
                );
              }
            }
          })}
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'column',
    flex: 1,
  },
  styleArrow: {
    marginLeft: width * 0.08,
    marginTop: height * 0.03,
  },
  styleBarTop: {
    height: height * 0.1,
    marginTop: height * 0.02,
  },
  styleTextTop: {
    fontFamily: 'Poppins-Bold',
    marginLeft: width * 0.09,
    fontSize: height * 0.035,
    marginTop: height * 0.01,
  },
  styleParentsListData: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  styleContainerDate: {
    height: height * 0.2,
    width: width * 0.8,
    backgroundColor: 'lightblue',
    backgroundColor: 'white',
    marginTop: height * 0.02,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  styleParentsDate: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleTextDate: {
    width: width * 0.6,
  },
  styleDate: {
    fontSize: height * 0.022,
    fontFamily: 'Roboto-Medium',
    marginTop: height * 0.02,
  },
  styleNameDate: {
    fontFamily: 'Poppins-Bold',
    fontSize: height * 0.02,
    marginTop: height * 0.01,
  },
  styleDescDate: {
    fontSize: height * 0.02,
  },
  styleDropDown: {
    width: width * 0.85,
    flexDirection: 'row',
    height: height * 0.07,
    borderRadius: 30,
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  styleIconArrow: {
    marginRight: width * 0.03,
    marginTop: height * 0.0,
  },
  styleDeleteBox: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.25,
  },
  textCategory: {
    marginLeft: width * 0.02,
    marginTop: height * 0.0,
    fontSize: height * 0.02,
  },
});

export default Notifications;
