import { decorate, observable } from 'mobx';
import BaseStore from './base';

class LogStore extends BaseStore {
  constructor(props) {
    super(props);
    this.api = props.api;
  }

  moderation = { data: [] };

  getAllModeration = (payload) => this.api.getAllModeration(payload);
  getModeration = (id, payload) => this.api.getModeration(id, payload);
  getAllRevision = (payload) => this.api.getAllRevision(payload);
  getRevision = (id, payload) => this.api.getRevision(id, payload);
  revertRevision = (id) => this.api.revertRevision(id);
  getAllSearch = () => this.api.getAllSearch();
  getSearch = (id) => this.api.getSearch(id);
  getEmails = (payload) => this.api.getEmails(payload);
  getIp = (payload) => this.api.getIp(payload);
  getUrl = (payload) => this.api.getUrl(payload);
}

export default decorate(LogStore, { moderation: observable });
