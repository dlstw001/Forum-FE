import BaseServices from './base';
export default class WordpressServices extends BaseServices {
  constructor(props) {
    super(props);
    this.url = '/customer-case';
    this.http = props.http;
  }

  create = (payload) => this.http.post(`${this.url}`, payload);
  getCustomerCases = (payload) => this.http.get(`${this.url}`, payload);
  getPartners = (keyword) => this.http.get(`${this.url}/search/partners?search=${keyword}`);
  getClients = (keyword) => this.http.get(`${this.url}/search/clients?search=${keyword}`);
  uploadMedia = (payload) => this.http.post(`${this.url}/media`, payload);
  getTags = (keyword) => this.http.get(`${this.url}/search/tags?search=${keyword}`);
  createClient = (payload) => this.http.post(`${this.url}/search/clients`, payload);
  createPartner = (payload) => this.http.post(`${this.url}/search/partners`, payload);
  createTag = (payload) => this.http.post(`${this.url}/search/tags`, payload);
  getReplies = (id, payload) => this.http.get(`${this.url}/replies/${id}`, payload);
  addReplies = (id, payload) => this.http.post(`${this.url}/replies/${id}`, payload);
  getHottestTags = (payload) => this.http.get(`${this.url}/search/hottest-tags`, payload);
  search = (payload) => this.http.get(`${this.url}/`, payload);
}
