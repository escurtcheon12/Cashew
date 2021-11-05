import {DATAUSER} from './types';

export const getData = user => ({
  type: DATAUSER,
  data: user,
});
