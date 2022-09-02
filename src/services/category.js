import BaseServices from './base';

export default class CategoryServices extends BaseServices {
  constructor(props) {
    super(props);
    this.url = '/category';
    this.http = props.http;
  }

  update = (id, payload) => this.http.put(`${this.url}/${id}`, payload);
  trend = (payload) => this.http.get(`${this.url}/trend`, payload);
  trendFixed = (payload) => this.http.get(`${this.url}/trendFixed`, payload);
  tags = (id, payload) => this.http.get(`${this.url}/${id}/tags`, payload);
  reorderCategory = (payload) => this.http.patch(`${this.url}/order`, payload);
}
