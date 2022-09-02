import BaseStore from './base';

class GroupStore extends BaseStore {
  constructor(props) {
    super(props);
    this.api = props.api;
  }
  get = (id, payload) => this.api.get(id, payload);

  update = (id, payload) => this.api.update(id, payload);

  getAcitivityTopics = (id, payload) => this.api.getAcitivityTopics(id, payload);
  getAcitivityReplies = (id, payload) => this.api.getAcitivityReplies(id, payload);
  getPermissions = (id, payload) => this.api.getPermissions(id, payload);
  // activity - post - GET /api/v1/group/{id}/post?page=1
  // activity - reply - GET /api/v1/group/{id}/reply?page=1

  getUserList = (id, payload) => this.api.getUserList(id, payload);
}

export default GroupStore;
