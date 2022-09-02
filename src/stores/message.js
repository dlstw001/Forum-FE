import { decorate, observable } from 'mobx';
import BaseStore from './base';

class MessageStore extends BaseStore {
  constructor(props) {
    super(props);
    this.api = props.api;
  }

  replies = { data: [] };
  replyNo = null;
  message = { item: {} };

  find = (userId, payload) => this.api.find(userId, payload);
  get = (userId, messageId) => this.api.get(userId, messageId);
  post = (payload) => this.api.post(payload);
  sent = (userId, payload) => this.api.sent(userId, payload);
  getArchiveInbox = (userId, payload) => this.api.getArchiveInbox(userId, payload);
  getArchiveSent = (userId, payload) => this.api.getArchiveSent(userId, payload);

  archive = (userId, payload) => this.api.archive(userId, payload);
  unarchive = (userId, payload) => this.api.unarchive(userId, payload);
  delete = (userId, payload) => this.api.delete(userId, payload);

  createReply = (postId, payload) => this.api.createReply(postId, payload);
  getReply = (postId, payload) => this.api.getReply(postId, payload);

  findMy = (payload) => this.api.findMy(payload);
  getMy = async (payload) => {
    const res = await this.api.getMy(payload);
    this.message = res;
    return res;
  };
  sentMy = (payload) => this.api.sentMy(payload);
  getArchiveMy = (payload) => this.api.getArchiveMy(payload);
}

export default decorate(MessageStore, {
  replies: observable,
  replyNo: observable,
  message: observable,
});
