import BaseStore from './base';

class TimerStore extends BaseStore {
  constructor(props) {
    super(props);
    this.api = props.api;
  }

  get = (post_id) => this.api.get(post_id);
  update = (post_id, payload) => this.api.update(post_id, payload);
  delete = (post_id) => this.api.delete(post_id);
}

export default TimerStore;
