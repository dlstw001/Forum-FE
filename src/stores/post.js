import { decorate, observable } from 'mobx';
import BaseStore from './base';

import { has, uniqBy } from 'lodash';

const defaultData = () => ({
  isLoading: false,
  item: {},
});

export const defaultItems = () => ({
  isLoading: false,
  data: [],
});

export const TAB = {
  LATEST: 'latest',
  TRENDING: 'trending',
  UNREAD: 'unread',
};

class PostStore extends BaseStore {
  constructor(props) {
    super(props);
    this.api = props.api;
  }

  items = defaultItems();
  disableLoad = false;
  filters = { pageSize: 10, pageIndex: 1 };

  sortingParams = () => {
    switch (this.selectedTab) {
      case 'latest':
        return { sort_by: 'lastModified', order_by: 'desc' };
      case 'newest':
        return { sort_by: 'createdAt', order_by: 'desc' };
      case 'trending':
      case 'unread':
      case 'tags':
      default:
        return {};
    }
  };

  getData = async () => {
    this.isLoading = true;
    const payload = {
      ...this.sortingParams(),
      page: this.filters.pageIndex,
      limit: this.filters.pageSize,
    };

    let method = this.find;
    switch (this.selectedTab) {
      case TAB.TRENDING:
        method = this.trend;
        break;
      case TAB.UNREAD:
        method = this.unread;
        break;
      default:
        break;
    }

    await method(payload);
    this.isLoading = false;
  };

  getById = (id) => {
    this.data = { ...defaultData(), isLoading: true };
    return new Promise((resolve, reject) => {
      this.api
        .getById(id)
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

  find = (payload) => {
    return new Promise((resolve, reject) => {
      this.items.isLoading = true;
      this.api
        .find(payload)
        .then((res) => {
          if (payload.page > 1) {
            this.items = { ...this.items, ...res, data: uniqBy([...this.items.data, ...res.data], '_id') };
          } else {
            this.items = res;
          }
          resolve(res);
        })
        .catch((err) => reject(err))
        .finally(() => {
          this.items.isLoading = false;
        });
    });
  };

  hot = (payload) => {
    return new Promise((resolve, reject) => {
      this.items.isLoading = true;
      this.api
        .hot(payload)
        .then((res) => {
          // NOTE: postStore.items will be only affected if page payload is present
          if (has(payload, 'page')) {
            const items = res.data.map((i) => ({ ...i.document, ...i }));

            if (payload.page > 1) {
              this.items = { ...this.items, ...res, data: uniqBy([...this.items.data, ...items], '_id') };
            } else {
              this.items = { ...res, data: items };
            }
            this.disableLoad = true;
          }

          resolve(res);
        })
        .catch((err) => reject(err))
        .finally(() => {
          this.items.isLoading = false;
        });
    });
  };

  trend = (payload) => {
    return new Promise((resolve, reject) => {
      this.items.isLoading = true;
      this.api
        .trend(payload)
        .then((res) => {
          // NOTE: postStore.items will be only affected if page payload is present
          if (has(payload, 'page')) {
            const items = res.data.map((i) => ({ ...i.document, ...i }));

            if (payload.page > 1) {
              this.items = { ...this.items, ...res, data: uniqBy([...this.items.data, ...items], '_id') };
            } else {
              this.items = { ...res, data: items };
            }
            this.disableLoad = true;
          }

          resolve(res);
        })
        .catch((err) => reject(err))
        .finally(() => {
          this.items.isLoading = false;
        });
    });
  };

  unread = (payload) => {
    return new Promise((resolve, reject) => {
      this.items.isLoading = true;
      this.api
        .unread(payload)
        .then((res) => {
          const items = res.data.map((i) => ({ ...i.document, ...i }));

          if (payload.page > 1) {
            this.items = { ...this.items, ...res, data: uniqBy([...this.items.data, ...items], '_id') };
          } else {
            this.items = { ...res, data: items };
          }
          this.disableLoad = true;
          resolve(res);
        })
        .catch((err) => reject(err))
        .finally(() => {
          this.items.isLoading = false;
        });
    });
  };

  myBookmarkList = (payload) => this.api.myBookmarkList(payload);
  followList = (payload) => this.api.followList(payload);
  relatedByTag = (payload) => this.api.relatedByTag(payload);
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
  changeCreator = (id, payload) => this.api.changeCreator(id, payload);
  clone = (id, payload) => this.api.clone(id, payload);
}

export default decorate(PostStore, {
  bookmarks: observable,
  items: observable,
  disableLoad: observable,
  sort: observable,
  selectedTab: observable,
  filters: observable,
  isLoading: observable,
});
