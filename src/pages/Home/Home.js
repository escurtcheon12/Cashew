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
  Alert,
  Modal,
} from 'react-native';

import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import Logo from '../../assets/icons/Cashew.svg';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

import Account from '../../assets/icons/Account.svg';
import IconHome from '../../assets/icons/Home.svg';
import IconNotification from '../../assets/icons/Notification.svg';
import IconInventory from '../../assets/icons/Inventory.svg';
import {Picker} from '@react-native-picker/picker';

import axios from 'axios';

import {useDispatch, useSelector} from 'react-redux';

import {deleteAllInventory} from '../../redux/actions';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const Stack = createStackNavigator();
const Home = ({navigation}) => {
  const globalState = useSelector(state => state);
  const dispatch = useDispatch();
  const [list_shift, setAllShift] = useState([]);
  const [idShift, setIdShift] = useState(0);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [selectShift, setSelectShift] = useState('');
  const [nameShift, setNameShift] = useState('');
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState({
    openModalStatus: false,
    openStatus: 'start',
  });
  const [randomNumber, setRandomNumber] = useState('');
  const [timeShift, setTimeShift] = useState(false);
  const [buttonStart, setButtonStart] = useState(false);
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
          setLoading(false);
          setUsername(value[1][1]);
          setEmail(value[2][1]);
        }
      } catch (e) {
        setLoading(true);
        console.log(e);
      }
    };
    getSession();

    const getList = async () => {
      await axios
        .get('https://cashewwww.000webhostapp.com/api/apiShift.php')
        .then(res => {
          setAllShift(res.data.data.result);
          setLoading(false);
        })
        .catch(err => {
          setLoading(true);
          console.log(err);
        });
    };

    getList();

    const AllNotif = async () => {
      await axios
        .get(
          `https://cashewwww.000webhostapp.com/api/apiNotifications.php?op=countUnread`,
        )
        .then(res => {
          setGetAllNotif(res.data.data.result.toString());
        })
        .catch(err => {
          setLoading(true);
          console.log(`err ${err}`);
        });
    };
    AllNotif();

    const randomAlphabet = length => {
      let result = '';
      let characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength),
        );
      }
      return result;
    };

    const randomNumber =
      randomAlphabet(1) + Math.floor(Math.random() * (999 - 100 + 1) + 100);
    setRandomNumber(randomNumber);

    navigation.addListener('focus', () => {
      dispatch(deleteAllInventory(globalState.reducer));
    });

    if (timeShift === true) {
      setTimeShift(false);
    }
  }, [timeShift, getAllNotif]);

  let formatDate = date => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  let search = function (nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].name_shift === nameKey) {
        return myArray[i];
      }
    }
  };

  const startTimer = () => {
    const data = `username=${username}&email=${email}&name_shift=${nameShift}&shift_order=${selectShift}&working_hours=${new Date().toLocaleTimeString()}&date=${formatDate(
      new Date(),
    )}&no_shift=${randomNumber}`;
    axios
      .post(
        `https://cashewwww.000webhostapp.com/api/apiShift.php?op=create`,
        data,
      )
      .then(res => {
        setLoading(false);
        console.log('succes');
      })
      .catch(err => {
        console.log(err);
      });
  };

  const stopTimer = id => {
    const data = `finishing_work_hours=${new Date().toLocaleTimeString()}&date=${formatDate(
      new Date(),
    )}`;
    axios
      .post(
        `https://cashewwww.000webhostapp.com/api/apiShift.php?op=update&id=${id}`,
        data,
      )
      .then(res => {
        setLoading(false);
        console.log('succes');
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleCancelStart = () => {
    setOpenModal({
      openModalStatus: false,
      openStatus: 'start',
    });
    setButtonStart(false);
  };

  const handleCancelStop = () => {
    setOpenModal({
      openModalStatus: false,
      openStatus: 'end',
    });
    setButtonStart(true);
  };

  const start_shift = () => {
    if (nameShift !== '' && selectShift !== '') {
      startTimer();
      setOpenModal({openModalStatus: false, openStatus: 'end'});
      setTimeShift(true);
      setButtonStart(true);
    } else {
      alert('Please Fill All');
    }
  };

  const handleFindIndex = () => {
    let i = search(nameShift, list_shift);
    setIdShift(i.id);
    setOpenModal({openModalStatus: true});
  };

  const stop_shift = () => {
    stopTimer(idShift);
    setOpenModal({openModalStatus: false, openStatus: 'start'});
    setNameShift('');
    setSelectShift('');
    setTimeShift(false);
    setButtonStart(false);
  };

  const buttonShift = () => {
    if (openModal.openStatus === 'start') {
      return (
        <TouchableOpacity
          style={styles.styleSquareMenuShift}
          onPress={() =>
            setOpenModal({
              openModalStatus: true,
            })
          }>
          <View style={styles.styleSquareIcon} />
          <Text style={styles.styleTextMenu}>Start Shift</Text>
        </TouchableOpacity>
      );
    } else if (openModal.openStatus === 'end') {
      return (
        <TouchableOpacity
          style={styles.styleSquareMenuRun}
          onPress={() => handleFindIndex()}>
          <View style={styles.styleSquareIcon} />
          <Text style={styles.styleTextMenu}>Stop Shift</Text>
        </TouchableOpacity>
      );
    }
  };

  const ModalBody = () => {
    if (buttonStart === false) {
      return (
        <View style={styles.modalParentsInput}>
          <TextInput
            style={styles.modalInput}
            placeholder="Name"
            onChangeText={value => setNameShift(value)}
            placeholderTextColor="grey"
          />
          <View style={styles.modalShift}>
            <Picker
              selectedValue={selectShift}
              style={styles.stylePicker}
              onValueChange={(itemValue, itemIndex) =>
                setSelectShift(itemValue)
              }>
              <Picker.Item label="Select Shift" value="" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6" value="6" />
              <Picker.Item label="7" value="7" />
              <Picker.Item label="8" value="8" />
              <Picker.Item label="9" value="9" />
              <Picker.Item label="10" value="10" />
            </Picker>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.modalParentsInput}>
          <TextInput
            style={styles.modalInput}
            placeholder="Name"
            value={nameShift}
            onChangeText={value => setNameShift(value)}
          />
          <View style={styles.modalShift}>
            <Picker
              selectedValue={selectShift}
              onValueChange={(itemValue, itemIndex) =>
                setSelectShift(itemValue)
              }>
              <Picker.Item label="Select Shift" value="" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6" value="6" />
              <Picker.Item label="7" value="7" />
              <Picker.Item label="8" value="8" />
              <Picker.Item label="9" value="9" />
              <Picker.Item label="10" value="10" />
            </Picker>
          </View>
        </View>
      );
    }
  };

  const buttonModal = () => {
    if (buttonStart === false) {
      return (
        <View style={styles.modalFooter}>
          <TouchableOpacity
            onPress={() => handleCancelStart()}
            style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => start_shift()}
            style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Start Shift</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.modalFooter}>
          <TouchableOpacity
            onPress={() => handleCancelStop()}
            style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => stop_shift()}
            style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Stop Shift</Text>
          </TouchableOpacity>
        </View>
      );
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

      <View style={styles.styleParentMenu}>
        <TouchableOpacity onPress={() => navigation.navigate('EditFoods')}>
          <View style={styles.styleSquareMenu}>
            <View style={styles.styleSquareIcon} />
            <Text style={styles.styleTextMenu}>Edit Menu</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('TransactionsFood')}>
          <View style={styles.styleSquareMenu}>
            <View style={styles.styleSquareIcon} />
            <Text style={styles.styleTextMenu}>Transaction</Text>
          </View>
        </TouchableOpacity>

        {buttonShift()}
      </View>

      <Modal
        transparent
        visible={openModal.openModalStatus}
        animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalSize}>
            <View style={styles.modalHeader}>
              <Text style={styles.styleModalText}>Add Shift</Text>
            </View>
            <View style={styles.modalBody}>{ModalBody()}</View>

            {buttonModal()}
          </View>
        </View>
      </Modal>

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
    backgroundColor: '#FFF6DB',
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
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    padding: 15,
  },
  modalFooter: {
    marginLeft: width * 0.03,
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: height * 0.01,
  },
  modalButton: {
    marginTop: height * 0.02,
    marginRight: width * 0.05,
    height: height * 0.05,
    width: width * 0.3,
    backgroundColor: '#FECE79',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  modalButtonDelete: {
    marginTop: height * 0.03,
    marginLeft: width * 0.01,
    height: 0.1 * width,
    width: 0.5 * width,
    backgroundColor: '#FF0303',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  modalButtonText: {
    color: 'black',
    fontSize: height * 0.02,
  },
  modalTextHeader: {
    fontSize: height * 0.3,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  modalTextErr: {
    textAlign: 'center',
    color: 'red',
  },
  modalSize: {
    width: 0.85 * width,
    height: 0.45 * height,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  styleModalText: {
    fontFamily: 'Poppins-Bold',
    fontSize: height * 0.02,
  },
  modalHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.03,
  },
  modalInput: {
    padding: height * 0.01,
    marginTop: height * 0.03,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    fontSize: height * 0.02,
    color: 'black',
  },
  modalShift: {
    padding: height * 0.01,
    marginTop: height * 0.03,
  },
  styleStopWatch: {
    marginTop: height * 0.05,
  },
  stylePicker: {
    fontSize: height * 0.01,
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

export default Home;
