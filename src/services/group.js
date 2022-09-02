import BaseServices from './base';

export default class GroupServices extends BaseServices {
  constructor(props) {
    super(props);
    this.url = '/group';
    this.http = props.http;
  }
  get = (id, payload) => this.http.get(`${this.url}/${id}`, payload);

  update = (id, payload) => this.http.put(`${this.url}/${id}`, payload);
  getAcitivityTopics = (id, payload) => this.http.get(`${this.url}/${id}/activity/post`, payload);
  getAcitivityReplies = (id, payload) => this.http.get(`${this.url}/${id}/activity/reply`, payload);
  getPermissions = (id, payload) => this.http.get(`${this.url}/${id}/permission`, payload);

  getUserList = (id, payload) => this.http.get(`${this.url}/${id}/users`, payload);
}
