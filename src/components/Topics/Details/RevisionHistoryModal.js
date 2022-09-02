import { distanceDateFormat } from 'utils';
import { first } from 'lodash';
import { getHtml } from 'components/common/Form/Editor';
import { inject } from 'mobx-react';
import { Modal, ModalFooter, ModalHeader } from 'components/common/Modal';
import cx from 'classnames';
import HtmlDiff from 'htmldiff-js';
import HtmlParser from 'react-html-parser';
import Loading from 'components/common/Loading';
import Pager from 'components/common/Pager';
import React from 'react';
import UserItem from 'components/common/UserItem';
import useToggle from 'hooks/useToggle';

const VIEW_OPTIONS = [
  {
    label: 'HTML',
    value: 'html',
  },
  {
    label: 'Split',
    value: 'split',
  },
  {
    label: 'Raw',
    value: 'raw',
  },
];
const VIEW = {
  HTML: 'html',
  SPLIT: 'split',
  RAW: 'raw',
};

const RevisionHistoryModal = ({ id, onEdit, onToggle, logStore, onSuccess, isAllowedToEdit }) => {
  const [data, setData] = React.useState({});
  const [item, setItem] = React.useState({ from: {}, to: {} });
  const { toggle, handleToggle } = useToggle({
    raw: false,
    isLoading: false,
  });
  const [view, setView] = React.useState(VIEW.HTML);

  const [filters, setFilters] = React.useState({
    pageSize: 1,
    pageIndex: 1,
    order_by: 'desc',
    sort_by: 'createdAt',
  });

  React.useEffect(() => {
    const item = first(data.data);
    if (item) {
      setItem(item);
    }
  }, [data.data]);

  const getData = React.useCallback(async () => {
    const payload = {
      limit: filters.pageSize,
      page: filters.pageIndex,
      post: id,
      order_by: filters.order_by,
      sort_by: filters.sort_by,
    };
    handleToggle({ isLoading: true });
    await logStore.getAllRevision(payload).then((res) => setData(res));
    handleToggle({ isLoading: false });
  }, [filters.order_by, filters.pageIndex, filters.pageSize, filters.sort_by, handleToggle, id, logStore]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  const fetchData = React.useCallback((options) => {
    setFilters((prevState) => ({ ...prevState, ...options }));
  }, []);

  const handlePagination = (pageIndex) => {
    fetchData({ pageIndex });
  };

  const handleRevert = async () => {
    await logStore.revertRevision(item._id);
    onSuccess();
    onToggle();
  };

  const toggleOutput = (i) => {
    setView(i.value);
  };

  return (
    <Modal size="full" containerClass="bg-secondary" onToggle={onToggle}>
      <div className="p-6">
        <ModalHeader onToggle={onToggle}>Revision History</ModalHeader>
        <div className="flex justify-between">
          <div className="flex items-start">
            <UserItem user={item.creator} size="md" className="mr-4 media-avatar max-w-none" />
            <div>
              <span className="creator-name">
                <span className="cursor-pointer">{item.creator?.displayName}</span>
              </span>
              <p className="text-sm leading-tight capitalize">
                <span className="block">{item.creator?.role}</span>
                <span className="block">{item.creator?.moderator && 'Peplink Team'}</span>
                {distanceDateFormat(item.createdAt)}
              </p>
            </div>
          </div>

          <div>
            {VIEW_OPTIONS.map((i, key) => (
              <button
                key={key}
                className={cx('ml-2 btn btn-outline', { active: i.value === view })}
                onClick={() => toggleOutput(i)}
              >
                {i.label}
              </button>
            ))}
          </div>
        </div>
        <div className={cx('flex', `view-${view}`)}>
          <form className="relative break-words html-diff-before">
            {toggle.isLoading && <Loading />}
            {item.to?.title && (
              <div className="form-group">
                <label>Title</label>
                <div className="mb-4 html-diff word-break">
                  {HtmlParser(HtmlDiff.execute(item.from?.title || '', item.to?.title || ''))}
                </div>
              </div>
            )}
            {(item.from?.content || item.to?.content) && (
              <div className="form-group">
                <label>Topic</label>
                <div className="break-all wysiwyg-editor">
                  <div className="mb-4 html-diff html-preview ">
                    {view === VIEW.RAW
                      ? HtmlParser(HtmlDiff.execute(item.from?.content || '', item.to?.content || ''))
                      : HtmlParser(getHtml(HtmlDiff.execute(item.from?.content || '', item.to?.content || '')))}
                  </div>
                </div>
              </div>
            )}
            {item.to?.category && (
              <div className="form-group">
                <label>Category</label>
                <div className="mb-4 html-diff word-break">
                  {HtmlParser(HtmlDiff.execute(item.from?.category?.name || '', item.to?.category?.name || ''))}
                </div>
              </div>
            )}
          </form>

          {view !== VIEW.HTML && (
            <form className="relative break-words html-diff-after">
              {toggle.isLoading && <Loading />}
              {item.to?.title && (
                <div className="form-group">
                  <label>Title</label>
                  <div className="mb-4 html-diff word-break">
                    {HtmlParser(HtmlDiff.execute(item.from?.title || '', item.to?.title || ''))}
                  </div>
                </div>
              )}
              {(item.from?.content || item.to?.content) && (
                <div className="form-group">
                  <label>Topic</label>
                  <div className="break-all wysiwyg-editor">
                    <div className="mb-4 html-diff html-preview ">
                      {view === VIEW.RAW
                        ? HtmlParser(HtmlDiff.execute(item.from?.content || '', item.to?.content || ''))
                        : HtmlParser(getHtml(HtmlDiff.execute(item.from?.content || '', item.to?.content || '')))}
                    </div>
                  </div>
                </div>
              )}
              {item.to?.category && (
                <div className="form-group">
                  <label>Category</label>
                  <div className="mb-4 html-diff word-break">
                    {HtmlParser(HtmlDiff.execute(item.from?.category?.name || '', item.to?.category?.name || ''))}
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
        <div className="flex mb-4">
          {data.total_page > 1 && (
            <Pager
              className=""
              onChange={handlePagination}
              pageIndex={data.current_page}
              canPreviousPage={data.prev_page}
              canNextPage={data.next_page}
              pageCount={data.total_page}
            />
          )}
        </div>
        {isAllowedToEdit && (
          <ModalFooter>
            <button
              className="ml-auto btn btn-outline"
              onClick={() => {
                onToggle();
                onEdit();
              }}
              data-cy="revision_edit_btn"
            >
              Edit Post
            </button>
            <button onClick={handleRevert} className="ml-3 btn btn-outline" data-cy="revision_revert_btn">
              Revert Revision
            </button>
          </ModalFooter>
        )}
      </div>
    </Modal>
  );
};

export default inject(({ logStore }) => ({ logStore }))(RevisionHistoryModal);
