import BaseServices from './base';

export default class UserServices extends BaseServices {
  constructor(props) {
    super(props);
    this.url = '/user';
    this.MeActivityUrl = '/me/activity/post';
    this.UserActivityUrl = '/user/activity';
    this.http = props.http;
  }

  me = () => this.http.get('/me');

  MyPost = () => this.http.get(`${this.ActivityUrl}/post`);
  MyLike = () => this.http.get(`${this.ActivityUrl}/like`);
  MyReply = () => this.http.get(`${this.ActivityUrl}/reply`);

  post = (id, payload) => this.http.get(`${this.UserActivityUrl}/${id}/post`, payload);
  like = (id, payload) => this.http.get(`${this.UserActivityUrl}/${id}/post/like`, payload);
  reply = (id, payload) => this.http.get(`${this.UserActivityUrl}/${id}/post/reply`, payload);
  replyViewed = (id, payload) => this.http.get(`${this.UserActivityUrl}/${id}/post/read`, payload);

  updateMe = (payload) => this.http.put('/me', payload);
  addReadingTime = (payload) => this.http.post('/me/addReadingTime', payload);

  mention = (payload) => this.http.get(`${this.url}/search/mention`, payload);

  addToGroup = (userId, groupId) => this.http.post(`${this.url}/${userId}/group/add/${groupId}`);
  removeFromGroup = (userId, groupId) => this.http.post(`${this.url}/${userId}/group/remove/${groupId}`);
}
