import { first } from 'lodash';
import { getCaseUrl } from 'utils';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { LOGIN_URL, ROUTES } from 'definitions';
import { parseHTML } from 'utils';
import { Preview } from 'components/common/Form/Editor';
import CaseModal from 'components/common/modals/Case/Create';
import DetailsTopicTitle from 'components/common/DetailsTopicTitle';
import Dropdown from 'components/common/Dropdown';
import FlagModal from 'components/Topics/Details/FlagModal';
import Popover from 'react-popover-selector';
import PostedBy from 'components/Topics/Details/PostedBy';
import React from 'react';
import RelatedCasesList from 'components/Cases/Details/RelatedCasesList';
import RelatedTopicsList from 'components/common/RelatedTopicsList';
import ReminderModal from 'components/common/modals/ReminderModal';
import Replies from './Replies';
import Skeleton from 'react-loading-skeleton';
import Solution from 'components/Topics/Details/Solution';
import Timeline from 'components/common/Timeline';
import TopicTimer from 'components/Topics/Details/TopicTimer';
import TopicTimerModal from 'components/Topics/Details/TopicTimerModal';
import transform from 'components/Topics/transform';
import useClickCount from 'hooks/useClickCount';
import useMention from 'hooks/useMention';
import UserItem from 'components/common/UserItem';
import UserPopover from 'components/common/UserPopover';
import useToggle from 'hooks/useToggle';

const Details = ({ match, caseStore, userStore, timerStore, postStore, history, draftStore }) => {
  const { slug, replyNo } = match.params;
  const [timer, setTimer] = React.useState(undefined);
  const [id, setId] = React.useState();
  const [data, setData] = React.useState({ item: {} });
  const [tagList, setTagList] = React.useState([]);
  const [quote, setQuote] = React.useState('');
  const [content, setContent] = React.useState();
  const [user, setUser] = React.useState();
  const [sort, setSort] = React.useState();
  const { handleToggle, toggle } = useToggle({
    editCaseModal: false,
    settingDeleteModal: false,
    settingCloseModal: false,
    flagModal: false,
    settingArchiveModal: false,
    settingUnlistModal: false,
    editTopicModal: false,
    topicTimerModal: false,
    revisionHistoryModal: false,
    replyPopupForm: false,
  });

  const [draft, setDraft] = React.useState();
  const [replyObject, setReplyObject] = React.useState();
  const ref = React.useRef(null);
  const previewRef = React.useRef(null);
  useClickCount(previewRef, id, content);
  const selRef = React.createRef();
  const buttonRef = React.useRef(null);

  useMention({
    content,
    buttonRef,
    ref: previewRef,
    onClick: (e) => {
      setUser(e.target.innerText.replace('@', '').trim());
      buttonRef.current = e.target;
      handleToggle({ userPopover: true });
    },
  });

  const getData = React.useCallback(async () => {
    await caseStore.get(slug).then((res) => setData(res));
  }, [slug, caseStore]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  React.useEffect(() => {
    if (caseStore.data.item) {
      setData(caseStore.data);
      setId(data.item._id);
    }
  }, [caseStore.data, data]);

  React.useEffect(() => {
    if (caseStore.data.item && caseStore.data.item.tags) {
      const options = caseStore.data.item.tags.map((items) => {
        return items._id;
      });
      setTagList([...options]);
    }
  }, [caseStore.data.item]);

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

  const onClickCreateButton = () => {
    userStore?.user ? handleToggle({ createModal: true }) : (window.location.href = LOGIN_URL);
  };

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
    } else if (type === 'unlist') {
      await postStore.unlist(id);
    } else if (type === 'list') {
      await postStore.list(id);
    }
    getData();

    handleToggle({
      settingDeleteModal: false,
      settingCloseModal: false,
      settingArchiveModal: false,
      settingUnlistModal: false,
    });
  };

  const handleTopicOnSuccess = () => {
    handleToggle({ topicTimerModal: false });
    setTimer(undefined);
    getTimer();
  };

  const executeScroll = () => ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const onQuoteSelect = () => {
    setQuote(
      `${quote}[quote="${data.item.creator.displayName}, post:${id}, reply:null"]${window
        .getSelection()
        .toString()}[/quote]\n`
    );
  };

  const goBack = () => {
    if (document.referrer === '') {
      history.push(ROUTES.CASES);
    } else {
      history.go(-1);
    }
  };

  const getReplyDraft = React.useCallback(async () => {
    if (data.item._id) {
      const res = await draftStore.find({ post: data.item._id });
      const draft = first(res.data.filter((i) => !i.isPost));
      return !draft?.isPost && draft;
    }
  }, [data.item._id, draftStore]);

  const handleForm = React.useCallback(
    async ({
      data,
      mode,
      content: _content,
      link = (
        <UserItem user={data.creator} size="xs" className="mr-2">
          <Link className="text-primary" to={{ pathname: getCaseUrl(data.post, data.replyNo) }}>
            {data.creator.name}
          </Link>
        </UserItem>
      ),
      ...rest
    }) => {
      const draft = await getReplyDraft();
      const object = draft || data;
      const { raw, content } = object;
      setDraft(draft);
      const payload = {
        original: data,
        counter: replyObject?.counter + 1 || 0,
        data: draft || data,
        content: _content || raw || content,
        mode,
        draft: draft,
        link,
        ...rest,
      };

      setReplyObject(payload);
      if (mode !== 'quote') {
        handleToggle({ replyPopupForm: false });
      }
      setTimeout(() => {
        handleToggle({ replyPopupForm: true });
      }, 100);
    },
    [getReplyDraft, handleToggle, replyObject]
  );

  const handleQuote = React.useCallback(
    (quote) => {
      const post = data.item;

      handleForm({
        data: post,
        mode: 'quote',
        content: quote,
        link: (
          <Link className="text-primary form-title" to={{ pathname: getCaseUrl(post) }}>
            {parseHTML(post.title)}
          </Link>
        ),
      });
    },
    [data.item, handleForm]
  );

  React.useEffect(() => {
    const replyNo = match.params.replyNo;
    if (!replyNo) {
      window.scrollTo({
        top: 0,
        left: 0,
      });
    }
  }, [match.params.replyNo]);

  return (
    <>
      <main className="container wrapper lg:flex">
        <div className="hidden xl:block sidebar left lg:mr-8">
          <div className="sidebar-sticky-margin">
            {!!tagList.length && <RelatedTopicsList tags={tagList} />}
            {!!tagList.length && <RelatedCasesList tags={tagList} />}
          </div>
        </div>
        <div className="w-full">
          <section id={`main-post`}>
            <div className="flex items-center mb-4">
              <button className="flex items-center btn btn-icon-xs back-to-previous" onClick={goBack}>
                <i className="material-icons md-24">navigate_before</i>
                <span>Back</span>
              </button>

              <button className="ml-auto btn btn-icon-xs" onClick={onClickCreateButton}>
                <i className="mr-2 icon-write-case material-icons md-16">edit</i>Write Your Own Customer Case
              </button>
            </div>
            <div className="relative pb-12 mb-8 post-original">
              {timer && <TopicTimer id={id} timer={timer.item} onSuccess={handleTopicOnSuccess} />}
              {data.item.flagged && (
                <>
                  <i className="mr-2 material-icons md-18">flag</i> You flagged this for moderation
                </>
              )}

              <div className="flex items-center justify-end my-3">
                {!(data.item.archived || data.item.closed) && userStore.user && (
                  <button className="btn btn-icon btn-reply" onClick={executeScroll}>
                    <i className="material-icons">reply</i>
                  </button>
                )}
                {userStore.user && (
                  <Dropdown
                    placement="bottom-end"
                    menuClassname="text-black action-menu"
                    className="flex items-center h-full"
                    menu={() => (
                      <ul>
                        {(userStore?.user?.admin ||
                          userStore?.user?.moderator ||
                          userStore?.user?._id === data.item?.creator?._id) && (
                          <>
                            {!data.item.deleted && (
                              <li>
                                <button
                                  className="flex items-center"
                                  onClick={() => handleToggle({ editCaseModal: !toggle.editCaseModal })}
                                  data-key={'edit_topic'}
                                  data-cy="topic_edit"
                                >
                                  <i className="material-icons topics-action">edit</i>
                                  Edit Post
                                </button>
                              </li>
                            )}

                            <li>
                              <button
                                className="flex items-center"
                                onClick={
                                  data.item.deleted
                                    ? () => onHandle('restore')
                                    : () => handleToggle({ settingDeleteModal: !toggle.settingDeleteModal })
                                }
                                data-key={'delete_topic'}
                                data-cy="topic_delete"
                              >
                                <i className="material-icons topics-action">
                                  {data.item.deleted ? 'restore' : 'delete'}
                                </i>
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
                          </>
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
                        {(userStore?.user?.admin ||
                          userStore?.user?.moderator ||
                          userStore?.user?._id === data.item?.creator?._id) && (
                          <>
                            {!data.item.deleted && (
                              <li>
                                <button
                                  className="flex items-center"
                                  onClick={() => handleToggle({ settingArchiveModal: !toggle.settingArchiveModal })}
                                  data-cy="topic_archiveunarchive"
                                >
                                  <i className="material-icons topics-action">archive</i>
                                  {data.item.archived ? 'Unarchive' : 'Archive'}
                                </button>
                              </li>
                            )}
                            {!data.item.deleted && (
                              <li>
                                <button
                                  className="flex items-center"
                                  onClick={() => handleToggle({ topicTimerModal: !toggle.topicTimerModal })}
                                  data-cy="topic_timer"
                                >
                                  <i className="material-icons topics-action">schedule</i>
                                  Set Topic Timer
                                </button>
                              </li>
                            )}
                            {!data.item.deleted && (
                              <li>
                                <button
                                  className="flex items-center"
                                  onClick={() => handleToggle({ settingUnlistModal: !toggle.settingUnlistModal })}
                                  data-cy="topic_listunlist"
                                >
                                  <i className="material-icons topics-action">grade</i>
                                  {data.item.unlisted ? 'Make Listed' : 'Make Unlisted'}
                                </button>
                              </li>
                            )}
                            {!data.item.deleted && !!data.item.revision?.length && (
                              <li>
                                <button
                                  className="flex items-center"
                                  onClick={() => handleToggle({ revisionHistoryModal: !toggle.revisionHistoryModal })}
                                  data-cy="topic_revision_history"
                                >
                                  <i className="material-icons topics-action">history</i>
                                  Revision History
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
                          </>
                        )}
                      </ul>
                    )}
                  >
                    <button className="btn btn-icon" data-key={'open_topic_admin_actions'} data-cy="topic_functions">
                      <i className="material-icons">more_vert</i>
                    </button>
                  </Dropdown>
                )}
              </div>
              <DetailsTopicTitle data={data} />

              <div className="lg:hidden">
                <PostedBy key={id} data={data.item} />
              </div>
              <div ref={previewRef} className="html-preview">
                {content ? (
                  <>
                    <Popover selectionRef={selRef} className="quote-field-btn">
                      <button onClick={onQuoteSelect}>
                        <i className="material-icons">format_quote</i>
                        Quote
                      </button>
                    </Popover>
                    <Preview data={content} quoteRef={selRef} />
                  </>
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
              </div>
              {data.item?.accepted_answers &&
                !!data.item?.accepted_answers.length &&
                data.item?.accepted_answers.map((item, index) => (
                  <Solution key={index} index={index} post={data.item} item={item} />
                ))}
            </div>
          </section>
          <Replies
            key={replyNo || id}
            id={id}
            post={data.item}
            onSolution={getData}
            setQuote={handleQuote}
            canReply={data?.item?.canReply}
            store={caseStore}
            onSort={setSort}
            sort={sort}
            refProp={ref}
            draft={draft}
            setDraft={setDraft}
            toggle={toggle}
            handleToggle={handleToggle}
            replyObject={replyObject}
            setReplyObject={setReplyObject}
            handleForm={handleForm}
            quote={quote}
          />
        </div>
        <div className="hidden sidebar lg:pl-6 lg:ml-8 lg:block">
          <div className="sidebar-sticky-margin">
            <PostedBy key={id} data={data.item} />
            <Timeline
              id={data.item._id}
              post={data.item}
              invert={sort === 'desc'}
              store={caseStore}
              urlGenerator={getCaseUrl}
              replyStore={caseStore}
            />
          </div>
        </div>
      </main>
      {toggle.createModal && (
        <CaseModal onToggle={(show) => handleToggle({ createModal: show || !toggle.createModal })} />
      )}
      {toggle.editCaseModal && (
        <CaseModal
          data={data.item}
          onToggle={(show) => handleToggle({ editCaseModal: show || !toggle.editCaseModal })}
        />
      )}
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
      {toggle.settingUnlistModal && (
        <ReminderModal
          onToggle={() => handleToggle({ settingUnlistModal: !toggle.settingUnlistModal })}
          message={
            data.item.unlisted ? 'Are you sure you want to list a topic?' : 'Are you sure you want to unlist a topic?'
          }
          onHandle={() => onHandle(data.item.unlisted ? 'list' : 'unlist')}
        />
      )}
      {toggle.topicTimerModal && (
        <TopicTimerModal
          id={data.item._id}
          onSuccess={handleTopicOnSuccess}
          onToggle={() => handleToggle({ topicTimerModal: !toggle.topicTimerModal })}
        />
      )}
      {toggle.userPopover && (
        <UserPopover
          onToggleMessage={() => handleToggle({ createMessage: !toggle.createMessage })}
          user={user}
          onClose={() => handleToggle({ userPopover: false })}
          buttonRef={buttonRef}
        />
      )}
    </>
  );
};

export default inject(({ caseStore, userStore, timerStore, postStore, draftStore, replyStore }) => ({
  caseStore,
  userStore,
  timerStore,
  postStore,
  draftStore,
  replyStore,
}))(observer(Details));
