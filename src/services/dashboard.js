import BaseServices from './base';

export default class DashboardServices extends BaseServices {
  constructor(props) {
    super(props);
    this.url = '/dashboard';
    this.http = props.http;
  }

  get = (payload) => this.http.get(`${this.url}/graph`, payload);
  getSearch = (payload) => this.http.get(`${this.url}/search`, payload);
  getTopReferredPost = (payload) => this.http.get(`${this.url}/topReferredPost`, payload);
  getTrustLvl = () => this.http.get(`${this.url}/user`);
  getActivity = (payload) => this.http.get(`${this.url}/activity`, payload);
  getTopUserActivity = () => this.http.get(`${this.url}/topUserActivity`);
}
