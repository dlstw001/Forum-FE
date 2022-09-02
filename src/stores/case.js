import { decorate, observable } from 'mobx';
import BaseStore from './base';

class CaseStore extends BaseStore {
  constructor(props) {
    super(props);
    this.api = props.api;
  }

  replies = { data: [] };
  replyNo = null;
  index = [];

  hot = (payload) => this.api.hot(payload);
  trend = (payload) => this.api.trend(payload);
  unread = (payload) => this.api.unread(payload);
  myBookmarkList = (payload) => this.api.myBookmarkList(payload);
  followList = (payload) => this.api.followList(payload);
  relatedByTag = (payload) => this.api.relatedByTag(payload);
  relatedByTagCases = (payload) => this.api.relatedByTagCases(payload);

  like = (id) => this.api.like(id);
  removeLike = (id) => this.api.removeLike(id);
  flag = (id) => this.api.flag(id);
  removeFlag = (id) => this.api.removeFlag(id);
  bookmark = (id) => this.api.bookmark(id);
  removeBookmark = (id) => this.api.removeBookmark(id);
  spam = (id) => this.api.spam(id);
  removeSpam = (id) => this.api.removeSpam(id);
  follow = (id) => this.api.follow(id);
  removeFollow = (id) => this.api.removeFollow(id);

  close = (id) => this.api.close(id);
  reopen = (id) => this.api.reopen(id);
  archive = (id) => this.api.archive(id);
  unarchive = (id) => this.api.unarchive(id);
  publish = (id) => this.api.publish(id);
  unpublish = (id) => this.api.unpublish(id);
  list = (id) => this.api.list(id);
  unlist = (id) => this.api.unlist(id);

  changeCategory = (id, payload) => this.api.changeCategory(id, payload);

  pin = (id, payload) => this.api.pin(id, payload);
  unpin = (id) => this.api.unpin(id);
  solve = (id, payload) => this.api.solve(id, payload);
  unsolve = (id, payload) => this.api.unsolve(id, payload);

  likeList = (id, payload) => this.api.likeList(id, payload);
  contributorsList = (id, payload) => this.api.contributorsList(id, payload);
  bookmarkList = async (id, payload, invalidate) => {
    if (this.bookmarks && !invalidate) {
      return this.bookmarks;
    } else {
      try {
        const res = this.api.bookmarkList(id, payload);
        this.bookmarks = res;
        return res;
      } catch (error) {
        throw new Error(error);
      }
    }
  };

  getUnreadCount = () => this.api.getUnreadCount();

  updateNotificationLevel = (id, payload) => this.api.updateNotificationLevel(id, payload);

  createReply = (postId, payload) => this.api.createReply(postId, payload);
  getReply = (postId, payload) => this.api.getReply(postId, payload);
  getIndex = (postId) => this.api.getIndex(postId);
  getHottestTags = (payload) => this.api.getHottestTags(payload);

  replyIndex = async (postId) => {
    const { data } = await this.api.replyIndex(postId);
    this.index = data;
    return data;
  };
}

export default decorate(CaseStore, {
  bookmarks: observable,
  replies: observable,
  replyNo: observable,
});
