import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Modal, ModalHeader } from 'components/common/Modal';
import { ROUTES } from 'definitions';
import React from 'react';
import UserItem from 'components/common/UserItem';

const UserListModal = ({ postStore, title = 'Confirm', mode, onToggle, id }) => {
  const [items, setItems] = React.useState({ data: [] });

  const getData = React.useCallback(async () => {
    mode === 'like'
      ? await postStore.likeList(id, { limit: 1000 }).then((data) => {
          setItems(data);
        })
      : await postStore.contributorsList(id, { limit: 1000 }).then((data) => {
          setItems(data);
        });
  }, [id, postStore, mode]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  const FollowerItem = ({ user }) => {
    return (
      <Link
        className="flex items-center mb-4 item-contributor"
        to={`${ROUTES.PROFILE}/${user.displayName.toLowerCase()}`}
      >
        <div className="relative">
          <UserItem user={user} size="md" className="mr-4" />
          {mode === 'like' && (
            <i className="absolute bottom-0 right-0 material-icons md-20 md-heart btn-liked">favorite</i>
          )}
        </div>
        <div className="w-full">
          <div>{user.displayName}</div>
        </div>
      </Link>
    );
  };

  return (
    <Modal size="sm" containerClass="overflow-auto bg-secondary" onToggle={onToggle}>
      <div className="modal-contributors">
        <ModalHeader onToggle={onToggle}>{title}</ModalHeader>
        <div className="mb-4">
          {items.data.length !== 0
            ? items.data.map((item) => <FollowerItem key={item?.user?._id} user={item.user} />)
            : mode === 'like'
            ? 'No likes yet'
            : 'No contributors yet'}
        </div>
      </div>
    </Modal>
  );
};

export default inject(({ postStore }) => ({ postStore }))(observer(UserListModal));
