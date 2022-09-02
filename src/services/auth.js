import axios from 'axios';

export default class AuthServices {
  constructor(props) {
    this.http = props.http;
  }

  setData = (data) => this.http.setData(data);
  removeData = () => this.http.removeData();
  getRefreshToken = () => this.http.getRefreshToken();

  refreshToken = () =>
    axios.post(`${process.env.REACT_APP_AUTH_SERVER}/refresh`, { refresh_token: this.getRefreshToken() });
}
