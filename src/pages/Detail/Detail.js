import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  ToastAndroid,
  DeviceEventEmitter,
  Switch,
  NativeAppEventEmitter,
  Platform,
  Button,
  Modal,
} from 'react-native';

import 'react-native-gesture-handler';

import {createStackNavigator} from '@react-navigation/stack';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';

import {useDispatch, useSelector} from 'react-redux';

import Account from '../../assets/icons/Account.svg';
import IconHome from '../../assets/icons/Home.svg';
import IconNotification from '../../assets/icons/Notification.svg';
import IconInventory from '../../assets/icons/Inventory.svg';
import Trash from '../../assets/icons/Trash.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BluetoothManager,
  BluetoothEscposPrinter,
  BluetoothTscPrinter,
} from 'react-native-bluetooth-escpos-printer';

const Stack = createStackNavigator();

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const Detail = ({navigation}) => {
  let _listeners = [];

  const globalState = useSelector(state => state);
  const [dataNoPayment, setDataNoPayment] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [dataPayment, setDataPayment] = useState({
    CashName: '',
    CustName: '',
    Email: '',
    PaymentMethod: '',
    TOP: '',
  });
  const [openModal, setOpenModal] = useState(false);

  const [changeButton, setChangeButton] = useState('OK');
  const [randomNoPayment, setRandomNoPayment] = useState('');
  const [getAllNotif, setGetAllNotif] = useState(0);
  const [noPayment, setNoPayment] = useState('');
  const [devices, setDevices] = useState(null);
  const [pairedDs, setPairedDs] = useState([]);
  const [foundDs, setFoundDs] = useState([]);
  const [bleOpend, setBleOpend] = useState(false);
  const [boundAddress, setBoundAddress] = useState('');
  const [debugMsg, setDebugMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDataNoPayment = async () => {
      await axios
        .get('https://cashewwww.000webhostapp.com/api/apiTransactions.php')
        .then(res => {
          setDataNoPayment(res.data.data.result);
          setLoading(false);
        })
        .catch(err => {
          setLoading(true);
          console.log(err);
        });
    };

    getDataNoPayment();

    const getSession = async () => {
      try {
        const value = await AsyncStorage.multiGet([
          'id_user',
          'username',
          'email',
          'imageName',
        ]);
        if (value !== null) {
          value[1][1] === '' ? console.log('kosong') : setUsername(value[1][1]);
          setEmail(value[2][1]);
          setLoading(false);
        }
      } catch (e) {
        setLoading(true);
        console.log(e);
      }
    };

    getSession();

    let getDataPayment = async () => {
      try {
        let value = await AsyncStorage.multiGet([
          'CashName',
          'CustName',
          'Email',
          'PaymentMethod',
          'TOP',
        ]);
        console.log(value);
        setDataPayment({
          CashName: value[0][1],
          CustName: value[1][1],
          Email: value[2][1],
          PaymentMethod: value[3][1],
          TOP: value[4][1],
        });
        setLoading(false);
      } catch (err) {
        setLoading(true);
        console.log(err);
      }
    };
    getDataPayment();

    let getDataNotif = async () => {
      try {
        let value = await AsyncStorage.getItem('no_payment');
        setNoPayment(value);
        value === null ? console.log('OK') : setChangeButton('Print');
        console.log(value);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    getDataNotif();

    BluetoothManager.isBluetoothEnabled().then(
      enabled => {
        setBleOpend(Boolean(enabled));
        setLoading(false);
      },
      err => {
        err;
      },
    );

    if (Platform.OS === 'android') {
      _listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
          rsp => {
            _deviceAlreadPaired(rsp);
          },
        ),
      );
      _listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_FOUND,
          rsp => {
            _deviceFoundEvent(rsp);
          },
        ),
      );
      _listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_CONNECTION_LOST,
          () => {
            setBoundAddress('');
            // this.setState({
            //   name: '',
            //   boundAddress: '',
            // });
          },
        ),
      );
      _listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT,
          () => {
            ToastAndroid.show(
              'Device Not Support Bluetooth !',
              ToastAndroid.LONG,
            );
          },
        ),
      );
    }

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
    setRandomNoPayment(randomNumber);

    navigation.addListener('focus', () => {
      getDataNoPayment();
      getSession();
      getDataPayment();
      getDataNotif();
      AllNotif();
    });
  }, [getAllNotif]);

  const sendNotification = (channel, theme, message) => {
    PushNotification.localNotification({
      channelId: channel,
      title: theme,
      message: message,
    });
  };

  const sendNotificationSchedule = (channel, theme, message) => {
    PushNotification.localNotificationSchedule({
      channelId: channel,
      message: message,
      date: new Date(Date.now() + 60 * 1000),
      title: theme,
      allowWhileIdle: false,
      repeatTime: 1,
    });
  };

  const buttonNotif = () => {
    navigation.navigate('Notifications');
  };

  const _deviceAlreadPaired = rsp => {
    var ds = null;
    if (typeof rsp.devices == 'object') {
      ds = rsp.devices;
    } else {
      try {
        ds = JSON.parse(rsp.devices);
      } catch (e) {}
    }
    if (ds && ds.length) {
      let pared = pairedDs;
      pared = pared.concat(ds || []);
      setPairedDs(pared);
    }
  };

  const _deviceFoundEvent = rsp => {
    //alert(JSON.stringify(rsp))
    var r = null;
    try {
      if (typeof rsp.device == 'object') {
        r = rsp.device;
      } else {
        r = JSON.parse(rsp.device);
      }
    } catch (e) {
      //alert(e.message);
      //ignore
    }
    //alert('f')
    if (r) {
      let found = foundDs || [];
      if (found.findIndex) {
        let duplicated = found.findIndex(function (x) {
          return x.address == r.address;
        });
        //CHECK DEPLICATED HERE...
        if (duplicated == -1) {
          found.push(r);
          setFoundDs(found);
        }
      }
    }
  };

  const _renderRow = rows => {
    let items = [];
    for (let i in rows) {
      let row = rows[i];
      if (row.address) {
        items.push(
          <TouchableOpacity
            key={new Date().getTime() + i}
            style={styles.wtf}
            onPress={() => {
              setLoading(true);
              BluetoothManager.connect(row.address).then(
                s => {
                  setLoading(false);
                  setBoundAddress(row.address);

                  // name: row.name || 'UNKNOWN',
                },
                e => {
                  setLoading(false);
                  alert(e);
                },
              );
            }}>
            <Text style={styles.name}>{row.name || 'UNKNOWN'}</Text>
            <Text style={styles.address}>{row.address}</Text>
          </TouchableOpacity>,
        );
      }
    }
    return items;
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

  const totalMenu = () => {
    let textMenu = '';
    if (noPayment === null) {
      (globalState.reducer || []).map(item => {
        if (item.item > 0) textMenu += item.item + ' ' + ' ' + item.menu + ' ';
      });
    } else {
      (dataNoPayment || []).map(item => {
        if (item.no_payment === noPayment)
          if (item.item > 0)
            textMenu += item.item + ' ' + ' ' + item.menu + ' ';
      });
    }
    return textMenu;
  };

  const totalPrice = () => {
    let textMenu = 0;
    if (noPayment === null) {
      (globalState.reducer || []).map(item => {
        if (item.item > 0) textMenu += item.item * parseInt(item.price);
      });
    } else {
      (dataNoPayment || []).map(item => {
        if (item.no_payment === noPayment)
          if (item.item > 0) textMenu += item.item * parseInt(item.price);
      });
    }
    return textMenu;
  };

  const clickButton = () => {
    let total = 0;

    if (changeButton === 'OK') {
      if (dataPayment.TOP === '') {
        const dataNotif = `username=${username}&email=${email}&cashier_name=${
          dataPayment.CashName
        }&message=${
          dataPayment.CustName
        }, Memesan ${totalMenu()} RP ${totalPrice()}, Transaksi Berhasil&status=unread&date=${formatDate(
          new Date(),
        )}&time=${new Date().toLocaleTimeString()}&no_payment=${randomNoPayment}`;

        axios
          .post(
            `https://cashewwww.000webhostapp.com/api/apiNotifications.php?op=create`,
            dataNotif,
          )
          .then(res => {
            console.log(`succes ${res}`);
            setOpenModal(true);
            setChangeButton('Print');
          })
          .catch(err => {
            console.log(`err ${err}`);
          });

        sendNotification(
          '1',
          'Cashew',
          `${
            dataPayment.CustName
          }, Memesan ${totalMenu()} RP ${totalPrice()}, Transaksi Berhasil`,
        );
      } else {
        const dataNotif = `username=${username}&email=${email}&cashier_name=${
          dataPayment.CashName
        }&message=${
          dataPayment.CustName
        }, Memesan ${totalMenu()} RP ${totalPrice()} Pembayaran Tempo Sampai ${
          dataPayment.TOP
        }, Transaksi Berhasil&status=unread&date=${formatDate(
          new Date(),
        )}&time=${new Date().toLocaleTimeString()}&no_payment=${randomNoPayment}`;

        axios
          .post(
            `https://cashewwww.000webhostapp.com/api/apiNotifications.php?op=create`,
            dataNotif,
          )
          .then(res => {
            console.log(`succes ${res}`);
            setChangeButton('Print');
          })
          .catch(err => {
            console.log(`err ${err}`);
          });

        (globalState.reducer || []).map(item => {
          const dataTempo = `username=${username}&email=${email}&cashier_name=${
            dataPayment.CashName
          }&customer_name=${
            dataPayment.CustName
          }&no_payment=${randomNoPayment}&menu=${item.menu}&item=${
            item.item
          }&price=${item.price}&date=${formatDate(new Date())}&deadline_date=${
            dataPayment.TOP
          }`;

          axios
            .post(
              `https://cashewwww.000webhostapp.com/api/apiPaymentTempo.php?op=create`,
              dataTempo,
            )
            .then(res => {
              console.log(`succes ${res}`);
              setChangeButton('Print');
            })
            .catch(err => {
              console.log(`err ${err}`);
            });
        });

        sendNotification(
          '1',
          'Cashew',
          `${
            dataPayment.CustName
          }, Memesan ${totalMenu()} RP ${totalPrice()} Pembayaran Tempo Sampai ${
            dataPayment.TOP
          }, Transaksi Berhasil`,
        );
      }

      (globalState.reducer || []).map(item => {
        const dataTransactions = `username=${username}&email=${email}&no_payment=${randomNoPayment}&menu=${
          item.menu
        }&item=${(total += item.item)}&price=${item.price}&date=${formatDate(
          new Date(),
        )}`;

        axios
          .post(
            `https://cashewwww.000webhostapp.com/api/apiTransactions.php?op=create`,
            dataTransactions,
          )
          .then(res => {
            console.log(`succes ${res}`);
          })
          .catch(err => {
            console.log(`err ${err}`);
          });
      });
    } else {
      setOpenModal(true);
    }
  };

  const handleCancelModal = () => {
    setOpenModal(false);
  };

  console.log(noPayment);

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

      <ScrollView>
        <View style={styles.styleMain}>
          <View style={styles.styleMenu}>
            <Text style={styles.styleText}>Menu</Text>
            {noPayment === null
              ? (globalState.reducer || []).map(item => {
                  if (item.item > 0)
                    return (
                      <Text key={item.id} style={styles.styleValue}>
                        {item.menu}
                      </Text>
                    );
                })
              : (dataNoPayment || []).map(item => {
                  if (item.no_payment === noPayment)
                    if (item.item > 0)
                      return (
                        <Text key={item.id} style={styles.styleValue}>
                          {item.menu}
                        </Text>
                      );
                })}
            <Text style={styles.styleResult}>Total</Text>
          </View>
          <View style={styles.styleItem}>
            <Text style={styles.styleText}>Item</Text>
            {noPayment === null
              ? (globalState.reducer || []).map(item => {
                  if (item.item > 0)
                    return (
                      <Text key={item.id} style={styles.styleValue}>
                        {item.item}
                      </Text>
                    );
                })
              : (dataNoPayment || []).map(item => {
                  if (item.no_payment === noPayment)
                    if (item.item > 0)
                      return (
                        <Text key={item.id} style={styles.styleValue}>
                          {item.item}
                        </Text>
                      );
                })}
          </View>
          <View style={styles.stylePrice}>
            <Text style={styles.styleText}>Price</Text>
            {noPayment === null
              ? (globalState.reducer || []).map(item => {
                  if (item.item > 0)
                    return (
                      <Text key={item.id} style={styles.styleValue}>
                        Rp. {item.price * item.item}
                      </Text>
                    );
                })
              : (dataNoPayment || []).map(item => {
                  if (item.no_payment === noPayment)
                    if (item.item > 0)
                      return (
                        <Text key={item.id} style={styles.styleValue}>
                          Rp. {item.price}
                        </Text>
                      );
                })}
            <Text style={styles.styleResult}>Rp. {totalPrice()}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.styleParentsStruk}>
        <TouchableOpacity
          style={styles.styleButtonStruk}
          onPress={() => clickButton()}>
          <Text style={styles.styleStruk}>{changeButton}</Text>
        </TouchableOpacity>
      </View>

      <Modal transparent visible={openModal} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalSize}>
            <View style={styles.modalHeader}>
              <Text style={styles.styleModalText}>Print</Text>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.styleParentsBody}>
                <ScrollView>
                  <Text>{debugMsg}</Text>
                  <Text style={styles.title}>
                    Blutooth Opended:{bleOpend ? 'true' : 'false'}{' '}
                  </Text>
                  <Text>Open BLE Before Scanning</Text>

                  <Switch
                    value={bleOpend}
                    onValueChange={v => {
                      setLoading(true);
                      if (!v) {
                        BluetoothManager.disableBluetooth().then(
                          () => {
                            setBleOpend(false);
                            setLoading(false);
                            setFoundDs([]);
                            setPairedDs([]);
                          },
                          err => {
                            alert(err);
                          },
                        );
                      } else {
                        BluetoothManager.enableBluetooth().then(
                          r => {
                            var paired = [];
                            if (r && r.length > 0) {
                              for (var i = 0; i < r.length; i++) {
                                try {
                                  paired.push(JSON.parse(r[i]));
                                } catch (e) {
                                  //ignore
                                }
                              }
                            }
                            setBleOpend(true);
                            setLoading(false);
                            setPairedDs(paired);
                          },
                          err => {
                            setLoading(false);
                            alert(err);
                          },
                        );
                      }
                    }}
                  />

                  <View style={styles.buttonScan}>
                    <Button
                      disabled={loading || !bleOpend}
                      color="#FECE79"
                      onPress={() => _scan()}
                      title="Scan"
                    />
                  </View>

                  <View style={styles.styleTextModal}>
                    <Text style={styles.title}>Connected:</Text>
                    <Text style={styles.title}>Found(tap to connect):</Text>
                    {loading ? <ActivityIndicator animating={true} /> : null}
                    <View style={{flex: 1, flexDirection: 'column'}}>
                      {_renderRow(foundDs)}
                    </View>
                    <Text style={styles.title}>Paired:</Text>
                    {loading ? <ActivityIndicator animating={true} /> : null}
                    <View style={{flex: 1, flexDirection: 'column'}}>
                      {_renderRow(pairedDs)}
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        paddingVertical: 30,
                      }}>
                      {/* <Button
                      disabled={
                        loading || !(bleOpend && boundAddress.length > 0)
                      }
                      color="#FECE79"
                      title="ESC/POS"
                      onPress={() => {
                        this.props.navigator.push({
                          component: EscPos,
                          passProps: {
                            boundAddress: boundAddress,
                          },
                        });
                      }}
                    />
                    <Button
                      disabled={
                        loading || !(bleOpend && boundAddress.length > 0)
                      }
                      title="TSC"
                      onPress={() => {
                        navigator.push({
                          component: Tsc,
                          passProps: {
                            // name: name,
                            boundAddress: boundAddress,
                          },
                        });
                      }}
                    /> */}
                    </View>
                  </View>
                </ScrollView>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                onPress={() => handleCancelModal()}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>CANCEL</Text>
              </TouchableOpacity>

              <View style={styles.modalPrint}>
                <Button
                  disabled={loading || boundAddress.length <= 0}
                  color="#FECE79"
                  title="Print"
                  onPress={async () => {
                    try {
                      await BluetoothEscposPrinter.printerAlign(
                        BluetoothEscposPrinter.ALIGN.CENTER,
                      );
                      await BluetoothEscposPrinter.printText(
                        noPayment === null
                          ? randomNoPayment
                          : noPayment + '\r\n',
                        {
                          encoding: 'GBK',
                          codepage: 0,
                          widthtimes: 3,
                          heigthtimes: 3,
                          fonttype: 0.5,
                        },
                      );

                      await BluetoothEscposPrinter.printText('\r\n', {});

                      await BluetoothEscposPrinter.printerAlign(
                        BluetoothEscposPrinter.ALIGN.LEFT,
                      );
                      await BluetoothEscposPrinter.printText(
                        'Date: ' +
                          formatDate(new Date()) +
                          ', ' +
                          new Date().toLocaleTimeString() +
                          '\r\n',
                        {},
                      );
                      await BluetoothEscposPrinter.printText(
                        '--------------------------------\r\n',
                        {},
                      );
                      let columnWidths = [12, 8, 12];

                      await BluetoothEscposPrinter.printColumn(
                        columnWidths,
                        [
                          BluetoothEscposPrinter.ALIGN.LEFT,
                          BluetoothEscposPrinter.ALIGN.CENTER,
                          BluetoothEscposPrinter.ALIGN.RIGHT,
                        ],
                        ['Menu', 'Item', 'Price'],
                        {},
                      );

                      await BluetoothEscposPrinter.printText('\r\n', {});

                      noPayment === null
                        ? await (globalState.reducer || []).map(item => {
                            if (item.item > 0)
                              BluetoothEscposPrinter.printColumn(
                                columnWidths,
                                [
                                  BluetoothEscposPrinter.ALIGN.LEFT,
                                  BluetoothEscposPrinter.ALIGN.CENTER,
                                  BluetoothEscposPrinter.ALIGN.RIGHT,
                                ],
                                [
                                  `${item.menu}`,
                                  `${item.item}`,
                                  `Rp. ${item.price}`,
                                ],
                                {},
                              );
                          })
                        : await (dataNoPayment || []).map(item => {
                            if (item.item > 0 && noPayment === item.no_payment)
                              BluetoothEscposPrinter.printColumn(
                                columnWidths,
                                [
                                  BluetoothEscposPrinter.ALIGN.LEFT,
                                  BluetoothEscposPrinter.ALIGN.CENTER,
                                  BluetoothEscposPrinter.ALIGN.RIGHT,
                                ],
                                [
                                  `${item.menu}`,
                                  `${item.item}`,
                                  `Rp. ${item.price}`,
                                ],
                                {},
                              );
                          });

                      await BluetoothEscposPrinter.printText(
                        '--------------------------------\r\n',
                        {},
                      );

                      await BluetoothEscposPrinter.printColumn(
                        columnWidths,
                        [
                          BluetoothEscposPrinter.ALIGN.LEFT,
                          BluetoothEscposPrinter.ALIGN.CENTER,
                          BluetoothEscposPrinter.ALIGN.RIGHT,
                        ],
                        ['Total', ' ', `Rp. ${totalPrice()}`],
                        {},
                      );
                      await BluetoothEscposPrinter.printText('\r\n', {});
                      await BluetoothEscposPrinter.printerAlign(
                        BluetoothEscposPrinter.ALIGN.CENTER,
                      );
                      await BluetoothEscposPrinter.printText(
                        'Terimakasih\r\n\r\n\r\n',
                        {},
                      );
                      await BluetoothEscposPrinter.printerAlign(
                        BluetoothEscposPrinter.ALIGN.LEFT,
                      );
                      await BluetoothEscposPrinter.printText(
                        '\r\n\r\n\r\n',
                        {},
                      );
                    } catch (e) {
                      alert(e.message || 'ERROR');
                    }
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.styleFooter}>
        <TouchableOpacity
          onPress={() => buttonNotif()}
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

const _scan = () => {
  BluetoothManager.scanDevices().then(
    s => {
      var ss = s;
      var found = ss.found;
      try {
        found = JSON.parse(found);
      } catch (e) {
        //ignore
      }
      var fds = foundDs;
      if (found && found.length) {
        fds = found;
      }
      setFoundDs(fds);
      setLoading(false);
    },
    er => {
      setLoading(false);
      alert('error' + JSON.stringify(er));
    },
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
    borderRadius: 30,
    flexDirection: 'row',
  },
  styleMenu: {
    flex: 1,
    borderRightColor: 'black',
    borderRightWidth: 1,
    alignItems: 'center',
  },
  styleItem: {
    flex: 1,
    alignItems: 'center',
  },
  stylePrice: {
    flex: 1,
    borderLeftColor: 'black',
    borderLeftWidth: 1,
    alignItems: 'center',
  },
  styleText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 25,
    color: '#935218',
    marginTop: height * 0.015,
    fontSize: height * 0.03,
  },
  styleButtonStruk: {
    width: width * 0.35,
    height: height * 0.08,
    borderRadius: 15,
    backgroundColor: '#935218',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: height * 0.15,
    left: width * 0.33,
  },
  styleStruk: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: height * 0.035,
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
  styleValue: {
    fontSize: height * 0.02,
  },
  styleResult: {
    fontFamily: 'Poppins-Bold',
    fontSize: height * 0.025,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    padding: height * 0.02,
  },
  modalFooter: {
    marginLeft: width * 0.03,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  modalButton: {
    marginRight: width * 0.05,
    height: height * 0.05,
    width: width * 0.2,
    backgroundColor: '#FECE79',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalPrint: {
    marginRight: width * 0.05,
    height: height * 0.05,
    width: width * 0.3,
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
    color: 'white',
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
    height: 0.7 * height,
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
  styleTextModal: {
    marginTop: height * 0.02,
  },
  buttonScan: {
    marginTop: height * 0.01,
  },
});

export default Detail;
