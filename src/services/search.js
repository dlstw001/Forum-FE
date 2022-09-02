import BaseServices from './base';

export default class SearchServices extends BaseServices {
  constructor(props) {
    super(props);
    this.url = '/search';
    this.http = props.http;
  }

  createCTR = (id) => this.http.post(`${this.url}/${id}`);
  getAdvanced = (payload) => this.http.post(`${this.url}/advanced`, payload);
}
