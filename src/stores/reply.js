import { decorate, observable } from 'mobx';
import BaseStore from './base';

class ReplyStore extends BaseStore {
  constructor(props) {
    super(props);
    this.api = props.api;
  }

  replies = { data: [] };
  replyNo = null;
  index = [];

  getByReplyNo = (payload) => this.api.getByReplyNo(payload);
  get = (post_id, payload) => this.api.get(post_id, payload);
  create = (post_id, payload) => this.api.create(post_id, payload);
  getUnread = (post_id, payload) => this.api.get(post_id, payload);
  getOne = (post_id, id) => this.api.getOne(post_id, id);
  replyIndex = async (post_id) => {
    const { data } = await this.api.replyIndex(post_id);
    this.index = data;
    return data;
  };
  update = (post_id, id, payload) => this.api.update(post_id, id, payload);
  delete = (post_id, id) => this.api.delete(post_id, id);

  read = (post_id, id) => this.api.read(post_id, id);
  like = (post_id, id) => this.api.like(post_id, id);
  removeLike = (post_id, id) => this.api.removeLike(post_id, id);
  flag = (post_id, id) => this.api.flag(post_id, id);
  removeFlag = (post_id, id) => this.api.removeFlag(post_id, id);
  bookmark = (post_id, id) => this.api.bookmark(post_id, id);
  removeBookmark = (post_id, id) => this.api.removeBookmark(post_id, id);
  spam = (post_id, id) => this.api.spam(post_id, id);
  removeSpam = (post_id, id) => this.api.removeSpam(post_id, id);
  changeCreator = (post_id, id, payload) => this.api.changeCreator(post_id, id, payload);
  likes = (post_id, id) => this.api.likes(post_id, id);
}

export default decorate(ReplyStore, {
  replies: observable,
  replyNo: observable,
  index: observable,
});
