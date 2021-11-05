import {DATAUSER} from '../actions/types';

const initialState = {
  result: [],
};

const reducersDataUser = (state = initialState, action) => {
  switch (action.type) {
    case DATAUSER:
      console.log('DATA ADDED');
      return {
        ...state,
        result: [action.data],
      };
    default:
      return state;
  }
};

export default reducersDataUser;
