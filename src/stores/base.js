import { decorate, observable } from 'mobx';

const defaultData = () => ({
  isLoading: false,
  item: {},
});

export const defaultItems = () => ({
  isLoading: false,
  data: [],
});
class BaseStore {
  constructor(props) {
    this.api = props.api;
  }

  items = defaultItems();

  data = defaultData();

  find = (payload) => {
    return new Promise((resolve, reject) => {
      this.items.isLoading = true;
      this.api
        .find(payload)
        .then((res) => {
          this.items = { ...this.items, ...res };
          resolve(res);
        })
        .catch((err) => reject(err))
        .finally(() => {
          this.items.isLoading = false;
        });
    });
  };

  create = (payload) => this.api.create(payload);

  get = (id) => {
    this.data = { ...defaultData(), isLoading: true };
    return new Promise((resolve, reject) => {
      this.api
        .get(id)
        .then((res) => {
          this.data = { ...this.data, ...res };
          resolve(this.data);
        })
        .catch((err) => reject(err))
        .finally(() => {
          this.data.isLoading = false;
        });
    });
  };

  update = (payload) => this.api.update(payload);

  delete = (id) => this.api.delete(id);
}

export default decorate(BaseStore, {
  data: observable,
  items: observable,
});
