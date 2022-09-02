import BaseStore from './base';

export default class WordpressStore extends BaseStore {
  constructor(props) {
    super(props);
    this.api = props.api;
  }

  create = (payload) => this.api.create(payload);
  getCostumerCases = (payload) => this.api.getCustomerCases(payload);
  getPartners = (keyword) => this.api.getPartners(keyword);
  getClients = (keyword) => this.api.getClients(keyword);
  uploadMedia = (payload) => this.api.uploadMedia(payload);
  getTags = (keyword) => this.api.getTags(keyword);
  createClient = (payload) => this.api.createClient(payload);
  createPartner = (payload) => this.api.createPartner(payload);
  createTag = (payload) => this.api.createTag(payload);

  getReplies = (id, payload) => this.api.getReplies(id, payload);
  addReplies = (id, payload) => this.api.addReplies(id, payload);
  getHottestTags = (payload) => this.api.getHottestTags(payload);
  search = (payload) => this.api.search(payload);
}
