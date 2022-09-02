import { computed, decorate, observable } from 'mobx';
import BaseStore from './base';

class UserStore extends BaseStore {
  constructor(props) {
    super(props);
    this.api = props.api;
  }

  me = async (invalidate = false) => {
    if (this.user && !invalidate) {
      return this.user;
    } else {
      try {
        const { item } = await this.api.me();
        this.user = item;
        return item;
      } catch (error) {
        // throw new Error(error);
        return Promise.reject(error);
      }
    }
  };

  get isAdmin() {
    return this.user?.admin;
  }

  get IS_ADMIN_OR_MODERATOR() {
    return this.user?.moderator || this.user?.admin ? true : false;
  }

  get IS_LEADER() {
    return this.user?.leader;
  }

  MyPost = () => this.api.MyPost();
  MyLike = () => this.api.MyLike();
  MyReply = () => this.api.MyReply();

  post = (id, payload) => this.api.post(id, payload);
  like = (id, payload) => this.api.like(id, payload);
  reply = (id, payload) => this.api.reply(id, payload);
  replyViewed = (id, payload) => this.api.replyViewed(id, payload);

  updateMe = (payload) => this.api.updateMe(payload);
  addReadingTime = (payload) => this.api.addReadingTime(payload);

  all = async (payload) => {
    const res = await this.api.find(payload);
    return res.data.map((i) => ({ ...i, id: i._id }));
  };

  mention = async (payload) => {
    const res = await this.api.mention(payload);
    const { allUsers, contributors } = res;
    return [
      ...contributors.map(({ user: { avatar, displayName, _id } }) => ({ avatar, displayName, _id })),
      ...allUsers,
    ];
  };

  addToGroup = (userId, groupId) => this.api.addToGroup(userId, groupId);
  removeFromGroup = (userId, groupId) => this.api.removeFromGroup(userId, groupId);
}

export default decorate(UserStore, {
  user: observable,
  isAdmin: computed,
  IS_ADMIN_OR_MODERATOR: computed,
  IS_LEADER: computed,
});
