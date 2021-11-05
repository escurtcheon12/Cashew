import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  scrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  Modal,
  Image,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';

import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';

import Arrow from '../../assets/icons/Arrow.svg';

import axios from 'axios';

import {useDispatch, useSelector} from 'react-redux';
import {deleteAllInventory} from '../../redux/actions';

const Stack = createStackNavigator();

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const Account = ({navigation}) => {
  const globalState = useSelector(state => state);
  const dispatch = useDispatch();
  const [idUser, setIdUser] = useState(0);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [nameImage, setNameImage] = useState('');
  const [allUser, setAlluser] = useState([]);
  const [DataUser, setDataUser] = useState({
    id: 0,
    username: '',
    password: '',
    address: '',
    post_code: 0,
    country: '',
    city: '',
    province: '',
    image: '',
  });
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [openModal, setOpenModal] = useState({
    openModalStatus: false,
    openStatus: '',
  });
  const [wrongPassword, setWrongPass] = useState('');
  const [ImageUri, setImageUri] = useState(null);
  const [dataImage, setDataImage] = useState(null);
  const [featureUpload, setFeatureUpload] = useState(false);
  const [statusUpload, SetStatusUpload] = useState(false);
  const [address, setAddress] = useState(false);

  useEffect(() => {
    dispatch(deleteAllInventory(globalState.reducer));

    const getData = async () => {
      await axios
        .get('https://cashewwww.000webhostapp.com/api/apiUser.php')
        .then(res => {
          setAlluser(res.data.data.result);
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
          setNameImage(value[3][1]);
        }
      } catch (e) {
        console.log(e);
      }
    };

    getSession();

    if (statusUpload === true) {
      Alert.alert('Description', 'Uploading Succesfully', [
        {
          text: '',
          onPress: () => console.log('Cancel Pressed'),
          style: '',
        },
        {text: 'OK', onPress: () => succesUpload()},
      ]);
      SetStatusUpload(false);
    }

    if (address === true) {
      alert('Address has been change');
    }
  }, [statusUpload, address]);

  let search = function (nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].username === nameKey) {
        return myArray[i];
      }
    }
  };

  const onInputChange = (value, input) => {
    setDataUser({
      ...DataUser,
      [input]: value,
    });
  };

  const handleChoosePhoto = option => {
    const options = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
      includeBase64: true,
    };

    option(options, res => {
      if (res.didCancel) {
        console.log('User cancelled');
      } else if (res.error) {
        console.log('ImagePicker error', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button');
      } else {
        const source = {uri: res.assets[0].uri};

        setFeatureUpload(true);
        setImageUri(source);
        setDataImage(res.assets[0].base64);
      }
    });
  };

  let session_update = async imageName => {
    try {
      let keys = [
        ['id_user', String(idUser)],
        ['username', username],
        ['email', email],
        ['imageName', imageName],
      ];

      await AsyncStorage.multiSet(keys);
      console.log('updated');
    } catch (err) {
      console.log(err);
    }
  };

  let succesUpload = async () => {
    await axios
      .get(
        `https://cashewwww.000webhostapp.com/api/apiUser.php?op=detail&id=${idUser}`,
      )
      .then(res => {
        console.log(res.data.data.result);
        session_update(res.data.data.result[0].image);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const placeUpload = async () => {
    setFeatureUpload(false);

    RNFetchBlob.fetch(
      'POST',
      `https://cashewwww.000webhostapp.com/api/apiUser.php?op=uploadImage&id=${idUser}`,
      {
        Authorization: 'Bearer access-token',
        otherHeader: 'foo',
        'Content-Type': 'multipart/form-data',
      },
      [
        {
          name: 'image',
          filename: 'image.png',
          type: 'image/png',
          data: dataImage,
        },
      ],
    );
    SetStatusUpload(true);
  };

  const OpenPhoto = () => {
    if (featureUpload === false) {
      Alert.alert('Uploading Photo', '', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },

        {
          text: 'Gallery',
          onPress: () => handleChoosePhoto(launchImageLibrary),
        },
        {text: 'Camera', onPress: () => handleChoosePhoto(launchCamera)},
      ]);
    } else {
      Alert.alert('Uploading Photo', '', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Upload', onPress: () => placeUpload()},
      ]);
    }
  };

  const handleButtonOpen = (openModalStatus, openStatus) => {
    let i = search(username, allUser);

    setDataUser({
      id: i.id,
      username: i.username,
      password: i.password,
      address: i.address,
      post_code: i.post_code,
      country: i.country,
      city: i.city,
      province: i.province,
    });

    setOpenModal({
      openModalStatus: openModalStatus,
      openStatus: openStatus,
    });
  };

  const handleButton = () => {
    if (openModal.openStatus === 'ChangePassword') {
      const data = `password=${newPassword}`;
      if (password == DataUser.password) {
        axios
          .post(
            `https://cashewwww.000webhostapp.com/api/apiUser.php?op=update&id=${DataUser.id}`,
            data,
          )
          .then(res => {
            setOpenModal({
              openModalStatus: false,
            });
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        setWrongPass('Password or new password wrong');
      }
    } else if (openModal.openStatus === 'ShopAddress') {
      const data = `address=${DataUser.address}&post_code=${DataUser.post_code}&country=${DataUser.country}&city=${DataUser.city}&province=${DataUser.province}`;

      axios
        .post(
          `https://cashewwww.000webhostapp.com/api/apiUser.php?op=update&id=${idUser}`,
          data,
        )
        .then(res => {
          setAddress(true);
          setOpenModal({
            openModalStatus: false,
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const handleCancel = () => {
    setWrongPass('');
    setOpenModal({openModalStatus: false});
  };

  const modalHeaderText = () => {
    if (openModal.openStatus === 'ChangePassword') {
      return (
        <View>
          <Text style={styles.modalTextHeader}>Change Password</Text>
          <Text style={styles.modalTextErr}>{wrongPassword}</Text>
        </View>
      );
    } else if (openModal.openStatus === 'ShopAddress') {
      return (
        <View>
          <Text style={styles.modalTextHeader}>Shop Address</Text>
          <Text style={styles.modalTextErr}>{wrongPassword}</Text>
        </View>
      );
    }
  };

  const modalContent = () => {
    if (openModal.openStatus === 'ChangePassword') {
      return {
        width: width * 0.8,
        height: height * 0.5,
        backgroundColor: 'white',
        borderRadius: 20,
      };
    } else if (openModal.openStatus === 'ShopAddress') {
      return {
        width: width * 0.8,
        height: height * 0.65,
        backgroundColor: 'white',
        borderRadius: 20,
      };
    }
  };

  const modalBodyText = () => {
    if (openModal.openStatus === 'ChangePassword') {
      return (
        <View>
          <TextInput
            style={styles.modalInput}
            placeholder="Password"
            onChangeText={value => setPassword(value)}
            placeholder="Password"
            placeholderTextColor="grey"
          />
          <TextInput
            style={styles.modalInput}
            placeholder="New Password"
            onChangeText={value => setNewPassword(value)}
            placeholder="New Password"
            placeholderTextColor="grey"
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Second New Password"
            placeholderTextColor="grey"
          />
        </View>
      );
    } else if (openModal.openStatus === 'ShopAddress') {
      return (
        <View>
          <TextInput
            style={styles.modalInput}
            placeholder="Address"
            value={DataUser.address}
            onChangeText={value => onInputChange(value, 'address')}
            placeholderTextColor="grey"
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Post Code"
            value={DataUser.post_code}
            onChangeText={value => onInputChange(value, 'post_code')}
            placeholderTextColor="grey"
          />
          <View style={styles.modalDropdown}>
            <Picker
              selectedValue={DataUser.country}
              onValueChange={(itemValue, itemIndex) =>
                onInputChange(itemValue, 'country')
              }>
              <Picker.Item label="Country" value="" />
              <Picker.Item label="Indonesia" value="Indonesia" />
            </Picker>
          </View>
          <TextInput
            style={styles.modalInput}
            placeholder="City"
            value={DataUser.city}
            onChangeText={value => onInputChange(value, 'city')}
            placeholderTextColor="grey"
          />
          <View style={styles.modalDropdown}>
            <Picker
              selectedValue={DataUser.province}
              onValueChange={(itemValue, itemIndex) =>
                onInputChange(itemValue, 'province')
              }>
              <Picker.Item label="Province" value="" />
              <Picker.Item label="West Java" value="westJava" />
            </Picker>
          </View>
        </View>
      );
    }
  };

  const logout = async () => {
    try {
      const keys = ['id', 'username', 'email', 'imageName'];
      await AsyncStorage.multiRemove(keys);

      navigation.navigate('Login');
    } catch (err) {
      console.log(err);
    }
  };

  const textTop = () => {
    if (username === '') {
      return <Text style={styles.styleUsernameProfileEmail}>{email}</Text>;
    } else {
      return <Text style={styles.styleUsernameProfile}>{username}</Text>;
    }
  };

  return (
    <View style={styles.Container}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <View>
          <Arrow
            style={styles.styleArrow}
            width={width * 0.1}
            height={height * 0.05}
          />
        </View>
      </TouchableOpacity>

      <View style={styles.styleparentsProfile}>
        <View style={styles.styleParentsTop}>
          {textTop()}
          <Text style={styles.styleViewEdit}>View and edit your profile</Text>
        </View>

        <View>
          <TouchableOpacity onPress={() => OpenPhoto()}>
            <View>
              <Image
                source={
                  ImageUri === null
                    ? {
                        uri: `https://cashewwww.000webhostapp.com/api/upload/images/${nameImage}`,
                      }
                    : ImageUri
                }
                style={styles.styleImage}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.styleParentsList}>
        <TouchableOpacity
          onPress={() => handleButtonOpen(true, 'ChangePassword')}>
          <View style={styles.styleParentsText}>
            <Text style={styles.styleTextList}>Change Password</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleButtonOpen(true, 'ShopAddress')}>
          <View style={styles.styleParentsText}>
            <Text style={styles.styleTextList}>Shop Address</Text>
          </View>
        </TouchableOpacity>

        <Modal
          transparent
          visible={openModal.openModalStatus}
          animationType="fade">
          <View style={styles.modalBackground}>
            <View style={modalContent()}>
              <View style={styles.modalHeader}>
                <Text style={styles.styleModalText}>{modalHeaderText()}</Text>
              </View>
              <View style={styles.modalBody}>
                <View style={styles.modalParentsInput}>{modalBodyText()}</View>
              </View>
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  onPress={() => handleCancel()}
                  style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleButton()}
                  style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Change</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <TouchableOpacity>
          <View style={styles.styleParentsText}>
            <Text style={styles.styleTextList}>Help Center</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => logout()}>
          <View style={styles.styleParentsText}>
            <Text style={styles.styleTextList}>Logout</Text>
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
  },
  styleArrow: {
    marginLeft: width * 0.07,
    marginTop: height * 0.04,
  },
  styleparentsProfile: {
    flexDirection: 'row',
  },
  styleUsernameProfile: {
    fontSize: height * 0.03,
    fontFamily: 'Poppins-Bold',
    marginLeft: width * 0.08,
    marginTop: height * 0.03,
  },
  styleUsernameProfileEmail: {
    fontSize: height * 0.03,
    fontFamily: 'Poppins-Bold',
    width: width * 0.5,
    marginLeft: width * 0.08,
    marginTop: height * 0.03,
  },
  styleViewEdit: {
    fontSize: height * 0.02,
    fontFamily: 'Montserrat-Black',
    marginLeft: width * 0.08,
  },
  styleImage: {
    height: height * 0.15,
    width: width * 0.3,
    backgroundColor: 'gray',
    borderRadius: 50,
    marginTop: height * 0.01,
    marginLeft: width * 0.1,
  },
  styleParentsText: {
    height: height * 0.07,
    borderBottomWidth: 1,
    borderBottomColor: '#DFE6E9',
    justifyContent: 'center',
    marginTop: height * 0.03,
  },
  styleTextList: {
    fontSize: height * 0.023,
    fontFamily: 'Roboto-Bold',
    marginLeft: width * 0.08,
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
  modalHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.04,
  },
  styleModalText: {
    fontFamily: 'Poppins-Bold',
  },
  modalInput: {
    padding: 10,
    marginTop: height * 0.01,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    fontSize: height * 0.02,
    color: 'black',
  },
  modalDropdown: {
    marginTop: height * 0.02,
    height: height * 0.06,
  },
  modalFooter: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginTop: height * 0.01,
  },
  modalButton: {
    marginTop: 10,
    marginRight: 25,
    height: height * 0.05,
    width: width * 0.3,
    backgroundColor: '#FECE79',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  modalButtonText: {
    color: 'black',
    fontSize: height * 0.02,
  },
  modalTextHeader: {
    fontSize: height * 0.025,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  modalTextErr: {
    textAlign: 'center',
    color: 'red',
  },
  styleParentsTop: {
    width: width * 0.5,
  },
});

export default Account;
