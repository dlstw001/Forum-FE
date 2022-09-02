import BaseStore from './base';

class TagStore extends BaseStore {
  constructor(props) {
    super(props);
    this.api = props.api;
  }

  tagListByCount = (payload) => this.api.tagListByCount(payload);
}

export default TagStore;
