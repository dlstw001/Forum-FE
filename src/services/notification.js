import BaseServices from './base';

export default class NotificationServices extends BaseServices {
  constructor(props) {
    super(props);
    this.url = '/notification';
    this.http = props.http;
  }

  getNumber = (payload) => this.http.get(`${this.url}/newCount`, payload);
  get = (userId, payload) => this.http.get(`${this.url}/user/${userId}`, payload);
  read = (payload) => this.http.post(`${this.url}/read`, payload);
  unread = (payload) => this.http.post(`${this.url}/unread`, payload);
  delete = (payload) => this.http.delete(`${this.url}`, payload);
  readUserId = (userId, payload) => this.http.post(`${this.url}/user/${userId}/read`, payload);
  deleteUserId = (userId) => this.http.delete(`${this.url}/${userId}`);
}
