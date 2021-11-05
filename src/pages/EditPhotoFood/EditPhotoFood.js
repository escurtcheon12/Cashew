import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';

import {createStackNavigator} from '@react-navigation/stack';

import Account from '../../assets/icons/Account.svg';
import IconHome from '../../assets/icons/Home.svg';
import IconNotification from '../../assets/icons/Notification.svg';
import IconInventory from '../../assets/icons/Inventory.svg';
import Camera from '../../assets/icons/Camera.svg';
import Gallery from '../../assets/icons/Gallery.svg';

import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';

const Stack = createStackNavigator();

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const EditPhotoFood = ({navigation}) => {
  const [idFood, setIdFood] = useState('');
  const [dataFood, setDataFood] = useState('');
  const [allFood, setAllFood] = useState([]);
  const [ImageUri, setImageUri] = useState(null);
  const [dataImage, setDataImage] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [statusUpload, setStatusUpload] = useState(false);
  const [getAllNotif, setGetAllNotif] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFood = async () => {
      await axios
        .get('https://cashewwww.000webhostapp.com/api/apiFood.php')
        .then(res => {
          setAllFood(res.data.data.result);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(true);
        });
    };
    getFood();

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

    const getDataFood = async () => {
      try {
        const value = await AsyncStorage.multiGet(['id_food', 'food_name']);
        if (value !== null) {
          setIdFood(value[0][1]);
          setDataFood(value[1][1]);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        setLoading(true);
      }
    };
    getDataFood();

    if (statusUpload === true) {
      alert('Uploading Succes');
      setStatusUpload(false);
      navigation.navigate('EditFoods');
    }
  }, [statusUpload, getAllNotif]);

  console.log(dataFood);

  const handleChoosePhoto = option => {
    let i = search(dataFood, allFood);
    setIdFood(i.id);

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

        setImageUri(source);
        setDataImage(res.assets[0].base64);
        setShowUpload(true);
      }
    });
  };

  console.log('idFood', idFood);
  console.log('array', allFood);

  const placeUpload = async () => {
    RNFetchBlob.fetch(
      'POST',
      `https://cashewwww.000webhostapp.com/api/apiFood.php?op=uploadFood&id=${idFood}`,
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
    setStatusUpload(true);
    setShowUpload(false);
  };

  const stylingImage = () => {
    return {
      height: height * 0.31,
      width: width * 0.7,
      backgroundColor: 'blue',
      marginTop: height * 0.04,
    };
  };

  const stylingTextMain = () => {
    if (showUpload === false) {
      return {
        textAlign: 'center',
        alignItems: 'center',
        color: '#935218',
        fontSize: height * 0.03,
        marginTop: height * 0.2,
      };
    } else {
      return {
        textAlign: 'center',
        alignItems: 'center',
        color: '#935218',
        fontSize: height * 0.03,
        marginTop: height * 0.04,
      };
    }
  };

  let search = function (nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].food_name === nameKey) {
        return myArray[i];
      }
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

      <ScrollView>
        <View style={styles.styleMain}>
          {showUpload === true ? (
            <View styles={styles.styleParentsPicture}>
              <Image source={ImageUri} style={stylingImage()} />
              <View style={styles.styleParentsUpload}>
                <TouchableOpacity
                  style={styles.styleButtonUpload}
                  onPress={() => placeUpload()}>
                  <Text style={styles.styleTextUpload}>Upload</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.styleButtonUpload}
                  onPress={() => setShowUpload(false)}>
                  <Text style={styles.styleTextUpload}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            console.log('error')
          )}

          <Text style={stylingTextMain()}>Choose a photo source</Text>
          <View style={styles.styleParentsSquare}>
            <TouchableOpacity onPress={() => handleChoosePhoto(launchCamera)}>
              <View style={styles.styleSquare}>
                <Camera height={height * 0.3} width={width * 0.15} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleChoosePhoto(launchImageLibrary)}>
              <View style={styles.styleSquare}>
                <Gallery height={height * 0.3} width={width * 0.15} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

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
    marginTop: height * 0.03,
    marginLeft: height * 0.03,
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
  styleIconFooter: {
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
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
    marginLeft: width * 0.16,
    marginTop: height * 0.01,
  },
  styleSquare: {
    height: height * 0.15,
    width: width * 0.3,
    marginLeft: width * 0.03,
    borderRadius: 14,
    backgroundColor: '#935218',
    justifyContent: 'center',
    alignItems: 'center',
    margin: height * 0.01,
  },
  styleParentsSquare: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.02,
    paddingBottom: height * 0.2,
  },
  styleMain: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleParentsUpload: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  styleButtonUpload: {
    width: width * 0.25,
    height: height * 0.05,
    backgroundColor: '#935218',
    justifyContent: 'center',
    alignItems: 'center',
    margin: height * 0.02,
    borderRadius: 14,
  },
  styleTextUpload: {
    color: 'white',
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

export default EditPhotoFood;
