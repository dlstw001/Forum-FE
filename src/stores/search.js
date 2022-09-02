import BaseStore from './base';

class SearchStore extends BaseStore {
  constructor(props) {
    super(props);
    this.api = props.api;
  }

  createCTR = (id) => this.api.createCTR(id);
  getAdvanced = (payload) => this.api.getAdvanced(payload);
}

export default SearchStore;
