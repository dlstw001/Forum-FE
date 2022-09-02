import AuthServices from './auth';
import CaseServices from './case';
import CategoryServices from './category';
import CustomerCaseServices from './customerCase';
import DashboardServices from './dashboard';
import DraftServices from './draft';
import GroupServices from './group';
import Http from './http';
import LogServices from './log';
import MessageServices from './message';
import NotificationServices from './notification';
import PostServices from './post';
import QaServices from './qa';
import ReplyServices from './reply';
import ReviewServices from './review';
import SearchServices from './search';
import TagServices from './tag';
import TimerServices from './timer';
import UploadServices from './upload';
import UserServices from './user';
import UtilsServices from './utils';

const http = new Http();

export default {
  authServices: new AuthServices({ http }),
  categoryServices: new CategoryServices({ http }),
  postServices: new PostServices({ http }),
  replyServices: new ReplyServices({ http }),
  searchServices: new SearchServices({ http }),
  tagServices: new TagServices({ http }),
  userServices: new UserServices({ http }),
  dashboardServices: new DashboardServices({ http }),
  qaServices: new QaServices({ http }),
  notificationServices: new NotificationServices({ http }),
  customerCaseServices: new CustomerCaseServices({ http }),
  logServices: new LogServices({ http }),
  groupServices: new GroupServices({ http }),
  timerServices: new TimerServices({ http }),
  messageServices: new MessageServices({ http }),
  reviewServices: new ReviewServices({ http }),
  draftServices: new DraftServices({ http }),
  uploadServices: new UploadServices({ http }),
  utilsServices: new UtilsServices({ http }),
  caseServices: new CaseServices({ http }),
};
