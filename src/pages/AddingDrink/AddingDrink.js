import axios from 'axios';
import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';

import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';

import Account from '../../assets/icons/Account.svg';
import IconHome from '../../assets/icons/Home.svg';
import IconNotification from '../../assets/icons/Notification.svg';
import IconInventory from '../../assets/icons/Inventory.svg';
import Trash from '../../assets/icons/Trash.svg';

const Stack = createStackNavigator();

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const AddingDrink = ({navigation}) => {
  const [listCategory, setListCategory] = useState([]);
  const [itemCategory, setItemCategory] = useState([]);
  const [openModal, setOpenModal] = useState({
    openModalStatus: false,
    openStatus: '',
  });
  const [succesStatus, setSuccesStatus] = useState({
    openSucces: false,
    openStatus: '',
  });
  const [myCategory, setMyCategory] = useState({
    id: 0,
    username: '',
    category: '',
  });
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [dataDrink, setDataDrink] = useState({
    drink_name: '',
    description: '',
    price: 0,
    category: '',
  });
  const [openEdit, setOpenEdit] = useState(false);
  const [succesAdding, setSuccesAdding] = useState(false);
  const [succesEdit, setSuccesEdit] = useState(false);
  const [succesDelete, setSuccesDelete] = useState(false);
  const [getAllNotif, setGetAllNotif] = useState(0);

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
        }
      } catch (e) {
        console.log(e);
      }
    };

    getSession();
    getData();

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

    getItemCategory();

    if (succesAdding === true) {
      alert('Succes Adding Category');
      setSuccesAdding(false);
    }
    if (succesEdit === true) {
      alert('Succes Edit Category');
      setSuccesEdit(false);
    }
    if (succesDelete === true) {
      alert('Succes Delete Category');
      setSuccesDelete(false);
    }
  }, [succesAdding, succesEdit, succesDelete]);

  const getData = async () => {
    await axios
      .get('https://cashewwww.000webhostapp.com/api/apiCategory.php')
      .then(res => {
        setListCategory(res.data.data.result);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getItemCategory = async () => {
    await axios
      .get('https://cashewwww.000webhostapp.com/api/apiDrink.php')
      .then(res => {
        setItemCategory(res.data.data.result);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleCancel = () => {
    setOpenModal({
      openModalStatus: false,
    });
    setOpenEdit(false);
  };

  const handleDeleteCategory = () => {
    axios
      .get(
        `https://cashewwww.000webhostapp.com/api/apiCategory.php?op=delete&id=${myCategory.id}`,
      )
      .then(res => {
        console.log(`sukses ${res}`);
        setOpenModal({
          openModalStatus: false,
        });
        setSuccesDelete(true);
      })
      .catch(err => {
        console.log(`failed ${err}`);
      });
  };

  const handleAddCategory = () => {
    const data = `username=${username}&email=${email}&menu=drink&category=${myCategory.category}`;

    console.log(username);

    axios
      .post(
        `https://cashewwww.000webhostapp.com/api/apiCategory.php?op=create`,
        data,
      )
      .then(res => {
        console.log(`succes :${res}`);
        setOpenModal({
          openModalStatus: false,
        });
        setSuccesAdding(true);
      })
      .catch(err => {
        console.log(err);
      });
  };

  let search = function (nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].category === nameKey) {
        return myArray[i];
      }
    }
  };

  const onInputChange = (value, input) => {
    setDataDrink({
      ...dataDrink,
      [input]: value,
    });
  };

  const getValue = itemValue => {
    onInputChange(itemValue, 'category');

    if (itemValue === 'Add') {
      setOpenModal({
        openModalStatus: true,
        openStatus: 'Add',
      });
    } else if (itemValue === 'Select') {
      setOpenModal({
        openModalStatus: false,
      });
    } else {
      let i = search(itemValue, listCategory);
      setOpenModal({
        openModalStatus: true,
        openStatus: 'Edit',
      });
      setMyCategory({
        id: parseInt(i.id),
        username: i.username,
        category: i.category,
      });
    }
  };

  const handleEditCategory = () => {
    const data = `category=${myCategory.category}`;
    axios
      .post(
        `https://cashewwww.000webhostapp.com/api/apiCategory.php?op=update&id=${myCategory.id}`,
        data,
      )
      .then(res => {
        console.log(`succes :${res}`);
        setOpenModal({
          openModalStatus: false,
        });
        setOpenEdit(false);
        setSuccesEdit(true);
      })
      .catch(err => {
        console.log(err);
      });

    (itemCategory || []).map(item => {
      const data = `category=${myCategory.category}`;
      if (item.category === dataDrink.category) {
        axios
          .post(
            `https://cashewwww.000webhostapp.com/api/apiDrink.php?op=update&id=${item.id}`,
            data,
          )
          .then(res => {
            console.log(`succes :${res}`);
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  };

  const onInputChangeCategory = (value, input) => {
    setMyCategory({
      ...myCategory,
      [input]: value,
    });
  };

  const onFucusText = () => {
    setOpenEdit(true);
    console.log('focus');
  };

  const dataSessionDrink = async item => {
    try {
      await AsyncStorage.setItem('drink_name', item);
    } catch (err) {
      console.log(err);
    }
  };

  const handleButtonSend = () => {
    const data = `username=${username}&email=${email}&drink_name=${dataDrink.drink_name}&description=${dataDrink.description}&price=${dataDrink.price}&category=${dataDrink.category}`;

    if (
      dataDrink.drink_name &&
      dataDrink.description &&
      dataDrink.price &&
      dataDrink.category
    ) {
      axios
        .post(
          `https://cashewwww.000webhostapp.com/api/apiDrink.php?op=create`,
          data,
        )
        .then(res => {
          console.log('succes');
          setDataDrink({
            drink_name: '',
            description: '',
            price: 0,
            category: '',
          });
          dataSessionDrink(dataDrink.drink_name);
          navigation.navigate('EditPhotoDrink');
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      alert('Should Fill This Input');
    }
  };

  const ModalSize = () => {
    if (openModal.openStatus === 'Add') {
      return {
        width: 0.85 * width,
        height: 0.33 * height,
        backgroundColor: 'white',
        borderRadius: 20,
      };
    } else if (openModal.openStatus === 'Edit') {
      return {
        width: 0.9 * width,
        height: 0.4 * height,
        backgroundColor: 'white',
        borderRadius: 20,
      };
    }
  };

  const ModalHeader = () => {
    if (openModal.openStatus === 'Add') {
      return <Text style={styles.styleModalText}>Add Category</Text>;
    } else if (openModal.openStatus === 'Edit') {
      return <Text style={styles.styleModalText}>Edit Category</Text>;
    }
  };

  const ModalBody = () => {
    if (openModal.openStatus === 'Add') {
      return (
        <TextInput
          style={styles.modalInput}
          placeholder="Add New Category"
          onChangeText={value => onInputChangeCategory(value, 'category')}
          placeholderTextColor="grey"
        />
      );
    } else if (openModal.openStatus === 'Edit') {
      return (
        <TextInput
          style={styles.modalInput}
          placeholder="Add New Category"
          value={myCategory.category}
          onChangeText={value => onInputChangeCategory(value, 'category')}
          onFocus={() => onFucusText()}
          placeholderTextColor="grey"
        />
      );
    }
  };

  const ModalButton = () => {
    if (openModal.openStatus === 'Add') {
      return (
        <View style={styles.modalFooter}>
          <TouchableOpacity
            onPress={() => handleCancel()}
            style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleAddCategory()}
            style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (openModal.openStatus === 'Edit') {
      return (
        <View style={styles.containerEdit}>
          <TouchableOpacity
            onPress={() => handleDeleteCategory()}
            style={styles.modalButtonDelete}>
            <Trash height={0.04 * height} width={0.1 * width} />
          </TouchableOpacity>
          <View style={styles.modalFooter}>
            <TouchableOpacity
              onPress={() => handleCancel()}
              style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>

            {openEdit === true ? (
              <TouchableOpacity
                onPress={() => handleEditCategory()}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Edit</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleCancel()}>
                <Text style={styles.modalButtonText}>Continue</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
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
        <View style={styles.styleContainerInput}>
          <View style={styles.styleParentsInput}>
            <Text style={styles.styleTextInput}>Drink Name</Text>
            <TextInput
              style={styles.styleInput}
              onChangeText={value => onInputChange(value, 'drink_name')}
              placeholderTextColor="grey"
            />
          </View>
          <View style={styles.styleParentsInput}>
            <Text style={styles.styleTextInput}>Description</Text>
            <TextInput
              style={styles.styleInput}
              onChangeText={value => onInputChange(value, 'description')}
              placeholderTextColor="grey"
            />
          </View>
          <View style={styles.styleParentsInput}>
            <Text style={styles.styleTextInput}>Price</Text>
            <TextInput
              style={styles.styleInput}
              onChangeText={value => onInputChange(value, 'price')}
              placeholderTextColor="grey"
            />
          </View>

          <View style={styles.styleParentsInput}>
            <Text style={styles.styleTextInput}>Category</Text>

            <View style={styles.styleInput}>
              <TouchableOpacity>
                <Picker
                  selectedValue={dataDrink.category}
                  onValueChange={(itemValue, itemIndex) => getValue(itemValue)}>
                  <Picker.Item label="Select Category" value="Select" />

                  {(listCategory || []).map(item => {
                    if (item.menu === 'drink') {
                      if (item.username === username && username.length > 0) {
                        return (
                          <Picker.Item
                            key={item.id}
                            label={item.category}
                            value={item.category}
                          />
                        );
                      } else if (item.email === email) {
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

                  <Picker.Item
                    label="
                    Add Category"
                    value="Add"
                    onPress={() => alert('ini add category')}
                  />
                </Picker>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => handleButtonSend()}
            style={styles.styleButton}>
            <Text style={styles.styleTextOK}>Next</Text>
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

        <Modal
          transparent
          visible={openModal.openModalStatus}
          animationType="fade">
          <View style={styles.modalBackground}>
            <View style={ModalSize()}>
              <View style={styles.modalHeader}>{ModalHeader()}</View>
              <View style={styles.modalBody}>
                <View style={styles.modalParentsInput}>{ModalBody()}</View>
              </View>
              {ModalButton()}
            </View>
          </View>
        </Modal>
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
  styleMain: {
    height: height * 0.9,
    backgroundColor: 'white',
    borderRadius: 30,
  },
  styleContainerInput: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleTextInput: {
    fontFamily: 'Poppins-Medium',
    color: '#935218',
    fontSize: height * 0.025,
    marginBottom: height * 0.01,
    marginTop: height * 0.03,
  },
  styleInput: {
    width: width * 0.8,
    height: height * 0.07,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    padding: height * 0.01,
    fontSize: height * 0.025,
    color: 'black',
  },
  styleButton: {
    width: width * 0.25,
    height: height * 0.07,
    backgroundColor: '#FECE79',
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  styleTextOK: {
    fontFamily: 'Poppins-Bold',
    fontSize: height * 0.03,
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
    marginTop: height * 0.03,
  },
  styleModalText: {
    fontFamily: 'Poppins-Bold',
  },
  modalInput: {
    padding: height * 0.01,
    marginTop: height * 0.03,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    fontSize: height * 0.02,
    color: 'black',
  },
  modalDropdown: {
    marginTop: width * 0.3,
    height: height * 0.3,
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
  containerEdit: {
    justifyContent: 'center',
    alignItems: 'center',
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

export default AddingDrink;
