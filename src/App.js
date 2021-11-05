import 'react-native-gesture-handler';
import React from 'react';

import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Start from './pages/Start/Start.js';
import Intro from './pages/Intro/Intro.js';
import Login from './pages/Login/Login.js';
import Register from './pages/Register/Register.js';
import Home from './pages/Home/Home.js';
import Inventory from './pages/Inventory/Inventory.js';
import Account from './pages/Account/Account.js';
import EditFoods from './pages/EditFoods/EditFoods.js';
import EditDrinks from './pages/EditDrinks/EditDrinks.js';
import EditPhotoFood from './pages/EditPhotoFood/EditPhotoFood.js';
import EditPhotoDrink from './pages/EditPhotoDrink/EditPhotoDrink.js';
import Notifications from './pages/Notifications/Notifications.js';
import AddingInventory from './pages/AddingInventory/AddingInventory.js';
import TransactionPayment from './pages/TransactionPayment/TransactionPayment.js';
import Detail from './pages/Detail/Detail.js';
import AddingFood from './pages/AddingFood/AddingFood.js';
import AddingDrink from './pages/AddingDrink/AddingDrink.js';
import EditInventory from './pages/EditInventory/EditInventory.js';
import TransactionsFood from './pages/TransactionsFood/TransactionsFood.js';
import TransactionsDrink from './pages/TransactionsDrink/TransactionsDrink.js';
import {Provider} from 'react-redux';
import {Store} from './redux/store.js';

const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Start" component={Start} />
          <Stack.Screen name="Intro" component={Intro} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Inventory" component={Inventory} />
          <Stack.Screen name="Account" component={Account} />
          <Stack.Screen name="EditFoods" component={EditFoods} />
          <Stack.Screen name="EditDrinks" component={EditDrinks} />
          <Stack.Screen name="EditPhotoFood" component={EditPhotoFood} />
          <Stack.Screen name="EditPhotoDrink" component={EditPhotoDrink} />
          <Stack.Screen name="AddingFood" component={AddingFood} />
          <Stack.Screen name="AddingDrink" component={AddingDrink} />
          <Stack.Screen name="AddingInventory" component={AddingInventory} />
          <Stack.Screen
            name="TransactionPayment"
            component={TransactionPayment}
          />
          <Stack.Screen name="Notifications" component={Notifications} />
          <Stack.Screen name="EditInventory" component={EditInventory} />
          <Stack.Screen name="TransactionsFood" component={TransactionsFood} />
          <Stack.Screen
            name="TransactionsDrink"
            component={TransactionsDrink}
          />
          <Stack.Screen name="Detail" component={Detail} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
