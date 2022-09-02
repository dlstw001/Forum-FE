import BaseServices from './base';

export default class PostServices extends BaseServices {
  constructor(props) {
    super(props);
    this.url = '/post';
    this.http = props.http;
  }

  getById = (id) => this.http.get(`${this.url}/slug/${id}`);
  hot = (payload) => this.http.get(`${this.url}/hot`, payload);
  trend = (payload) => this.http.get(`${this.url}/trend`, payload);
  unread = (payload) => this.http.get(`${this.url}/unread`, payload);
  myBookmarkList = (payload) => this.http.get(`${this.url}/bookmark`, payload);
  followList = (payload) => this.http.get(`${this.url}/follow`, payload);
  relatedByTag = (payload) => this.http.get(`${this.url}/relatedByTag`, payload);

  like = (id) => this.http.post(`${this.url}/${id}/like`);
  removeLike = (id) => this.http.post(`${this.url}/${id}/dislike`);
  flag = (id) => this.http.post(`${this.url}/${id}/flag`);
  removeFlag = (id) => this.http.post(`${this.url}/${id}/unflag`);
  bookmark = (id) => this.http.post(`${this.url}/${id}/bookmark`);
  removeBookmark = (id) => this.http.post(`${this.url}/${id}/removeBookmark`);
  spam = (id) => this.http.post(`${this.url}/${id}/spam`);
  removeSpam = (id) => this.http.post(`${this.url}/${id}/unspam`);
  follow = (id) => this.http.post(`${this.url}/${id}/follow`);
  removeFollow = (id) => this.http.post(`${this.url}/${id}/unfollow`);

  close = (id) => this.http.post(`${this.url}/${id}/close`);
  reopen = (id) => this.http.post(`${this.url}/${id}/reopen`);
  archive = (id) => this.http.post(`${this.url}/${id}/archive`);
  unarchive = (id) => this.http.post(`${this.url}/${id}/unarchive`);
  publish = (id) => this.http.post(`${this.url}/${id}/publish`);
  unpublish = (id) => this.http.post(`${this.url}/${id}/unpublished`);
  list = (id) => this.http.post(`${this.url}/${id}/listed`);
  unlist = (id) => this.http.post(`${this.url}/${id}/unlisted`);

  changeCategory = (id, payload) => this.http.post(`${this.url}/${id}/changeCategory`, payload);

  pin = (id, payload) => this.http.post(`${this.url}/${id}/pin`, payload);
  unpin = (id) => this.http.post(`${this.url}/${id}/unpin`);

  solve = (id, payload) => this.http.post(`${this.url}/${id}/solved`, payload);
  unsolve = (id, payload) => this.http.post(`${this.url}/${id}/unsolved`, payload);

  likeList = (id, payload) => this.http.get(`${this.url}/${id}/likes`, payload);
  contributorsList = (id, payload) => this.http.get(`${this.url}/${id}/contributors`, payload);
  bookmarkList = (id, payload) => this.http.get(`${this.url}/${id}/bookmarks`, payload);

  getUnreadCount = () => this.http.get(`${this.url}/unread/count`);

  updateNotificationLevel = (id, payload) => this.http.post(`${this.url}/${id}/notificationLevel`, payload);
  changeCreator = (id, payload) => this.http.post(`${this.url}/${id}/changeCreator`, payload);
  clone = (id, payload) => this.http.post(`${this.url}/${id}/clone`, payload);
}
