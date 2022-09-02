import BaseServices from './base';

export default class TimerServices extends BaseServices {
  constructor(props) {
    super(props);
    this.url = '/post';
    this.http = props.http;
  }

  get = (post_id) => this.http.get(`${this.url}/${post_id}/timer`);
  update = (post_id, payload) => this.http.put(`${this.url}/${post_id}/timer`, payload);
  delete = (post_id) => this.http.delete(`${this.url}/${post_id}/timer`);
}
