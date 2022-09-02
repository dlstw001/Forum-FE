import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Preview } from 'components/common/Form/Editor';
import { ROUTES } from 'definitions';
import DetailsTopicTitle from 'components/common/DetailsTopicTitle';
import Dropdown from 'components/common/Dropdown';
import FlagModal from 'components/Topics/Details/FlagModal';
import MessageBy from 'components/Topics/Details/PostedBy';
import MobileMenu from 'components/Profile/MobileMenu';
import Popover from 'react-popover-selector';
import React from 'react';
import ReminderModal from 'components/common/modals/ReminderModal';
import Replies from 'components/Topics/Details/Replies';
import Skeleton from 'react-loading-skeleton';
import Solution from 'components/Topics/Details/Solution';
import TopicTimer from 'components/Topics/Details/TopicTimer';
import TopicTimerModal from 'components/Topics/Details/TopicTimerModal';
import transform from 'components/Topics/transform';
import useToggle from 'hooks/useToggle';

const MessageDetails = ({ match, postStore, userStore, timerStore, history, messageStore }) => {
  const [timer, setTimer] = React.useState(undefined);
  const { displayName, id } = match.params;
  const [data, setData] = React.useState({ item: {} });
  const [content, setContent] = React.useState();
  const [quotedTopic, setQuoted] = React.useState('');

  const { handleToggle, toggle } = useToggle({
    settingDeleteModal: false,
    settingCloseModal: false,
    flagModal: false,
    settingArchiveModal: false,
    topicTimerModal: false,
  });
  const ref = React.useRef(null);
  const selRef = React.createRef();

  const getData = React.useCallback(async () => {
    await messageStore.getMy(id).then((res) => {
      setData(res);
    });
  }, [id, messageStore]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  const getTimer = React.useCallback(() => {
    timerStore
      .get(id)
      .then((res) => setTimer('item' in res ? (res.item.execured === true ? false : res) : false))
      .catch(() => setTimer(false));
  }, [id, timerStore]);

  React.useEffect(() => {
    if (id) getTimer();
  }, [id, getTimer]);

  const transformContent = React.useCallback(async () => {
    const content = await transform(data.item.raw || data.item.content);
    setContent(content);
  }, [data.item.content, data.item.raw]);

  React.useEffect(() => {
    transformContent();
  }, [transformContent]);

  React.useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_APP_NAME)) {
      const startingTime = Date.now();

      history.block(() => {
        var readingTime = (Date.now() - startingTime) / 1000;
        userStore.addReadingTime({ readingTime: readingTime });
      });
    }
  }, [userStore, history]);

  const onHandle = async (type) => {
    if (type === 'delete') {
      await postStore.delete(id);
    } else if (type === 'restore') {
      await postStore.update({ id: id, deleted: false });
    } else if (type === 'close') {
      await postStore.close(id);
    } else if (type === 'reopen') {
      await postStore.reopen(id);
    } else if (type === 'archive') {
      await postStore.archive(id);
    } else if (type === 'unarchive') {
      await postStore.unarchive(id);
    }
    getData();

    handleToggle({
      settingDeleteModal: false,
      settingCloseModal: false,
      settingArchiveModal: false,
    });
  };

  const handleTopicOnSuccess = () => {
    handleToggle({ topicTimerModal: false });
    setTimer(undefined);
    getTimer();
  };

  const onQuoteSelect = () => {
    setQuoted(
      `${quotedTopic}[quote="${data.item.creator.displayName}, post:${data.item._id}, reply:null"]${window
        .getSelection()
        .toString()}[/quote]\n`
    );
  };

  const goBack = () => {
    if (document.referrer === '') {
      history.push(`${ROUTES.USERS}/${displayName}/message/inbox`);
    } else {
      history.go(-1);
    }
  };

  return (
    <>
      <main className="container lg:flex">
        <div className="w-full">
          <div className="flex items-center justify-between">
            <button className="flex items-center mb-6 btn btn-icon-xs back-to-previous" onClick={goBack}>
              <i className="material-icons md-24">navigate_before</i>
              Back
            </button>
            <MobileMenu isPersonal={true} title="Messages">
              <Dropdown
                placement="bottom-end"
                menuClassname="text-black action-menu"
                className="flex items-center h-full"
                menu={() => (
                  <ul>
                    <li>
                      <button
                        className="flex items-center"
                        data-key={'delete_topic'}
                        onClick={
                          data.item.deleted
                            ? () => onHandle('restore')
                            : () => handleToggle({ settingDeleteModal: !toggle.settingDeleteModal })
                        }
                      >
                        <i className="material-icons topics-action">{data.item.deleted ? 'restore' : 'delete'}</i>
                        {data.item.deleted ? 'Restore Topic' : 'Delete Topic'}
                      </button>
                    </li>
                    {!data.item.deleted && (
                      <li>
                        <button
                          className="flex items-center"
                          onClick={() => handleToggle({ settingCloseModal: !toggle.settingCloseModal })}
                          data-cy="topic_openclose"
                        >
                          <i className="material-icons material-icons-sharp topics-action">topic</i>
                          {data.item.closed ? 'Open Topic' : 'Close Topic'}
                        </button>
                      </li>
                    )}
                    {!data.item.deleted && !data?.item?.closed && !data?.item?.flagged && (
                      <li>
                        <button
                          className="flex items-center"
                          data-key={'flag_topic'}
                          onClick={() => handleToggle({ flagModal: !toggle.flagModal })}
                          data-cy="topic_flag"
                        >
                          <i className="material-icons topics-action">flag</i>
                          Flag Topic
                        </button>
                      </li>
                    )}
                    {!data.item.deleted && (
                      <li>
                        <button
                          className="flex items-center"
                          onClick={() => handleToggle({ topicTimerModal: !toggle.topicTimerModal })}
                        >
                          <i className="material-icons topics-action">schedule</i>
                          Set Message Timer
                        </button>
                      </li>
                    )}
                    <li>
                      <Link
                        to={`${ROUTES.REVIEW}?post_id=${id}`}
                        className="flex items-center"
                        data-cy="topic_moderation_history"
                      >
                        <i className="material-icons topics-action">settings_backup_restore</i>
                        Moderation History
                      </Link>
                    </li>
                  </ul>
                )}
              >
                <button className="btn btn-icon" data-key={'open_topic_admin_actions'}>
                  <i className="material-icons">more_vert</i>
                </button>
              </Dropdown>
            </MobileMenu>
          </div>
          <div className="relative py-12 mb-8 post-original">
            {timer && <TopicTimer id={id} timer={timer.item} onSuccess={handleTopicOnSuccess} />}

            <DetailsTopicTitle data={data} />

            <div className="md:hidden">
              <MessageBy key={data.item._id} data={data.item} hideSpy={true} isMsg />
            </div>

            {content ? (
              <div className="html-preview">
                <Popover selectionRef={selRef} className="quote-field-btn">
                  <button onClick={onQuoteSelect}>
                    <i className="material-icons">format_quote</i>
                    Quote
                  </button>
                </Popover>
                <Preview data={content} quoteRef={selRef} />
              </div>
            ) : (
              <>
                <Skeleton count={5} />
                <div className="flex flex-col mb-4">
                  <Skeleton width={'70%'} />
                  <Skeleton width={'90%'} />
                  <Skeleton width={'30%'} />
                  <Skeleton width={'50%'} />
                </div>
                <Skeleton count={7} />
              </>
            )}

            {data.item?.accepted_answers &&
              !!data.item?.accepted_answers.length &&
              data.item?.accepted_answers.map((item, index) => <Solution key={index} index={index} item={item} />)}
          </div>

          <Replies
            id={id}
            post={data.item}
            refProp={ref}
            onSolution={getData}
            isMessage={true}
            quotedTopic={quotedTopic}
            canReply={data?.item?.canReply}
          />
        </div>
        <div className="hidden sidebar lg:pl-6 lg:ml-8 lg:block">
          <div className="sidebar-sticky-margin">
            <MessageBy key={data.item._id} data={data.item} hideSpy={true} isMsg />
          </div>
        </div>
      </main>
      {toggle.settingDeleteModal && (
        <ReminderModal
          onToggle={() => handleToggle({ settingDeleteModal: !toggle.settingDeleteModal })}
          message="Are you sure you want to delete a topic?"
          onHandle={() => onHandle('delete')}
        />
      )}
      {toggle.settingCloseModal && (
        <ReminderModal
          onToggle={() => handleToggle({ settingCloseModal: !toggle.settingCloseModal })}
          message={
            data.item.closed ? 'Are you sure you want to open a topic?' : 'Are you sure you want to close a topic?'
          }
          onHandle={() => onHandle(data.item.closed ? 'reopen' : 'close')}
        />
      )}
      {toggle.flagModal && (
        <FlagModal
          data={data.item}
          mode="post"
          onSuccess={getData}
          onToggle={() => handleToggle({ flagModal: !toggle.flagModal })}
        />
      )}
      {toggle.settingArchiveModal && (
        <ReminderModal
          onToggle={() => handleToggle({ settingArchiveModal: !toggle.settingArchiveModal })}
          message={
            data.item.archived
              ? 'Are you sure you want to unarchive a topic?'
              : 'Are you sure you want to archive a topic?'
          }
          onHandle={() => onHandle(data.item.archived ? 'unarchive' : 'archive')}
        />
      )}
      {toggle.topicTimerModal && (
        <TopicTimerModal
          id={id}
          onSuccess={handleTopicOnSuccess}
          onToggle={() => handleToggle({ topicTimerModal: !toggle.topicTimerModal })}
        />
      )}
    </>
  );
};

export default inject(({ postStore, userStore, timerStore, messageStore }) => ({
  postStore,
  userStore,
  timerStore,
  messageStore,
}))(observer(MessageDetails));
