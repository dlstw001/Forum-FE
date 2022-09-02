export default class BaseServices {
  constructor(props) {
    this.http = props.http;
    this.url = props.url;
  }

  find = (payload) => {
    return this.http.get(`${this.url}`, payload);
  };

  create = (payload) => {
    return this.http.post(`${this.url}`, payload);
  };

  get = (id) => {
    return this.http.get(`${this.url}/${id}`);
  };

  update = (payload) => {
    const { id, ...rest } = payload;
    return this.http.put(`${this.url}/${id}`, rest);
  };

  delete = (id) => {
    return this.http.delete(`${this.url}/${id}`);
  };
}
