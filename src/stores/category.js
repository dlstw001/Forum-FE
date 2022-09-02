import { computed, decorate, observable } from 'mobx';
import BaseStore from './base';

class CategoryStore extends BaseStore {
  constructor(props) {
    super(props);
    this.api = props.api;
  }
  list = { data: [], isLoading: false };

  get mapped() {
    const parents = this.list.data.filter((i) => !i.parent);
    const children = this.list.data.filter((i) => i.parent);
    return parents
      .map((i) => {
        return { ...i, sub: children.filter((child) => child.parent._id === i._id) };
      })
      .reduce((acc, value) => {
        return [...acc, value, ...value.sub];
      }, []);
  }

  all = (invalidate = false) => {
    return new Promise((resolve, reject) => {
      const payload = { limit: 1000 };

      if (this.list.data.length > 0) {
        resolve(this.list.data);
      } else {
        if (!this.list.isLoading || invalidate) {
          this.list.isLoading = true;
          this.api
            .find(payload)
            .then((res) => {
              this.list = { data: res.data, isLoading: false };
              resolve(res.data);
            })
            .catch((err) => reject(err));
        }
      }
    });
  };

  update = (id, payload) => this.api.update(payload, id);

  trend = (payload) => this.api.trend(payload);
  trendFixed = (payload) => this.api.trendFixed(payload);
  tags = (id, payload) => this.api.tags(id, payload);
  reorderCategory = (payload) => this.api.reorderCategory(payload);
}

export default decorate(CategoryStore, { mapped: computed, list: observable });
