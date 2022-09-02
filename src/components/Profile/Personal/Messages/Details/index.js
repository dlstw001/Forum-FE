import { clearSelection, getMessageUrl } from 'utils';
import { first, isEmpty } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Preview } from 'components/common/Form/Editor';
import { ROUTES } from 'definitions';
import Breadcrumb from 'components/common/Breadcrumb';
import cx from 'classnames';
import DashboardSectionList from '../../../DashboardSectionList';
import DetailsTopicTitle from 'components/common/DetailsTopicTitle';
import FlagModal from 'components/Topics/Details/FlagModal';
import MessageBy from 'components/Topics/Details/PostedBy';
import MobileMenu from 'components/Profile/MobileMenu';
import Popover from 'react-popover-selector';
import React from 'react';
import ReminderModal from 'components/common/modals/ReminderModal';
import Replies from './Replies';
import Skeleton from 'react-loading-skeleton';
import Solution from 'components/Topics/Details/Solution';
import Timeline from 'components/common/Timeline';
import Tooltip from 'components/common/Tooltip';
import TopicTimer from 'components/Topics/Details/TopicTimer';
import TopicTimerModal from 'components/Topics/Details/TopicTimerModal';
import transform from 'components/Topics/transform';
import UserItem from 'components/common/UserItem';
import useToggle from 'hooks/useToggle';

const MessageDetails = ({ match, postStore, draftStore, userStore, timerStore, history, messageStore }) => {
  const [timer, setTimer] = React.useState(undefined);
  const { id, replyNo } = match.params;
  const [data, setData] = React.useState({ item: {} });
  const [content, setContent] = React.useState();
  const [sort, setSort] = React.useState();
  const [replyObject, setReplyObject] = React.useState();
  const [draft, setDraft] = React.useState();
  const [isArchived, setIsArchived] = React.useState();

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
    await messageStore.getMy(id);
  }, [id, messageStore]);

  React.useEffect(() => {
    setData(messageStore.message);
  }, [messageStore.message]);

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

  const handleQuote = (quote) => {
    const post = data.item;
    handleForm({
      data: post,
      mode: 'quote',
      content: quote,
      link: (
        <Link className="text-primary" to={{ pathname: getMessageUrl(post) }}>
          {post.title}
        </Link>
      ),
    });
  };

  const onQuoteSelect = () => {
    handleQuote(
      `[quote="${data.item.creator.displayName}, post:${data.item._id}"]${window.getSelection().toString()}[/quote]\n`
    );

    clearSelection();
    handleToggle({ quotePopover: false });
  };

  const goBack = () => {
    const backHref = sessionStorage.getItem('backHref');

    if (!isEmpty(backHref)) {
      sessionStorage.setItem('backHref', null);
      history.push(JSON.parse(backHref));
    } else history.go(-1);
  };

  const onClickReplyBtn = () => {
    ref?.current && ref.current.click();
  };

  const getReplyDraft = React.useCallback(async () => {
    const res = await draftStore.find({ post: data.item._id });

    const draft = first(res.data.filter((i) => !i.isPost));
    return !draft?.isPost && draft;
  }, [data.item._id, draftStore]);

  const handleForm = async ({
    mode,
    content: _content,
    link = (
      <UserItem user={data.creator} size="xs" className="mr-2">
        <Link className="text-primary" to={{ pathname: getMessageUrl(data.item, data.replyNo) }}>
          {data.creator.name}
        </Link>
      </UserItem>
    ),
    ...rest
  }) => {
    const draft = await getReplyDraft();
    const object = draft || {};
    const { raw, content } = object;
    setDraft(draft);
    const payload = {
      counter: replyObject?.counter + 1 || 0,
      content: _content || raw || content,
      mode,
      draft: draft,
      link,
      original: data,
      data: draft || data,
      ...rest,
    };
    setReplyObject(payload);

    handleToggle({ replyPopupForm: true });
  };

  React.useEffect(() => {
    setIsArchived(data.item.isArchived);
  }, [data.item.isArchived]);

  const handleArchive = async () => {
    const method = isArchived ? messageStore.unarchive : messageStore.archive;
    await method(data.item._id);
    getData();
  };

  return (
    <>
      <main className="container wrapper lg:flex">
        <DashboardSectionList className="hidden lg:block" isPersonal={true} />
        <div className="w-full">
          <div className="mb-4">
            <button className="flex items-center mb-2 mr-8 btn btn-icon-xs back-to-previous" onClick={goBack}>
              <i className="material-icons md-24">navigate_before</i>
              Back
            </button>
            <Breadcrumb
              between={{
                title: `Private Messages`,
                link: `${ROUTES.MESSAGES}`,
              }}
              title={data.item.title}
              link={`${match.url}`}
            />
          </div>
          <div className="relative pb-12 mb-8 post-original">
            {timer && <TopicTimer id={id} timer={timer.item} onSuccess={handleTopicOnSuccess} />}
            <div className="my-3">
              <MobileMenu isPersonal={true} title="Messages">
                <button className="ml-auto btn btn-icon" onClick={onClickReplyBtn}>
                  <i className="material-icons">reply</i>
                </button>
                <Tooltip
                  placement="top"
                  modifiers={[
                    {
                      name: 'offset',
                      options: {
                        offset: [0, 5],
                      },
                    },
                  ]}
                  containerClassName="bg-secondary py-2 px-4 rounded"
                  tooltip={isArchived ? 'Unarchive' : 'Archive'}
                >
                  <button
                    onClick={handleArchive}
                    className={cx('flex ml-auto btn btn-icon ')}
                    data-cy="user_messages_dropdown"
                  >
                    <i className={cx('material-icons-outlined transform', { 'rotate-180 ': isArchived })}>
                      move_to_inbox
                    </i>
                  </button>
                </Tooltip>
              </MobileMenu>
            </div>

            <DetailsTopicTitle data={data} />

            <div className="mt-4 lg:hidden">
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
            key={replyNo || id}
            id={id}
            post={data.item}
            isMessage
            canReply={data?.item?.canReply}
            onSort={setSort}
            store={messageStore}
            urlGenerator={getMessageUrl}
            setQuote={handleQuote}
            refProp={ref}
            getData={getData}
            toggle={toggle}
            draft={draft}
            setDraft={setDraft}
            handleToggle={handleToggle}
            replyObject={replyObject}
            setReplyObject={setReplyObject}
            handleForm={handleForm}
          />
        </div>
        <div className="hidden sidebar lg:pl-6 lg:ml-8 lg:block">
          <div className="sidebar-sticky-margin">
            <MessageBy key={data.item._id} data={data.item} hideSpy={true} isMsg />
            <Timeline
              urlGenerator={getMessageUrl}
              store={messageStore}
              id={data.item._id}
              post={data.item}
              invert={sort === 'desc'}
              isMessage
            />
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

export default inject(({ postStore, userStore, timerStore, messageStore, draftStore }) => ({
  postStore,
  userStore,
  timerStore,
  messageStore,
  draftStore,
}))(observer(MessageDetails));
