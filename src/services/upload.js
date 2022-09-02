import BaseServices from './base';

export default class UploadServices extends BaseServices {
  constructor(props) {
    super(props);
    this.url = '/uploader';
    this.http = props.http;
  }

  uploadImage = (payload, config) => this.http.post(`${this.url}/image`, payload, config);
}
