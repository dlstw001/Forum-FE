import BaseServices from './base';

export default class TagServices extends BaseServices {
  constructor(props) {
    super(props);
    this.url = '/tag';
    this.http = props.http;
  }

  tagListByCount = (payload) => this.http.get(`${this.url}/count/desc`, payload);
}
