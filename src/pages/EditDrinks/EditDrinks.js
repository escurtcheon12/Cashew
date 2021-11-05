import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  ScrollView,
  FlatList,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';

import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';

import Account from '../../assets/icons/Account.svg';
import IconHome from '../../assets/icons/Home.svg';
import IconNotification from '../../assets/icons/Notification.svg';
import IconInventory from '../../assets/icons/Inventory.svg';
import Food from '../../assets/icons/FoodSmall.svg';
import Drink from '../../assets/icons/DrinkSmall.svg';
import Star from '../../assets/icons/Star.svg';
import ArrowBottom from '../../assets/icons/ArrowBottom.svg';
import Trash from '../../assets/icons/Trash.svg';

import Swipeable from 'react-native-gesture-handler/Swipeable';

import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const ItemFood = ({
  image,
  drink_name,
  description,
  price,
  getDrink,
  navigation,
}) => {
  const [statusInput, setStatusInput] = useState('show');
  const [selectUser, setSelectUser] = useState({
    id: 0,
    drink_name: '',
    description: '',
    price: 0,
  });
  const [statusSave, setStatusSave] = useState(false);
  const [statusDelete, setStatusDelete] = useState(false);
  const [allTranscations, setAllTransactions] = useState([]);

  useEffect(() => {
    const getDataNoPayment = async () => {
      await axios
        .get('https://cashewwww.000webhostapp.com/api/apiTransactions.php')
        .then(res => {
          setAllTransactions(res.data.data.result);
        })
        .catch(err => {
          console.log(err);
        });
    };

    getDataNoPayment();

    if (statusSave === true) {
      alert('Item has been save');
      setStatusSave(false);
    }
    if (statusDelete === true) {
      alert('Item has deleted');
      setStatusDelete(false);
    }
  }, [statusSave, statusDelete]);

  const SelectUser = get => {
    setStatusInput('edit');
    setSelectUser({
      ...selectUser,
      id: get.id,
      drink_name: get.drink_name,
      description: get.description,
      price: get.price,
    });
    console.log('item selected');
  };

  const onInputChange = (value, input) => {
    setSelectUser({
      ...selectUser,
      [input]: value,
    });
  };

  const buttonSave = async () => {
    const data = `drink_name=${selectUser.drink_name}&description=${selectUser.description}&price=${selectUser.price}`;

    await axios
      .post(
        `https://cashewwww.000webhostapp.com/api/apiDrink.php?op=update&id=${selectUser.id}`,
        data,
      )
      .then(res => {
        console.log('item updated');
        setStatusInput('show');
        setStatusSave(true);
      })
      .catch(err => {
        console.log('item failed updated' + err);
      });
  };

  const handleDelete = async () => {
    await axios
      .post(
        `https://cashewwww.000webhostapp.com/api/apiDrink.php?op=delete&id=${selectUser.id}`,
      )
      .then(res => {
        console.log('item deleted');
        setStatusDelete(true);
      })
      .catch(err => {
        console.log('item failed deleted' + err);
      });
  };

  const buttonDelete = () => {
    Alert.alert('Description', 'You want delete this item?', [
      {
        text: '',
        onPress: () => console.log('Cancel Pressed'),
        style: '',
      },
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      {text: 'Yes', onPress: () => handleDelete()},
    ]);
  };
  const rightSwipe = () => {
    return (
      <TouchableOpacity
        style={styles.styleDeleteBox}
        onPress={() => buttonDelete()}>
        <View>
          <Trash height={30} width={30} />
        </View>
      </TouchableOpacity>
    );
  };

  const session_drinkName = async () => {
    try {
      await AsyncStorage.setItem('drink_name', selectUser.drink_name);
    } catch (err) {
      console.log(err);
    }
  };

  const handleImage = () => {
    session_drinkName();
    navigation.navigate('EditPhotoDrink');
  };

  const formulaTotalArray = value => {
    const n = allTranscations.filter(item => item.menu === value).length;
    return n;
  };

  const formulaRating = () => {
    let totalRating = 0;
    let totalItem = 0;
    (allTranscations || []).map(item => {
      if (item.menu === getDrink.drink_name) {
        totalItem += parseInt(item.item);
        totalRating += totalItem / formulaTotalArray(getDrink.drink_name);
      }
    });
    return totalRating;
  };

  const Starts = () => {
    if (formulaRating() < 10) {
      return (
        <Star
          style={styles.styleStarShow}
          height={height * 0.02}
          width={width * 0.02}
        />
      );
    } else if (formulaRating() >= 10 && formulaRating() <= 30) {
      return (
        <View style={styles.styleRating}>
          <Star
            style={styles.styleStarShow}
            height={height * 0.02}
            width={width * 0.02}
          />
          <Star
            style={styles.styleStarShow}
            height={height * 0.02}
            width={width * 0.02}
          />
        </View>
      );
    } else if (formulaRating() >= 30 && formulaRating() <= 50) {
      return (
        <View style={styles.styleRating}>
          <Star
            style={styles.styleStarShow}
            height={height * 0.02}
            width={width * 0.02}
          />
          <Star
            style={styles.styleStarShow}
            height={height * 0.02}
            width={width * 0.02}
          />
          <Star
            style={styles.styleStarShow}
            height={height * 0.02}
            width={width * 0.02}
          />
        </View>
      );
    } else if (formulaRating() >= 50 && formulaRating() <= 80) {
      return (
        <View style={styles.styleRating}>
          <Star
            style={styles.styleStarShow}
            height={height * 0.02}
            width={width * 0.02}
          />
          <Star
            style={styles.styleStarShow}
            height={height * 0.02}
            width={width * 0.02}
          />
          <Star
            style={styles.styleStarShow}
            height={height * 0.02}
            width={width * 0.02}
          />
          <Star
            style={styles.styleStarShow}
            height={height * 0.02}
            width={width * 0.02}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.styleRating}>
          <Star
            style={styles.styleStarShow}
            height={height * 0.02}
            width={width * 0.02}
          />
          <Star
            style={styles.styleStarShow}
            height={height * 0.02}
            width={width * 0.02}
          />
          <Star
            style={styles.styleStarShow}
            height={height * 0.02}
            width={width * 0.02}
          />
          <Star
            style={styles.styleStarShow}
            height={height * 0.02}
            width={width * 0.02}
          />
          <Star
            style={styles.styleStarShow}
            height={height * 0.02}
            width={width * 0.02}
          />
        </View>
      );
    }
  };

  const numberWithCommas = x => {
    return x.toString().replace(/(?:\/)([^#]+)(?=#*)/, ',');
  };

  const Number = x => {
    const result = numberWithCommas(x);
    const pass = result;
    console.log(`${pass ? '✓' : 'ERROR ====>'} ${x} => ${result}`);
    return pass;
  };

  if (statusInput === 'show') {
    return (
      <View style={styles.styleWrapItem}>
        <Image
          style={styles.styleImageItem}
          source={{
            uri: `https://cashewwww.000webhostapp.com/api/upload/drink/images/${image}`,
          }}
        />

        <TouchableOpacity onPress={() => SelectUser(getDrink)}>
          <View style={styles.styleParentsText}>
            <Text style={styles.styleNameShow}>{drink_name}</Text>

            <Text style={styles.styleDescShow}>{description}</Text>

            <View style={styles.styleBottomTextShow}>
              <View style={styles.styleParentsStar}>
                {Starts()}
                <Text style={styles.styleNumberRating}>
                  {Number(Math.floor(formulaRating()))}
                </Text>
              </View>
              <Text style={styles.stylePriceShow}>Rp. {price}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <Swipeable renderRightActions={() => rightSwipe()}>
        <View style={styles.styleWrapItem}>
          <TouchableOpacity onPress={() => handleImage()}>
            <Image
              style={styles.styleImageItem}
              source={{
                uri: `https://cashewwww.000webhostapp.com/api/upload/drink/images/${image}`,
              }}
            />
          </TouchableOpacity>
          <View style={styles.styleParentsText}>
            <TextInput
              style={styles.styleNameItem}
              value={selectUser.drink_name}
              onChangeText={value => onInputChange(value, 'drink_name')}
              onFocus={() => SelectUser(getDrink)}
              maxLength={20}
              placeholderTextColor="grey"
            />

            <TextInput
              style={styles.styleDescItem}
              value={selectUser.description}
              onChangeText={value => onInputChange(value, 'description')}
              onFocus={() => SelectUser(getDrink)}
              maxLength={60}
              multiline
              placeholderTextColor="grey"
            />

            <View style={styles.styleBottomText}>
              <TextInput
                style={styles.stylePrice}
                value={selectUser.price}
                onChangeText={value => onInputChange(value, 'price')}
                onFocus={() => SelectUser(getDrink)}
                maxLength={8}
                placeholderTextColor="grey"
              />
            </View>

            <View style={styles.styleButtonBottom}>
              <TouchableOpacity
                onPress={() => buttonSave()}
                style={styles.styleButton}>
                <Text style={styles.styleButtonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setStatusInput('show')}
                style={styles.styleButton}>
                <Text style={styles.styleButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Swipeable>
    );
  }
};

const EditDrinks = ({navigation}) => {
  const [items, setItems] = useState([]);
  const [Category, setCategory] = useState([]);
  const [username, setUsername] = useState('null');
  const [email, setEmail] = useState('null');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectCategory, setSelectCategory] = useState({
    id: 0,
    username: '',
    category: '',
  });
  const [getAllNotif, setGetAllNotif] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const value = await AsyncStorage.multiGet([
          'id_user',
          'username',
          'email',
          'imageName',
        ]);
        if (value !== null) {
          setUsername(value[1][1]);
          setEmail(value[2][1]);
          setLoading(false);
        }
      } catch (e) {
        console.log(e);
        setLoading(true);
      }
    };

    getSession();

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

    const removeSession = async () => {
      try {
        await AsyncStorage.removeItem('drink_name');
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(true);
      }
    };

    const getData = async () => {
      await axios
        .get('https://cashewwww.000webhostapp.com/api/apiDrink.php')
        .then(res => {
          setItems(res.data.data.result);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(true);
        });
    };
    getData();

    const getCategory = async () => {
      await axios
        .get('https://cashewwww.000webhostapp.com/api/apiCategory.php')
        .then(res => {
          setCategory(res.data.data.result);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(true);
        });
    };
    getCategory();

    navigation.addListener('focus', () => {
      removeSession();
      getData();
      getCategory();
    });
  }, []);

  const SelectCategory = get => {
    setSelectCategory({
      id: get.id,
      username: get.username,
      category: get.category,
    });
  };

  const getValue = itemValue => {
    setSelectedCategory(itemValue);
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

      <View style={styles.styleMenu}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.styleParentButton}>
            <TouchableOpacity onPress={() => navigation.navigate('EditFoods')}>
              <View style={styles.styleButtonDrink}>
                <View style={styles.styleParentsIconMenu}>
                  <Food height={height * 0.04} width={width * 0.1} />
                </View>
                <Text style={styles.styleTextMenu}>Food</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('EditDrinks')}>
              <View style={styles.styleButtonFood}>
                <View style={styles.styleParentsIconMenu}>
                  <Drink height={height * 0.04} width={width * 0.1} />
                </View>
                <Text style={styles.styleTextMenu}>Drink</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.styleContainItem}>
            <View style={styles.styleInput}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(itemValue, itemIndex) => getValue(itemValue)}>
                {(Category || []).map(item => {
                  if (item.menu === 'drink') {
                    if (username === item.username && username.length > 0) {
                      return (
                        <Picker.Item
                          key={item.id}
                          label={item.category}
                          value={item.category}
                        />
                      );
                    } else if (email === item.email) {
                      return (
                        <Picker.Item
                          key={item.id}
                          label={item.category}
                          value={item.category}
                        />
                      );
                    }
                  }
                })}
              </Picker>
            </View>

            {(items || []).map(item => {
              if (selectedCategory === item.category) {
                if (username === item.username && username.length > 0) {
                  return (
                    <ItemFood
                      key={item.id}
                      image={item.image}
                      drink_name={item.drink_name}
                      description={item.description}
                      price={item.price}
                      getDrink={item}
                      navigation={navigation}
                    />
                  );
                } else if (email === item.email) {
                  return (
                    <ItemFood
                      key={item.id}
                      image={item.image}
                      drink_name={item.drink_name}
                      description={item.description}
                      price={item.price}
                      getDrink={item}
                      navigation={navigation}
                    />
                  );
                }
              }
            })}
          </View>
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.styleParentsAdding}
        onPress={() => navigation.navigate('AddingDrink')}>
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
  styleParentButton: {
    flexDirection: 'row',
    marginTop: height * 0.04,
    justifyContent: 'center',
    marginBottom: height * 0.02,
  },
  styleButtonFood: {
    flexDirection: 'row',
    width: width * 0.4,
    height: height * 0.07,
    backgroundColor: '#FFE9B8',
    borderRadius: 40,
    alignItems: 'center',
    margin: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  styleButtonDrink: {
    flexDirection: 'row',
    width: width * 0.4,
    height: height * 0.07,
    backgroundColor: 'white',
    borderRadius: 40,
    alignItems: 'center',
    margin: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  styleParentsIconMenu: {
    marginLeft: width * 0.05,
  },
  styleTextMenu: {
    fontFamily: 'Roboto-Regular',
    fontSize: height * 0.025,
    marginLeft: width * 0.02,
  },
  styleWrapItem: {
    width: 0.9 * width,
    height: 0.3 * height,
    borderRadius: 50,
    backgroundColor: 'white',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginTop: height * 0.02,
  },
  styleImageItem: {
    height: 0.3 * height,
    width: 0.4 * width,
    borderRadius: 30,
  },
  styleParentsText: {
    marginLeft: width * 0.03,
    width: width * 0.3,
  },
  styleNameItem: {
    fontSize: height * 0.02,
    fontFamily: 'Poppins-Medium',
    marginTop: height * 0.01,
    color: 'black',
  },
  styleNameShow: {
    fontSize: height * 0.025,
    fontFamily: 'Poppins-Medium',
    marginTop: height * 0.02,
  },
  styleDescItem: {
    fontSize: height * 0.016,
    fontFamily: 'Roboto-Regular',
    width: width * 0.26,
    color: 'black',
  },
  styleDescShow: {
    fontSize: height * 0.018,
    fontFamily: 'Roboto-Regular',
    marginTop: height * 0.01,
  },

  styleBottomText: {
    marginTop: height * 0.02,
    flexDirection: 'row',
  },
  styleBottomShow: {
    marginTop: height * 0.02,
    flexDirection: 'row',
  },
  stylePrice: {
    fontSize: height * 0.02,
    fontFamily: 'Roboto-Bold',
    position: 'absolute',
    left: width * 0.26,
    bottom: height * 0.005,
    color: 'black',
  },
  stylePriceShow: {
    fontSize: height * 0.02,
    fontFamily: 'Roboto-Bold',
    position: 'absolute',
    left: width * 0.2,
    marginTop: height * 0.05,
  },
  styleStar: {
    position: 'absolute',
    bottom: height * 0.02,
  },
  styleStarShow: {
    marginTop: height * 0.01,
  },
  styleContainItem: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.1,
  },
  styleParentsButton: {
    flexDirection: 'row',
    marginLeft: width * 0.2,
  },
  styleButtonBottom: {
    flexDirection: 'row',
  },
  styleButton: {
    backgroundColor: '#935218',
    borderRadius: 4,
    margin: 5,
  },
  styleButtonText: {
    width: width * 0.15,
    height: height * 0.035,
    fontSize: height * 0.02,
    fontFamily: 'Roboto-Bold',
    color: 'white',
    marginTop: height * 0.005,
    textAlign: 'center',
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
  styleMenu: {
    paddingBottom: height * 0.2,
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
    right: width * 0.06,
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
  backTextWhite: {
    color: '#FFF',
  },
  styleDeleteBox: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.25,
  },
  styleInput: {
    marginTop: height * 0.02,
    width: width * 0.85,
    height: height * 0.07,
    borderRadius: 30,
    justifyContent: 'center',
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
  styleNumberRating: {
    marginLeft: width * 0.02,
    fontSize: height * 0.025,
  },
  styleParentsStar: {
    flexDirection: 'row',
    position: 'absolute',
    top: height * 0.08,
  },
  styleRating: {
    flexDirection: 'row',
    backgroundColor: 'black',
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

export default EditDrinks;
