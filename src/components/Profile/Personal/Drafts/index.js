import { defaultItems } from 'stores/base';
import { inject, observer } from 'mobx-react';
import { useInView } from 'react-intersection-observer';
import Breadcrumb from 'components/common/Breadcrumb';
import DashboardSectionList from '../../DashboardSectionList';
import DraftCard from './DraftCard';
import Loading from 'components/common/Loading';
import MobileMenu from 'components/Profile/MobileMenu';
import React from 'react';
import ReplyModal from 'components/common/modals/ReplyModal';
import TopicModal from 'components/common/modals/TopicModal';
import useToggle from 'hooks/useToggle';

const Drafts = ({ draftStore }) => {
  const [items, setItems] = React.useState({ data: [] });
  const [isLoading, setIsLoading] = React.useState(false);

  const [filters, setFilters] = React.useState({
    pageSize: 10,
    pageIndex: 1,
    order: 'desc',
  });

  const [refView, inView] = useInView();

  const { handleToggle, toggle } = useToggle({
    topicModal: false,
    createReplyModal: false,
  });
  const [selected, setSelected] = React.useState();

  const getData = React.useCallback(async () => {
    setIsLoading(true);
    const payload = {
      page: filters.pageIndex,
      limit: filters.pageSize,
      sort_by: 'updatedAt',
      order_by: 'desc',
    };
    await draftStore.find(payload);
    setIsLoading(false);
  }, [draftStore, filters.pageIndex, filters.pageSize]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  const fetchData = React.useCallback((options) => {
    setFilters((prevState) => ({ ...prevState, ...options }));
  }, []);

  React.useEffect(() => {
    draftStore.items = defaultItems();
  }, [draftStore]);

  React.useEffect(() => {
    setItems((prevState) => ({
      ...prevState,
      ...draftStore.items,
      data: [...prevState.data, ...draftStore.items.data],
    }));
  }, [draftStore.items]);

  React.useEffect(() => {
    const { next_page, current_page, total_page } = items;
    if (inView && next_page && current_page <= total_page) {
      fetchData({ pageIndex: next_page });
    }
  }, [fetchData, inView, items]);

  const handleDeleteDraft = async (item) => {
    await draftStore.delete(item._id);
    setItems({ data: [] });
    fetchData({ pageIndex: 1, pageSize: 10 });
  };

  const handlEditDraft = async (item) => {
    const res = await draftStore.get(item._id);
    setSelected(res.item);
    handleToggle(item.isPost ? { topicModal: true } : { createReplyModal: true });
  };

  const handleCleanup = () => {
    handleToggle({ topicModal: false });
    getData();
  };

  return (
    <>
      <main className="container wrapper lg:flex">
        <DashboardSectionList className="hidden lg:block" isPersonal={true} />
        <div className="w-full">
          <Breadcrumb title={`Drafts`} className="mb-8" />
          <MobileMenu title="Drafts" isPersonal={true} />
          {items.data.map((item) => (
            <DraftCard
              key={item._id}
              data={item}
              handlEditDraft={() => handlEditDraft(item)}
              handleDeleteDraft={() => handleDeleteDraft(item)}
            />
          ))}
          {items?.data?.length < 1 && !isLoading && <h1>No Drafts Available</h1>}
          {isLoading && <Loading />}
          <div ref={refView}></div>
        </div>
        {toggle.topicModal && (
          <TopicModal
            onToggle={(show) => {
              if (!show) {
                setSelected(undefined);
              }
              handleToggle({ topicModal: show || !toggle.topicModal });
            }}
            data={selected}
            draft={selected}
            onCleanup={handleCleanup}
          />
        )}
        {toggle.createReplyModal && (
          <ReplyModal
            onToggle={(show = false) => {
              handleToggle({ createReplyModal: show });
            }}
            data={selected}
            onSuccess={getData}
          />
        )}
      </main>
    </>
  );
};

export default inject(({ draftStore }) => ({ draftStore }))(observer(Drafts));
