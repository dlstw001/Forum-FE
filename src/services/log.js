import BaseServices from './base';

export default class LogServices extends BaseServices {
  constructor(props) {
    super(props);
    this.url = '/log';
    this.http = props.http;
  }

  getAllModeration = (payload) => this.http.get(`${this.url}/moderation`, payload);
  getModeration = (id, payload) => this.http.get(`${this.url}/moderation/${id}`, payload);
  getAllRevision = (payload) => this.http.get(`${this.url}/revision`, payload);
  getRevision = (id, payload) => this.http.get(`${this.url}/revision/${id}`, payload);
  revertRevision = (id) => this.http.post(`${this.url}/revision/${id}/revert`);
  getAllSearch = () => this.http.get(`${this.url}/search`);
  getSearch = (id) => this.http.get(`${this.url}/search/${id}`);
  getEmails = (payload) => this.http.get(`${this.url}/screened/email`, payload);
  getIp = (payload) => this.http.get(`${this.url}/screened/ip`, payload);
  getUrl = (payload) => this.http.get(`${this.url}/screened/url`, payload);
}
