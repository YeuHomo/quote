import axios from "axios";
import qs from 'qs';

const url = '/klkl/merchants.php?';
const post = (action, data) => {
  let param;
  if (data) {
    param = qs.stringify(data);
  }
  return new Promise(resolve => {
    axios.post(`${url}${action}`, param).then(res => {
      resolve(res.data);
    });
  });
};

const get = (action, params) => {
  return new Promise(resolve =>
    axios
      .get(`${url}${action}`, {
        params
      })
      .then(res => {
        resolve(res.data);
      })
  );
};

export { post, get };
