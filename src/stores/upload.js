import BaseStore from './base';

class UploadStore extends BaseStore {
  constructor(props) {
    super(props);
    this.api = props.api;
  }

  uploadImage = (payload, config) => this.api.uploadImage(payload, config);
}

export default UploadStore;
