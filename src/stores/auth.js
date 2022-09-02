import { LOGOUT_URL } from 'definitions';
import BaseStore from './base';

class AuthStore extends BaseStore {
  constructor(props) {
    super(props);
    this.api = props.api;
    this.profile = {};
  }
  login = (payload) => {
    return new Promise((resolve, reject) => {
      this.api
        .login(payload)
        .then((res) => {
          this.api.setData(res.data);
          resolve();
        })
        .catch((err) => reject(err.response.data));
    });
  };

  logout = () => {
    this.api.removeData();
    window.location.href = `${LOGOUT_URL}?url=${window.location.origin}`;
  };
}

export default AuthStore;
