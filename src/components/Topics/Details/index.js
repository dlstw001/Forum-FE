import { clearSelection, getTopicUrl } from 'utils';
import { first } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { parseHTML } from 'utils';
import { Preview } from 'components/common/Form/Editor';
import { ROUTES } from 'definitions';
import CategoryLine from 'components/common/CategoryLine';
import ChangeCreatorModal from './ChangeCreatorModal';
import ChangeSectionModal from './ChangeSectionModal';
import ClonePostModal from './ClonePostModal';
import cx from 'classnames';
import DetailsTopicTitle from 'components/common/DetailsTopicTitle';
import Dropdown from 'components/common/Dropdown';
import FlagModal from './FlagModal';
import Popover from 'react-popover-selector';
import PostedBy from './PostedBy';
import React from 'react';
import RelatedTopicsList from 'components/common/RelatedTopicsList';
import ReminderModal from 'components/common/modals/ReminderModal';
import Replies from './Replies';
import RevisionHistoryModal from './RevisionHistoryModal';
import ScrollToTop from 'components/common/ScrollToTop';
import Skeleton from 'react-loading-skeleton';
import Solution from './Solution';
import Timeline from 'components/common/Timeline';
import TopicModal from 'components/common/modals/TopicModal';
import TopicPinModal from './TopicPinModal';
import TopicTimer from './TopicTimer';
import TopicTimerModal from './TopicTimerModal';
import transform from '../transform';
import TrendingSectionList from 'components/common/TrendingSectionList';
import useClickCount from 'hooks/useClickCount';
import useMention from 'hooks/useMention';
import UserItem from 'components/common/UserItem';
import UserPopover from 'components/common/UserPopover';
import useToggle from 'hooks/useToggle';

const TopicDetails = ({ match, draftStore, postStore, replyStore, userStore, timerStore, history }) => {
  const [timer, setTimer] = React.useState(undefined);
  const [id, setId] = React.useState();
  const [data, setData] = React.useState({ item: {} });
  const [tagList, setTagList] = React.useState([]);
  const [content, setContent] = React.useState();
  const [user, setUser] = React.useState();
  const [sort, setSort] = React.useState();
  const [draft, setDraft] = React.useState();
  const [replyObject, setReplyObject] = React.useState();
  const { handleToggle, toggle } = useToggle({
    isLoading: true,
    settingDeleteModal: false,
    settingCloseModal: false,
    flagModal: false,
    settingArchiveModal: false,
    settingUnlistModal: false,
    createTopicModal: false,
    editTopicModal: false,
    topicTimerModal: false,
    topicPinModal: false,
    changeSectionModal: false,
    revisionHistoryModal: false,
    quotePopover: false,
    hidePost: false,
    changeCreatorModal: false,
    clonePostModal: false,
    editorFull: false,
    hiddenInfoModal: false,
    replyPopupForm: false,
    goToModal: false,
  });

  const ref = React.useRef(null);
  const previewRef = React.useRef(null);
  useClickCount(previewRef, id, content);
  const selRef = React.createRef();
  const buttonRef = React.useRef(null);
  const currentRef = React.useRef();

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

  React.useEffect(() => {
    const replyNo = match.params.replyNo;
    if (!replyNo) {
      window.scrollTo({
        top: 0,
        left: 0,
      });
    }
  }, [match.params.replyNo]);

  const getTimer = React.useCallback(() => {
    timerStore
      .get(id)
      .then((res) => setTimer('item' in res ? (res.item.executed === true ? false : res) : false))
      .catch(() => setTimer(false));
  }, [id, timerStore]);

  React.useEffect(() => {
    if (id) getTimer();
  }, [id, getTimer]);

  const transformContent = React.useCallback(async () => {
    handleToggle({ isLoading: true });
    const content = await transform(data.item.raw || data.item.content);
    setContent(content);
    handleToggle({ isLoading: false });
  }, [data.item.content, data.item.raw, handleToggle]);

  React.useEffect(() => {
    transformContent();
  }, [transformContent]);

  const getData = React.useCallback(async () => {
    const { slug, id } = match.params;
    if (id) {
      postStore.getById(id);
    } else {
      postStore.get(slug);
    }
  }, [match.params, postStore]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  React.useEffect(() => {
    const { current_page } = replyStore.replies;
    handleToggle({ hidePost: current_page !== 1 });
  }, [handleToggle, replyStore.replies]);

  React.useEffect(() => {
    const { item } = postStore.data;
    if (item) {
      setData(postStore.data);
      setId(item._id);
    }
  }, [postStore.data]);

  React.useEffect(() => {
    if (postStore.data.item && postStore.data.item.tags) {
      const options = postStore.data.item.tags.map((items) => {
        return items._id;
      });
      setTagList([...options]);
    }
  }, [postStore.data.item]);

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

  const handlePinTopic = async () => {
    handleToggle({ topicPinModal: false });
    getData();
  };

  const onClickReplyBtn = () => {
    ref?.current && ref.current.click();
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
          <Link className="text-primary" to={{ pathname: getTopicUrl(data.post, data.replyNo) }}>
            {data.creator.name}
          </Link>
        </UserItem>
      ),
      ...rest
    }) => {
      const draft = await getReplyDraft();
      const object = mode === 'reply' && draft ? draft : data;
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
          <Link className="text-primary form-title" to={{ pathname: getTopicUrl(post) }}>
            {parseHTML(post.title)}
          </Link>
        ),
      });
    },
    [data.item, handleForm]
  );

  const onQuoteSelect = () => {
    handleQuote(
      `[quote="${data.item.creator.displayName}, post:${data.item._id}"]${window
        .getSelection()
        .getRangeAt(0)
        .toString()
        .trim()}[/quote]\n`
    );
    clearSelection();
    handleToggle({ quotePopover: false });
  };

  const goBack = () => {
    if (history.length === 1) {
      history.push(document.referrer.replace(window.location.origin, ROUTES.TOPIC));
    } else {
      history.goBack();
    }
  };

  const isTopicCreator = userStore?.user?._id === data.item?.creator?._id;
  const isDeleted = data.item.deleted;

  // const debounceRef = React.useRef(
  //   debounce(() => {
  //     replyStore.replyNo = null;
  //   }, 500)
  // );

  // let options = {
  //   rootMargin: '-80px 0px -85% 0px',
  //   threshold: 0.1,
  // };

  // let observer = new IntersectionObserver((entries) => {
  //   const { isIntersecting, target } = entries[0];
  //   if (isIntersecting) {
  //     // debounceRef.current(target);
  //   }
  // }, options);

  // if (currentRef.current) {
  //   observer.observe(currentRef.current);
  // }

  const handleEditTopic = async () => {
    handleToggle({ editTopicModal: false });
    const res = await draftStore.find({ post: data.item._id });
    const draft = first(res.data.filter((i) => i.isPost));
    if (draft?.isPost) {
      setDraft(draft);
    }
    handleToggle({ editTopicModal: true });
  };

  const handleCreateTopic = async () => {
    handleToggle({ createTopicModal: !toggle.createTopicModal });
    const res = await draftStore.find({ isPost: true });

    const draft = first(res.data.filter((i) => !i.post));
    if (draft?.isPost) {
      setDraft(draft);
    }
  };

  const handleCleanup = (redirectUrl) => {
    handleToggle({ editTopicModal: false });
    handleToggle({ createTopicModal: false });
    setDraft(null);
    if (redirectUrl) {
      history.push(redirectUrl);
    } else {
      const { id } = match.params;
      postStore.get(id);
    }
  };

  const handleDiscardDraft = async (id, modal) => {
    handleToggle({ [modal]: false });
    await draftStore.delete(id);
    setDraft(null);
    handleToggle({ [modal]: true });
  };
  let showMenu = false;
  if (userStore.user) showMenu = true;
  if (userStore.user && userStore.IS_LEADER && isDeleted) showMenu = false;
  if (userStore.user && userStore.IS_ADMIN_OR_MODERATOR) showMenu = true;

  return (
    <>
      <ScrollToTop />
      <main className="container wrapper lg:flex">
        <div className="hidden xl:block sidebar left lg:mr-8">
          <div className="sidebar-sticky-margin">
            <TrendingSectionList />
            {!!tagList.length && <RelatedTopicsList tags={tagList} />}
          </div>
        </div>
        <div className="w-full">
          <section id={`main-post`} className={cx({ hidden: toggle.hidePost })} ref={currentRef}>
            <div className="flex items-center mb-4">
              <button className="flex items-center btn btn-icon-xs back-to-previous" onClick={goBack}>
                <i className="material-icons md-24">navigate_before</i>
                <span>Back</span>
              </button>

              {userStore.user && (
                <button className="ml-auto btn btn-icon-xs" onClick={handleCreateTopic}>
                  <i className="mr-2 icon-write-case material-icons md-16">edit</i>Write Your Own Topic
                </button>
              )}
            </div>
            <div className="relative pb-12 mb-8 post-original">
              {timer && <TopicTimer id={id} timer={timer.item} onSuccess={handleTopicOnSuccess} />}
              {data.item.flagged && (
                <>
                  <i className="mr-2 material-icons md-18">flag</i> You flagged this for moderation
                </>
              )}

              <div className="flex items-center justify-end my-3">
                {!(data.item.archived || data.item.closed) && data?.item?.canReply && userStore.user && (
                  <button className="btn btn-icon btn-reply" onClick={onClickReplyBtn}>
                    <i className="material-icons">reply</i>
                  </button>
                )}
                {showMenu && (
                  <>
                    <Dropdown
                      placement="bottom-end"
                      menuClassname="text-black action-menu"
                      className="flex items-center h-full"
                      menu={() => (
                        <ul>
                          {(isTopicCreator || userStore.IS_ADMIN_OR_MODERATOR) && (
                            <>
                              {!isDeleted && (
                                <li>
                                  <button
                                    className="btn-icon-text"
                                    onClick={handleEditTopic}
                                    data-key={'edit_topic'}
                                    data-cy="topic_edit"
                                  >
                                    <i className="material-icons topics-action">edit</i>
                                    Edit Post
                                  </button>
                                </li>
                              )}
                            </>
                          )}

                          {userStore.IS_ADMIN_OR_MODERATOR && (
                            <li>
                              <button
                                className="btn-icon-text"
                                onClick={
                                  isDeleted
                                    ? () => onHandle('restore')
                                    : () => handleToggle({ settingDeleteModal: !toggle.settingDeleteModal })
                                }
                                data-key={'delete_topic'}
                                data-cy="topic_delete"
                              >
                                <i className="material-icons topics-action">{isDeleted ? 'restore' : 'delete'}</i>
                                {isDeleted ? 'Restore Topic' : 'Delete Topic'}
                              </button>
                            </li>
                          )}

                          {(userStore.IS_LEADER || isTopicCreator) && (
                            <>
                              {!isDeleted && !userStore.IS_ADMIN_OR_MODERATOR && (
                                <>
                                  <li>
                                    <button
                                      className="btn-icon-text"
                                      onClick={() => handleToggle({ settingDeleteModal: !toggle.settingDeleteModal })}
                                      data-key={'delete_topic'}
                                      data-cy="topic_delete"
                                    >
                                      <i className="material-icons topics-action">delete</i>
                                      Delete Topic
                                    </button>
                                  </li>
                                </>
                              )}
                            </>
                          )}

                          {userStore.IS_ADMIN_OR_MODERATOR && (
                            <>
                              {!isDeleted && (
                                <li>
                                  <button
                                    className="btn-icon-text"
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

                          {!isDeleted && !data?.item?.closed && !data?.item?.flagged && (
                            <li>
                              <button
                                className="btn-icon-text"
                                data-key={'flag_topic'}
                                onClick={() => handleToggle({ flagModal: !toggle.flagModal })}
                                data-cy="topic_flag"
                              >
                                <i className="material-icons topics-action">flag</i>
                                Flag Topic
                              </button>
                            </li>
                          )}

                          {userStore.IS_ADMIN_OR_MODERATOR && (
                            <>
                              {!isDeleted && (
                                <>
                                  <li>
                                    <button
                                      className="btn-icon-text"
                                      onClick={() => handleToggle({ settingArchiveModal: !toggle.settingArchiveModal })}
                                      data-cy="topic_archiveunarchive"
                                    >
                                      <i className="material-icons topics-action">archive</i>
                                      {data.item.archived ? 'Unarchive' : 'Archive'}
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="btn-icon-text"
                                      onClick={() => handleToggle({ topicTimerModal: !toggle.topicTimerModal })}
                                      data-cy="topic_timer"
                                    >
                                      <i className="material-icons topics-action">schedule</i>
                                      Set Topic Timer
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="btn-icon-text"
                                      data-key={'pin_topic'}
                                      onClick={async () =>
                                        (data.item.isPinned || data.item.isPinnedGlobally) &&
                                        (new Date(data.item.isPinnedUntil) > new Date() ||
                                          data.item.isPinnedUntil === null)
                                          ? (await postStore.unpin(id)) && getData()
                                          : handleToggle({ topicPinModal: !toggle.topicPinModal })
                                      }
                                      data-cy="topic_pin"
                                    >
                                      <i className="material-icons topics-action">push_pin</i>
                                      {(data.item.isPinned || data.item.isPinnedGlobally) &&
                                      (new Date(data.item.isPinnedUntil) > new Date() ||
                                        data.item.isPinnedUntil === null)
                                        ? 'Un-Pin'
                                        : 'Pin'}{' '}
                                      Topic
                                    </button>
                                  </li>
                                </>
                              )}
                            </>
                          )}
                          {(isTopicCreator || userStore.IS_ADMIN_OR_MODERATOR) && (
                            <li>
                              <button
                                className="btn-icon-text"
                                onClick={() => handleToggle({ settingUnlistModal: !toggle.settingUnlistModal })}
                                data-cy="topic_listunlist"
                              >
                                <i className="material-icons topics-action">grade</i>
                                {data.item.unlisted ? 'Make Listed' : 'Make Unlisted'}
                              </button>
                            </li>
                          )}

                          {(userStore.IS_ADMIN_OR_MODERATOR || userStore.IS_LEADER) && (
                            <>
                              {!isDeleted && (
                                <li>
                                  <button
                                    className="btn-icon-text"
                                    onClick={() => handleToggle({ changeSectionModal: !toggle.changeSectionModal })}
                                    data-cy="topic_change_section"
                                  >
                                    <i className="material-icons material-icons-sharp topics-action">folder</i>
                                    Change Section
                                  </button>
                                </li>
                              )}
                            </>
                          )}
                          {!isDeleted && !!data.item.revision?.length && (
                            <li>
                              <button
                                className="btn-icon-text"
                                onClick={() => handleToggle({ revisionHistoryModal: !toggle.revisionHistoryModal })}
                                data-cy="topic_revision_history"
                              >
                                <i className="material-icons topics-action">history</i>
                                Revision History
                              </button>
                            </li>
                          )}
                          {userStore.IS_ADMIN_OR_MODERATOR && (
                            <li>
                              <Link
                                to={`${ROUTES.REVIEW}?post_id=${id}`}
                                className="btn-icon-text"
                                data-cy="topic_moderation_history"
                              >
                                <i className="material-icons topics-action">settings_backup_restore</i>
                                Moderation History
                              </Link>
                            </li>
                          )}
                          {userStore.IS_ADMIN_OR_MODERATOR && (
                            <li>
                              <button
                                className="btn-icon-text"
                                onClick={() => handleToggle({ changeCreatorModal: !toggle.changeCreatorModal })}
                              >
                                <i className="mr-2 icon-write-case material-icons md-16">edit</i>
                                Change Creator
                              </button>
                            </li>
                          )}
                          {userStore.IS_ADMIN_OR_MODERATOR && (
                            <li>
                              <button
                                className="btn-icon-text"
                                onClick={() => handleToggle({ clonePostModal: !toggle.clonePostModal })}
                              >
                                <i className="mr-2 icon-write-case material-icons md-16">content_copy</i>
                                Clone Post
                              </button>
                            </li>
                          )}
                        </ul>
                      )}
                    >
                      <button className="btn btn-icon" data-key={'open_topic_admin_actions'} data-cy="topic_functions">
                        <i className="material-icons">more_vert</i>
                      </button>
                    </Dropdown>
                  </>
                )}
              </div>
              <DetailsTopicTitle data={data} />

              {data.item.category ? (
                <CategoryLine category={data.item.category} hasChild={data.item.categoryHasChild} className="mb-4" />
              ) : (
                <Skeleton width={300} className="mb-12" />
              )}
              <div className="lg:hidden">
                <PostedBy key={data.item._id} data={data.item} />
              </div>
              <div
                ref={previewRef}
                className="html-preview"
                onMouseUp={() => {
                  if (!toggle.quotePopover && window.getSelection().getRangeAt(0).toString().trim().length > 0) {
                    handleToggle({ quotePopover: true });
                  }
                }}
              >
                {!toggle.isLoading ? (
                  <>
                    {userStore.user && (
                      <Popover
                        isOpen={toggle.quotePopover}
                        selectionRef={selRef}
                        className="quote-field-btn"
                        onTextSelect={() => {
                          if (window.getSelection().getRangeAt(0).toString().trim().length > 0) {
                            handleToggle({ quotePopover: true });
                          }
                        }}
                        onTextUnselect={() => {
                          handleToggle({ quotePopover: false });
                        }}
                      >
                        <button onClick={onQuoteSelect}>
                          <i className="material-icons">format_quote</i>
                          Quote
                        </button>
                      </Popover>
                    )}
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
            key={id}
            id={id}
            post={data.item}
            onSolution={getData}
            setQuote={handleQuote}
            canReply={data?.item?.canReply}
            onSort={setSort}
            store={replyStore}
            refProp={ref}
            draft={draft}
            setDraft={setDraft}
            toggle={toggle}
            handleToggle={handleToggle}
            replyObject={replyObject}
            setReplyObject={setReplyObject}
            handleForm={handleForm}
          />
        </div>
        <div className="hidden sidebar lg:pl-6 lg:ml-8 lg:block">
          <div className="sidebar-sticky-margin">
            <PostedBy key={data.item._id} data={data.item} />
            <Timeline id={data.item._id} post={data.item} invert={sort === 'desc'} store={replyStore} />
          </div>
        </div>
      </main>
      {toggle.createTopicModal && (
        <TopicModal
          onToggle={(show) => {
            handleToggle({ createTopicModal: show || !toggle.createTopicModal });
          }}
          data={draft}
          draft={draft}
          onCleanup={handleCleanup}
          onDiscardDraft={(id) => handleDiscardDraft(id, 'createTopicModal')}
        />
      )}
      {toggle.editTopicModal && (
        <TopicModal
          onToggle={(show = false) => handleToggle({ editTopicModal: show || !toggle.editTopicModal })}
          data={draft || data.item}
          draft={draft}
          onCleanup={handleCleanup}
          onDiscardDraft={(id) => handleDiscardDraft(id, 'editTopicModal')}
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
          id={id}
          onSuccess={handleTopicOnSuccess}
          onToggle={() => handleToggle({ topicTimerModal: !toggle.topicTimerModal })}
        />
      )}

      {toggle.topicPinModal && (
        <TopicPinModal
          id={id}
          onSuccess={handlePinTopic}
          onToggle={() => handleToggle({ topicPinModal: !toggle.topicPinModal })}
        />
      )}
      {toggle.changeSectionModal && (
        <ChangeSectionModal id={id} onToggle={() => handleToggle({ changeSectionModal: !toggle.changeSectionModal })} />
      )}
      {toggle.revisionHistoryModal && (
        <RevisionHistoryModal
          id={id}
          onToggle={() => handleToggle({ revisionHistoryModal: !toggle.revisionHistoryModal })}
          onEdit={() => handleToggle({ editTopicModal: !toggle.editTopicModal })}
          isAllowedToEdit={userStore.IS_ADMIN_OR_MODERATOR || isTopicCreator}
          onSuccess={getData}
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
      {toggle.changeCreatorModal && (
        <ChangeCreatorModal onToggle={() => handleToggle({ changeCreatorModal: !toggle.changeCreatorModal })} id={id} />
      )}
      {toggle.clonePostModal && (
        <ClonePostModal onToggle={() => handleToggle({ clonePostModal: !toggle.clonePostModal })} id={id} />
      )}
    </>
  );
};

export default inject(({ postStore, draftStore, userStore, timerStore, replyStore }) => ({
  postStore,
  draftStore,
  userStore,
  timerStore,
  replyStore,
}))(observer(TopicDetails));
