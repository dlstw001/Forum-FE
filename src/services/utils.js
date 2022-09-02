import BaseServices from './base';

export default class UtilsServices extends BaseServices {
  constructor(props) {
    super(props);
    this.http = props.http;
  }

  preview = (payload) => this.http.post(`/link/preview`, payload);

  addCount = (payload) => this.http.post('/link/add', payload);
  getCount = (payload) => this.http.post('/link/count', payload);
}
