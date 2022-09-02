import BaseServices from './base';

export default class QaServices extends BaseServices {
  constructor(props) {
    super(props);
    this.url = '/qa';
    this.http = props.http;
  }

  getSearch = (payload) => this.http.get(`${this.url}/search`, payload);
}
