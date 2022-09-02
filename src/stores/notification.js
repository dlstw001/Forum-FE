import { decorate, observable } from 'mobx';
import BaseStore from './base';

class NotificationStore extends BaseStore {
  constructor(props) {
    super(props);
    this.api = props.api;
  }

  getNumber = async (payload, invalidate) => {
    if (this.count && !invalidate) {
      return this.count;
    } else {
      try {
        const res = this.api.getNumber(payload);
        this.count = res;
        return this.count;
      } catch (error) {
        throw new Error(error);
      }
    }
  };
  get = (userId, payload) => this.api.get(userId, payload);
  read = (payload) => this.api.read(payload);
  unread = (payload) => this.api.unread(payload);
  delete = (payload) => this.api.delete(payload);
  readUserId = (userId, payload) => this.api.readUserId(userId, payload);
  deleteUserId = (userId, payload) => this.api.deleteUserId(userId, payload);
}

export default decorate(NotificationStore, { count: observable });
