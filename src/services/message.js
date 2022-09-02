import BaseServices from './base';

export default class MessageServices extends BaseServices {
  constructor(props) {
    super(props);
    this.url = '/message/user';
    this.http = props.http;
  }

  find = (userId, payload) => this.http.get(`${this.url}/${userId}`, payload);
  get = (userId, messageId) => this.http.get(`${this.url}/${userId}/${messageId}`);
  post = (payload) => this.http.post(`/message/me/`, payload);
  sent = (userId, payload) => this.http.get(`${this.url}/${userId}/sent`, payload);
  getArchiveInbox = (userId, payload) => this.http.get(`/message/user/${userId}/archive`, payload);
  getArchiveSent = (userId, payload) => this.http.get(`/message/user/${userId}/sent/archive`, payload);

  archive = (userId, payload) => this.http.post(`/message/me/${userId}/archive`, payload);
  unarchive = (userId, payload) => this.http.post(`/message/me/${userId}/unarchive`, payload);
  delete = (userId, payload) => this.http.delete(`/message/me/${userId}`, payload);

  createReply = (postId, payload) => this.http.post(`/message/me/${postId}/reply`, payload);
  getReply = (postId, payload) => this.http.get(`/message/me/${postId}/reply`, payload);

  findMy = (payload) => this.http.get(`/message/me/`, payload);
  getMy = (messageId) => this.http.get(`/message/me/${messageId}`);
  sentMy = (payload) => this.http.get(`/message/me/sent`, payload);
  getArchiveMy = (payload) => this.http.get(`/message/me/archive`, payload);
}
