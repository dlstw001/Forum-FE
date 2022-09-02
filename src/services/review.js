import BaseServices from './base';

export default class ReviewServices extends BaseServices {
  constructor(props) {
    super(props);
    this.url = '/reviewable';
    this.http = props.http;
  }

  post = (post_id, payload) => this.http.post(`${this.url}/post/${post_id}`, payload);
  reply = (reply_id, payload) => this.http.post(`${this.url}/reply/${reply_id}`, payload);
  grouped = (payload) => this.http.get(`${this.url}/grouped`, payload);
}
