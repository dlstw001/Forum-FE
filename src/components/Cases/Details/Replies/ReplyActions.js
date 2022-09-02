import { getCaseUrl } from 'utils';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router';
import ChangeCreatorModal from 'components/Topics/Details/ChangeCreatorModal';
import cx from 'classnames';
import FlagModal from 'components/Topics/Details/FlagModal';
import MoveModal from 'components/Topics/Details/MoveModal';
import React from 'react';
import ReminderModal from 'components/common/modals/ReminderModal';
import Tooltip from 'components/common/Tooltip';
import useToggle from 'hooks/useToggle';

const ActionBar = ({
  store,
  postStore,
  post,
  data,
  userStore,
  replyStore,
  handleForm,
  onDelete,
  onEdit,
  isMessage,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [likeItems, setLikeItems] = React.useState({ data: [] });
  const history = useHistory();
  const { toggle, handleToggle } = useToggle({
    flagModal: false,
    moveModal: false,
    restoreModal: false,
    changeCreatorModal: false,
  });

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (copied) setCopied(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [copied]);

  const handleLikeClick = async () => {
    if (data.liked) {
      await store.removeLike(data.post._id, data._id);
      data.noLikes = data.noLikes - 1;
      data.liked = false;
    } else {
      await store.like(data.post._id, data._id);
      data.noLikes = data.noLikes + 1;
      data.liked = true;
    }
  };

  const copyToClipboard = () => {
    const { replyNo } = data;
    const url = `${window.location.host}${getCaseUrl(post, replyNo)}`;
    const httpUrl =
      process.env.REACT_APP_ENVIRONMENT === 'production' || process.env.REACT_APP_ENVIRONMENT === 'staging'
        ? `https://${url}`
        : `http://${url}`;
    const dummy = document.createElement('input');

    document.body.appendChild(dummy);
    dummy.value = httpUrl;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    setCopied(true);
  };

  const handleRestore = async () => {
    const { item } = await replyStore.update(data.post._id, data._id, { deleted: false });

    history.push(getCaseUrl(post, item.replyNo));
    handleToggle({ restoreModal: !toggle.restoreModal });
  };

  const handleHover = () => {
    if (data.noLikes > 0) {
      replyStore.likes(post._id, data._id).then((res) => {
        setLikeItems(res);
      });
    }
  };

  const handleDelete = async () => {
    await onDelete();
    replyStore.replyIndex(post._id);
  };

  return (
    <>
      <div className="flex flex-wrap items-center response-action">
        {handleForm && !post.deleted && (!post.archived || !post.closed) && !data.deleted && userStore.user && (
          <button className="btn btn-response-action reply" onClick={() => handleForm({ data, mode: 'reply' })}>
            Reply
          </button>
        )}

        {!post.deleted &&
          (data?.creator?._id === userStore.user?._id || userStore.IS_ADMIN_OR_MODERATOR) &&
          !data.deleted && (
            <>
              {onEdit && (
                <button
                  className="btn btn-response-action edit"
                  onClick={() => onEdit(data)}
                  data-cy={`edit_reply_btn_${data._id}`}
                >
                  Edit
                </button>
              )}
              {onDelete && !post.archived && (
                <button
                  className="btn btn-response-action delete"
                  onClick={handleDelete}
                  data-cy={`delete_reply_btn_${data._id}`}
                >
                  Delete
                </button>
              )}
            </>
          )}
        {!isMessage &&
          !post.deleted &&
          !data.deleted &&
          (post.archived || !userStore.user ? (
            <div className={cx('btn-like')}>
              <i
                className={cx('mr-1 md-16 material-icons md-heart', {
                  'btn-liked': data.liked,
                })}
              >
                favorite
              </i>
              <span>{data.noLikes || 0}</span>
            </div>
          ) : (
            <Tooltip
              placement="bottom"
              trigger={data.noLikes ? 'hover' : null}
              // modifiers={[
              //   {
              //     name: 'offset',
              //     options: {
              //       offset: [0, 10],
              //     },
              //   },
              // ]}
              tooltip={
                <ul>
                  {likeItems.data.slice(0, 6).map((item, index) => (
                    <li key={index} className="mb-1">
                      {item.user.displayName}
                    </li>
                  ))}
                  {likeItems.data.length > 6 && (
                    <li key={6} className="mb-1">
                      {'and ' + (likeItems.data.length - 6) + ' more ...'}
                    </li>
                  )}
                </ul>
              }
            >
              <button
                className="ml-4 btn-like"
                onClick={handleLikeClick}
                data-cy={`like_reply_btn_${data._id}`}
                onMouseEnter={handleHover}
              >
                <i
                  className={cx('mr-1 md-16 material-icons md-heart', {
                    'btn-liked': data.liked,
                  })}
                >
                  favorite
                </i>
                <span>{data.noLikes || 0}</span>
              </button>
            </Tooltip>
          ))}
        {!isMessage &&
          !post.deleted &&
          !data.flagged &&
          !postStore.data?.item?.closed &&
          !data.deleted &&
          userStore.user && (
            <button
              className={cx('ml-4 font-semibold')}
              onClick={() => handleToggle({ flagModal: !toggle.flagModal })}
              data-cy={`flag_reply_btn_${data._id}`}
            >
              <i className="mr-1 md-16 material-icons">flag</i>
              Flag
            </button>
          )}

        {!isMessage && !post.deleted && userStore.IS_ADMIN_OR_MODERATOR && !data.deleted && (
          <button
            className="ml-4 font-semibold"
            onClick={() => handleToggle({ moveModal: !toggle.moveModal })}
            data-cy={`move_reply_btn_${data._id}`}
          >
            <i className="mr-1 md-16 material-icons">exit_to_app</i>
            Move To
          </button>
        )}

        {!isMessage && userStore.IS_ADMIN_OR_MODERATOR && !data.deleted && (
          <button
            className="ml-4 font-semibold"
            onClick={() => handleToggle({ changeCreatorModal: !toggle.changeCreatorModal })}
            data-cy={`restore_reply_btn_${data._id}`}
          >
            <i className="mr-1 md-16 material-icons">edit</i>
            Change Creator
          </button>
        )}

        {userStore.IS_ADMIN_OR_MODERATOR && data.deleted && (
          <button
            className="font-semibold"
            onClick={() => handleToggle({ restoreModal: !toggle.restoreModal })}
            data-cy={`restore_reply_btn_${data._id}`}
          >
            <i className="mr-1 md-16 material-icons">restore</i>
            Restore
          </button>
        )}

        {!post.deleted && !data.deleted && !isMessage && (
          <button
            className="ml-auto font-semibold"
            onClick={copyToClipboard}
            data-cy={`move_reply_btn_${data._id}`}
            title="Copy link to clipboard"
          >
            {!copied && <i className="mr-1 md-16 material-icons transform -rotate-45">link</i>}
            {copied && <i className="mr-1 md-16 material-icons">done</i>}
          </button>
        )}
      </div>
      {toggle.flagModal && (
        <FlagModal data={data} mode="reply" onToggle={() => handleToggle({ flagModal: !toggle.flagModal })} />
      )}
      {toggle.moveModal && (
        <MoveModal data={data} mode="reply" onToggle={() => handleToggle({ moveModal: !toggle.moveModal })} />
      )}
      {toggle.restoreModal && (
        <ReminderModal
          onToggle={() => handleToggle({ restoreModal: !toggle.restoreModal })}
          title="Restore the reply"
          message="Are you sure you want to restore the reply?"
          onHandle={handleRestore}
        />
      )}
      {toggle.changeCreatorModal && (
        <ChangeCreatorModal
          onToggle={() => handleToggle({ changeCreatorModal: !toggle.changeCreatorModal })}
          id={post._id}
          reply_id={data._id}
          type="reply"
        />
      )}
    </>
  );
};

export default inject(({ userStore, replyStore, postStore, caseStore }) => ({
  userStore,
  replyStore,
  postStore,
  caseStore,
}))(observer(ActionBar));
