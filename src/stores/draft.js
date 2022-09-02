import BaseStore from './base';

class DraftStore extends BaseStore {
  constructor(props) {
    super(props);
    this.api = props.api;
  }
}

export default DraftStore;
