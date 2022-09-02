import BaseServices from './base';

export default class ReplyServices extends BaseServices {
  constructor(props) {
    super(props);
    this.url = '/post';
    this.http = props.http;
  }

  getByReplyNo = ({ slug, id, replyNo }) => this.http.get(`${this.url}/${slug}/${id}/${replyNo}`);
  get = (post_id, payload) => this.http.get(`${this.url}/${post_id}/reply`, payload);
  create = (post_id, payload) => this.http.post(`${this.url}/${post_id}/reply`, payload);
  getUnread = (post_id, payload) => this.http.get(`${this.url}/${post_id}/reply/unread`, payload);
  getOne = (post_id, id) => this.http.get(`${this.url}/${post_id}/reply/${id}`);
  replyIndex = (post_id) => this.http.get(`${this.url}/${post_id}/reply/replyNo`);
  update = (post_id, id, payload) => this.http.put(`${this.url}/${post_id}/reply/${id}`, payload);
  delete = (post_id, id) => this.http.delete(`${this.url}/${post_id}/reply/${id}`);

  read = (post_id, id) => this.http.post(`${this.url}/${post_id}/reply/${id}/read`);
  like = (post_id, id) => this.http.post(`${this.url}/${post_id}/reply/${id}/like`);
  removeLike = (post_id, id) => this.http.post(`${this.url}/${post_id}/reply/${id}/dislike`);
  flag = (post_id, id) => this.http.post(`${this.url}/${post_id}/reply/${id}/flag`);
  removeFlag = (post_id, id) => this.http.post(`${this.url}/${post_id}/reply/${id}/unflag`);
  bookmark = (post_id, id) => this.http.post(`${this.url}/${post_id}/reply/${id}/bookmark`);
  removeBookmark = (post_id, id) => this.http.post(`${this.url}/${post_id}/reply/${id}/removeBookmark`);
  spam = (post_id, id) => this.http.post(`${this.url}/${post_id}/reply/${id}/spam`);
  removeSpam = (post_id, id) => this.http.post(`${this.url}/${post_id}/reply/${id}/unspam`);
  changeCreator = (post_id, id, payload) => this.http.post(`${this.url}/${post_id}/reply/${id}/changeCreator`, payload);
  likes = (post_id, id) => this.http.get(`${this.url}/${post_id}/reply/${id}/likes`);
}
