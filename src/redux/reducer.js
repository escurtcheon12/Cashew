import {
  ADD_INVENTORY,
  INCREASE_ITEM,
  DECREASE_ITEM,
  DELETE_INVENTORY,
  DELETE_ALL_INVENTORY,
  DELETE_ITEM_DRINK,
} from './actions.js';

const initialState = [];

const increaseItem = (itemArray, item) => {
  return itemArray.map(reduxItem => {
    if (reduxItem.id === item.id) {
      if (reduxItem.item === 0) {
        reduxItem.item += 1;
      } else {
        reduxItem.item += 1;
      }
    }
    return reduxItem;
  });
};

const decreaseItem = (itemArray, item) => {
  return itemArray.map(reduxItem => {
    if (reduxItem.id === item.id) {
      if (reduxItem.item > 1) {
        reduxItem.item -= 1;
      }
    }
    return reduxItem;
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_INVENTORY:
      return [...state, action.payload];
    case INCREASE_ITEM:
      return increaseItem(state, action.payload);
    case DECREASE_ITEM:
      return decreaseItem(state, action.payload);
    case DELETE_INVENTORY:
      const i = state
        .map(e => {
          return e.hello;
        })
        .indexOf(action.payload.id);
      return state.filter((item, index) => index !== i);
    case DELETE_ALL_INVENTORY:
      return state.filter(item => console.log(item.id));
    case DELETE_ITEM_DRINK:
      return state.filter(
        item => item.category === 'drink' && item.id !== action.payload,
      );
    default:
      return state;
  }
};

export default reducer;
