import AuthStore from './auth';
import CaseStore from './case';
import CategoryStore from './category';
import CustomerCaseStore from './customerCase';
import DashboardStore from './dashboard';
import DraftStore from './draft';
import EditorStore from './editor';
import GroupStore from './group';
import LogStore from './log';
import MessageStore from './message';
import NotificationStore from './notification';
import PostStore from './post';
import QaStore from './qa';
import ReplyStore from './reply';
import ReviewStore from './review';
import SearchStore from './search';
import services from 'services';
import TagStore from './tag';
import TimerStore from './timer';
import UploadStore from './upload';
import UserStore from './user';

export default {
  replyStore: new ReplyStore({ api: services.replyServices }),
  categoryStore: new CategoryStore({ api: services.categoryServices }),
  postStore: new PostStore({ api: services.postServices }),
  authStore: new AuthStore({ api: services.authServices }),
  searchStore: new SearchStore({ api: services.searchServices }),
  tagStore: new TagStore({ api: services.tagServices }),
  userStore: new UserStore({ api: services.userServices }),
  dashboardStore: new DashboardStore({ api: services.dashboardServices }),
  qaStore: new QaStore({ api: services.qaServices }),
  notificationStore: new NotificationStore({ api: services.notificationServices }),
  customerCaseStore: new CustomerCaseStore({ api: services.customerCaseServices }),
  logStore: new LogStore({ api: services.logServices }),
  groupStore: new GroupStore({ api: services.groupServices }),
  timerStore: new TimerStore({ api: services.timerServices }),
  messageStore: new MessageStore({ api: services.messageServices }),
  reviewStore: new ReviewStore({ api: services.reviewServices }),
  draftStore: new DraftStore({ api: services.draftServices }),
  uploadStore: new UploadStore({ api: services.uploadServices }),
  caseStore: new CaseStore({ api: services.caseServices }),
  editorStore: new EditorStore(),
};
