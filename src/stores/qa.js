import BaseStore from './base';

class QaStore extends BaseStore {
  constructor(props) {
    super(props);
    this.api = props.api;
  }

  getSearch = (payload) => this.api.getSearch(payload);
}

export default QaStore;
