import BaseStore from './base';

class DashboardStore extends BaseStore {
  constructor(props) {
    super(props);
    this.api = props.api;
  }

  getSearch = (payload) => this.api.getSearch(payload);
  getTopReferredPost = (payload) => this.api.getTopReferredPost(payload);
  getTrustLvl = () => this.api.getTrustLvl();
  getActivity = (payload) => this.api.getActivity(payload);
  getTopUserActivity = () => this.api.getTopUserActivity();
}

export default DashboardStore;
