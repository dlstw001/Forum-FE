import BaseStore from './base';

class ReviewStore extends BaseStore {
  constructor(props) {
    super(props);
    this.api = props.api;
  }

  post = (post_id, payload) => this.api.post(post_id, payload);
  reply = (reply_id, payload) => this.api.reply(reply_id, payload);
  grouped = (payload) => this.api.grouped(payload);
}

export default ReviewStore;
