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
import PlaceFood from '../../assets/icons/placeFood.svg';
import ArrowRight from '../../assets/icons/ArrowRight.svg';

import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';

import {useDispatch, useSelector} from 'react-redux';
import {
  addInventory,
  deleteInventory,
  increaseItem,
  decreaseItem,
  deleteDrink,
} from '../../redux/actions';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const ItemFood = ({image, food_name, description, price, getFood, item}) => {
  const globalState = useSelector(state => state);
  const dispatch = useDispatch();
  const [number, setNumber] = useState(1);

  const [status, setStatus] = useState({
    openStatus: false,
    descStatus: 'show',
  });
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
  }, []);

  const handleOpenShow = () => {
    dispatch(
      addInventory({
        id: getFood.id,
        menu: getFood.food_name,
        category: 'food',
        item: 1,
        price: getFood.price,
      }),
    );
    setStatus({descStatus: 'edit'});
  };

  const increseInventory = number => {
    dispatch(increaseItem(getFood));
    setNumber(number + 1);
  };

  const decreaseInventory = number => {
    dispatch(decreaseItem(getFood));
    if (number > 1) setNumber(number - 1);
  };

  const handleDeleteInventory = () => {
    dispatch(deleteInventory(getFood.id));
    setStatus({descStatus: 'show'});
  };

  const formulaTotalArray = value => {
    const n = allTranscations.filter(item => item.menu === value).length;
    return n;
  };

  const formulaRating = () => {
    let totalRating = 0;
    let totalItem = 0;
    (allTranscations || []).map(item => {
      if (item.menu === getFood.food_name) {
        totalItem += parseInt(item.item);
        totalRating += totalItem / formulaTotalArray(getFood.food_name);
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

  console.log(globalState.reducer);

  if (status.descStatus === 'show') {
    return (
      <View style={styles.styleWrapItem}>
        <Image
          style={styles.styleImageItem}
          source={{
            uri: `https://cashewwww.000webhostapp.com/api/upload/food/images/${image}`,
          }}
        />

        <View style={styles.styleParentsText}>
          <Text style={styles.styleNameShow}>{food_name}</Text>

          <View style={styles.styleParentsMiddleShow}>
            <Text style={styles.styleDescShow}>{description}</Text>

            <TouchableOpacity
              style={styles.styleButtonAdding}
              onPress={() => handleOpenShow(getFood)}>
              <Text style={styles.styleTextAdding}>Add +</Text>
            </TouchableOpacity>
          </View>

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
      </View>
    );
  } else {
    return (
      <View style={styles.styleWrapItemOrder}>
        <Image
          style={styles.styleImageItem}
          source={{
            uri: `https://cashewwww.000webhostapp.com/api/upload/food/images/${image}`,
          }}
        />

        <View style={styles.styleParentsText}>
          <Text style={styles.styleNameShow}>{food_name}</Text>

          <View style={styles.styleParentsMiddleShow}>
            <Text style={styles.styleDescShow}>{description}</Text>

            <View style={styles.parentsQuantity}>
              <TouchableOpacity
                style={styles.stylePlusQuantity}
                onPress={() => increseInventory(number)}>
                <Text style={styles.stylePlusAddQuantity}>+</Text>
              </TouchableOpacity>

              <View style={styles.styleNumberOrder}>
                <Text style={styles.styleTotalItem}>{number}</Text>
              </View>

              <TouchableOpacity
                style={styles.styleMinQuantity}
                onPress={() => decreaseInventory(number)}>
                <Text style={styles.styleMinusQuantity}>-</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.styleBottomTextOrder}>
            <Text style={styles.stylePriceOrder}>Rp. {price}</Text>
          </View>

          <View style={styles.styleButtonBottom}>
            <TouchableOpacity
              onPress={() => handleDeleteInventory()}
              style={styles.styleButton}>
              <Text style={styles.styleButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
};

const TransactionsFood = ({navigation}) => {
  const globalState = useSelector(state => state);
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);
  const [Category, setCategory] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
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
          value[1][1] === '' ? console.log('kosong') : setUsername(value[1][1]);

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

    const getData = async () => {
      await axios
        .get('https://cashewwww.000webhostapp.com/api/apiFood.php')
        .then(res => {
          setItems(res.data.data.result);
          setLoading(false);
        })
        .catch(err => console.log(err));
    };
    getData();

    const getCategory = async () => {
      await axios
        .get('https://cashewwww.000webhostapp.com/api/apiCategory.php')
        .then(res => {
          setCategory(res.data.data.result);
          setLoading(false);
        })
        .catch(err => console.log(err));
    };
    getCategory();

    navigation.addListener('focus', () => {
      getData();
      getCategory();
    });
  }, [getAllNotif]);

  const getValue = itemValue => {
    setSelectedCategory(itemValue);
  };

  const totalPrice = () => {
    let textMenu = 0;
    (globalState.reducer || []).map(item => {
      if (item.item > 0) {
        textMenu += parseInt(item.price) * item.item;
      }
    });
    return textMenu;
  };

  const handleNext = () => {
    if (totalPrice() !== 0) {
      navigation.navigate('TransactionPayment');
    }
  };

  console.log(globalState.reducer.length);

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
            <TouchableOpacity
              onPress={() => navigation.navigate('TransactionsFood')}>
              <View style={styles.styleButtonDrink}>
                <View style={styles.styleParentsIconMenu}>
                  <Food height={height * 0.04} width={width * 0.1} />
                </View>
                <Text style={styles.styleTextMenu}>Food</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('TransactionsDrink')}>
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
                  if (item.menu === 'food') {
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
                      food_name={item.food_name}
                      description={item.description}
                      price={item.price}
                      getFood={item}
                    />
                  );
                } else if (email === item.email) {
                  return (
                    <ItemFood
                      key={item.id}
                      image={item.image}
                      food_name={item.food_name}
                      description={item.description}
                      price={item.price}
                      getFood={item}
                    />
                  );
                }
              }
            })}
          </View>
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.stylePlaceItem}
        onPress={() => handleNext()}>
        <View style={styles.styleButtonLeft}>
          <PlaceFood height={height * 0.2} width={width * 0.1} />
          <Text style={styles.styleNumberItem}>
            {globalState.reducer.length} Item
          </Text>
        </View>
        <View style={styles.styleButtonRight}>
          <Text style={styles.stylePriceItem}>Rp. {totalPrice()}</Text>
          <ArrowRight height={height * 0.03} width={width * 0.12} />
        </View>
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
  styleButtonDrink: {
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
  styleParentsIconMenu: {
    marginLeft: width * 0.05,
  },
  styleTextMenu: {
    fontFamily: 'Roboto-Regular',
    fontSize: height * 0.025,
    marginLeft: width * 0.02,
  },
  styleParentsItem: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  styleParentsCategory: {
    width: 320,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    marginTop: 20,
  },
  styleButtonCategory: {
    flexDirection: 'row',
  },
  styleIconArrow: {
    position: 'absolute',
    right: 20,
  },
  styleNameCategory: {
    color: '#935218',
    marginLeft: 14,
    fontFamily: 'Roboto-Regular',
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
  styleWrapItemOrder: {
    width: 0.9 * width,
    height: 0.3 * height,
    borderRadius: 50,
    backgroundColor: '#F1ECDF',
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
  },
  styleNameShow: {
    fontSize: height * 0.025,
    fontFamily: 'Poppins-Medium',
    marginTop: height * 0.02,
  },
  styleDescShow: {
    fontSize: height * 0.018,
    fontFamily: 'Roboto-Regular',
    marginTop: height * 0.01,
    width: width * 0.24,
  },
  styleDescItem: {
    fontSize: height * 0.018,
    fontFamily: 'Roboto-Regular',
    marginTop: height * 0.01,
  },
  styleBottomText: {
    marginTop: height * 0.02,
    flexDirection: 'row',
  },
  styleBottomTextOrder: {
    marginTop: 20,
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
    left: width * 0.2,
    bottom: height * 0.005,
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
    marginBottom: height * 0.2,
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
  styleParentsMiddleShow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  styleButtonAdding: {
    marginTop: height * 0.01,
    marginLeft: width * 0.02,
    width: 0.15 * width,
    height: 0.1 * width,
    backgroundColor: '#FECE79',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  styleTextAdding: {
    fontWeight: 'bold',
    fontSize: height * 0.02,
  },
  styleNumberOrder: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: width * 0.05,
    marginTop: 15,
    textAlign: 'center',
    backgroundColor: 'white',
    width: 0.1 * width,
    height: 0.1 * width,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
  },
  parentsQuantity: {
    flexDirection: 'row',
    position: 'absolute',
    left: width * 0.2,
  },
  stylePlusQuantity: {
    backgroundColor: '#FECE79',
    height: height * 0.04,
    width: width * 0.05,
    top: width * 0.05,
    left: width * 0.05,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleMinQuantity: {
    backgroundColor: '#FECE79',
    height: height * 0.04,
    width: width * 0.05,
    top: width * 0.05,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stylePlaceItem: {
    width: width * 0.9,
    height: height * 0.1,
    backgroundColor: '#FFB74B',
    position: 'absolute',
    justifyContent: 'center',
    bottom: height * 0.15,
    right: width * 0.05,
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  styleButtonLeft: {
    marginLeft: width * 0.05,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleNumberItem: {
    marginTop: height * 0.01,
    marginLeft: width * 0.04,
    fontSize: height * 0.03,
    color: '#935218',
    fontFamily: 'Poppins-Bold',
  },
  styleButtonRight: {
    marginRight: width * 0.05,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stylePriceItem: {
    fontSize: height * 0.025,
    marginRight: width * 0.02,
  },
  styleParentsStar: {
    flexDirection: 'row',
    position: 'absolute',
    top: height * 0.05,
  },
  styleNumberRating: {
    marginLeft: width * 0.02,
    fontSize: height * 0.025,
  },
  styleRating: {
    flexDirection: 'row',
  },
  styleTotalItem: {
    fontSize: height * 0.02,
  },
  stylePriceOrder: {
    fontSize: height * 0.02,
    fontFamily: 'Roboto-Bold',
    position: 'absolute',
    left: width * 0.2,
    top: height * 0.01,
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

export default TransactionsFood;
