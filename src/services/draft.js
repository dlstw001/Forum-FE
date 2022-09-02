import BaseServices from './base';

export default class DraftServices extends BaseServices {
  constructor(props) {
    super(props);
    this.url = '/draft';
    this.http = props.http;
  }
}
