import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  CheckBox,
  Dimensions,
} from 'react-native';

import {Picker} from '@react-native-picker/picker';

import 'react-native-gesture-handler';

import {createStackNavigator} from '@react-navigation/stack';

import Account from '../../assets/icons/Account.svg';
import IconHome from '../../assets/icons/Home.svg';
import IconNotification from '../../assets/icons/Notification.svg';
import IconInventory from '../../assets/icons/Inventory.svg';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const Stack = createStackNavigator();

const TransactionPayment = ({navigation}) => {
  const [orderName, setOrderName] = useState({
    CashName: '',
    CustName: '',
    Email: '',
    PaymentMethod: 'Cash',
  });
  const [date, setDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [getAllNotif, setGetAllNotif] = useState(0);

  useEffect(() => {
    const getItem = async () => {
      try {
        await AsyncStorage.multiRemove([
          'CashName',
          'CustName',
          'Email',
          'PaymentMethod',
        ]);
      } catch (err) {
        console.log(err);
      }
    };

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

    const getNoPayment = async () => {
      try {
        await AsyncStorage.getItem('no_payment');
      } catch (err) {
        console.log(err);
      }
    };

    const removeNoPayment = async () => {
      try {
        await AsyncStorage.removeItem('no_payment');
      } catch (err) {
        console.log(err);
      }
    };

    navigation.addListener('focus', () => {
      getItem();
      getNoPayment();
      removeNoPayment();
    });
  }, [getAllNotif]);

  const onInputChange = (value, input) => {
    setOrderName({
      ...orderName,
      [input]: value,
    });
  };

  const handleOK = async () => {
    if (
      orderName.CashName &&
      orderName.CustName &&
      orderName.Email &&
      orderName.PaymentMethod
    ) {
      try {
        let keys = [
          ['CashName', orderName.CashName],
          ['CustName', orderName.CustName],
          ['Email', orderName.Email],
          ['PaymentMethod', orderName.PaymentMethod],
          ['TOP', date],
        ];
        await AsyncStorage.multiSet(keys);
        navigation.navigate('Detail');
      } catch (err) {
        console.log(err);
      }
    } else {
      alert('Input should fill');
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const formatDate = date => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const handleConfirm = date => {
    setDate(formatDate(date));
    hideDatePicker();
  };

  console.log(orderName);

  return (
    <View style={styles.Container}>
      <View style={styles.styleNav}>
        <Text style={styles.HeadlineText}> Cashew </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Account')}
          style={styles.styleAccount}>
          <View style={styles.styleCircleAccount}>
            <Account width={width * 0.1} height={height * 0.05} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.styleMain}>
        <View style={styles.styleContainerInput}>
          <View style={styles.styleParentsInput}>
            <Text style={styles.styleTextInput}>Waiter/Cashier Name</Text>
            <TextInput
              style={styles.styleInput}
              onChangeText={value => onInputChange(value, 'CashName')}
              placeholderTextColor="grey"
            />
          </View>

          <View style={styles.styleParentsInput}>
            <Text style={styles.styleTextInput}>Customer Name</Text>
            <TextInput
              style={styles.styleInput}
              onChangeText={value => onInputChange(value, 'CustName')}
              placeholderTextColor="grey"
            />
          </View>

          <View style={styles.styleParentsInput}>
            <Text style={styles.styleTextInput}>Email</Text>
            <TextInput
              style={styles.styleInput}
              onChangeText={value => onInputChange(value, 'Email')}
              placeholderTextColor="grey"
            />
          </View>

          <View style={styles.styleParentsInput}>
            <Text style={styles.styleTextInput}>Payment Method</Text>
            <View style={styles.styleInput}>
              <Picker
                selectedValue={orderName.PaymentMethod}
                onValueChange={(itemValue, itemIndex) =>
                  onInputChange(itemValue, 'PaymentMethod')
                }>
                <Picker.Item label="Cash" value="Cash" />
                <Picker.Item label="OVO" value="OVO" />
                <Picker.Item label="DANA" value="DANA" />
                <Picker.Item label="GOPAY" value="GOPAY" />
                <Picker.Item label="Credit/Debit Card" value="Credit" />
              </Picker>
            </View>
          </View>

          <View style={styles.styleParentsInput}>
            <Text style={styles.styleTextInput}>Term of Payment</Text>
            <TouchableOpacity onPress={showDatePicker}>
              <View style={styles.styleInput}>
                <Text style={styles.styleDate}>{date}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => handleOK()}
            style={styles.styleButton}>
            <Text style={styles.styleTextOK}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

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
  styleContainerInput: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleTextInput: {
    fontFamily: 'Poppins-Medium',
    color: '#935218',
    fontSize: height * 0.02,
    marginBottom: 6,
    marginTop: height * 0.03,
  },
  styleInput: {
    width: width * 0.8,
    height: height * 0.053,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    paddingLeft: 10,
    fontSize: height * 0.02,
    paddingLeft: width * 0.02,
    color: 'black',
  },
  styleButton: {
    width: width * 0.25,
    height: height * 0.08,
    backgroundColor: '#FECE79',
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 39,
  },
  styleTextOK: {
    fontFamily: 'Poppins-Bold',
    fontSize: height * 0.03,
  },
  styleDate: {
    fontSize: height * 0.02,
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

export default TransactionPayment;
