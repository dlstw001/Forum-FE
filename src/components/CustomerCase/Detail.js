import { getTopicUrl } from 'utils';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { LOGIN_URL } from 'definitions';
import { Preview } from 'components/common/Form/Editor';
import { withRouter } from 'react-router-dom';
import Create from './Create';
import HtmlParser from 'react-html-parser';
import Loading from 'components/common/Loading';
import PostedBy from './components/Detail/PostedBy';
import React from 'react';
import RelatedItem from './components/Detail/RelatedItem';
import Replies from './components/Detail/Replies';
import useToggle from 'hooks/useToggle';

const Detail = ({ customerCaseStore, match, userStore }) => {
  const [data, setData] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);
  const { toggle, handleToggle } = useToggle({ createModal: false });

  const onClickCreateButton = () => {
    userStore?.user ? handleToggle({ createModal: true }) : (window.location.href = LOGIN_URL);
  };

  React.useEffect(() => {
    customerCaseStore.get(match.params.id).then((res) => {
      const { author, ...rest } = res;
      setIsLoading(false);
      setData({ ...rest, creator: author });
    });
  }, [customerCaseStore, match.params.id]);

  if (isLoading) {
    return (
      <div className="fullscreen-loading">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <main className="container wrapper lg:flex">
        <div className="hidden lg:block sidebar left lg:mr-8">
          <div className="sidebar-sticky-margin">
            {data?.relatedTopics && (
              <>
                <h3 className="sidebar-title">Related Topics</h3>
                <div className="mb-8">
                  {data.relatedTopics.length > 0
                    ? data.relatedTopics.map((item) => (
                        <RelatedItem key={item._id} url={getTopicUrl(item)}>
                          {HtmlParser(item?.title)}
                        </RelatedItem>
                      ))
                    : 'No related topics available'}
                </div>
              </>
            )}
            {data?.relatedCases && (
              <>
                <h3 className="sidebar-title">Related Cases</h3>
                <div className="mb-8">
                  {data.relatedCases.length > 0
                    ? data.relatedCases.map((item) => (
                        <RelatedItem key={item._id} url={`${process.env.REACT_APP_CUSTOMER_CASES_PAGE}/${item.slug}`}>
                          {HtmlParser(item?.title)}
                        </RelatedItem>
                      ))
                    : 'No related cases found'}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="w-full overflow-hidden">
          <section id={`main-post`}>
            <div className="flex items-center mb-4">
              <Link
                className="flex items-center btn btn-icon-xs back-to-previous"
                to={process.env.REACT_APP_CUSTOMER_CASE_PATH}
              >
                <i className="material-icons md-24">navigate_before</i>
                <span>Back</span>
              </Link>
              <button className="ml-auto btn btn-icon-xs" onClick={onClickCreateButton}>
                <i className="mr-2 icon-write-case material-icons md-16">edit</i>Write Your Own Customer Case
              </button>
            </div>
            <div className="relative pb-12 mb-8 post-original">
              <div className="mt-6 mb-8">
                <h2 className="flex items-center">
                  {HtmlParser(data.title)}
                  {data.noViews !== 0 && <div className="bubble-unread">{data.noViews}</div>}
                </h2>
                {data?.client?.length > 0 && (
                  <div className="text-base font-semibold">
                    <span className="mr-1 text-xl material-icons text-primary">person</span>
                    {data?.client?.map((client) => client.name).join(', ')}
                  </div>
                )}
              </div>

              <div className="lg:hidden">
                <PostedBy data={data} key={data._id} />
              </div>

              <div className="html-preview">
                {data.challenge && (
                  <>
                    <h4>Challenge</h4>
                    <Preview data={data.challenge} />
                  </>
                )}
                {data.content && <Preview data={data.content} />}
                {data.deployment && (
                  <>
                    <h4>Equipment used in deployment</h4>
                    <Preview data={data.deployment} />
                  </>
                )}
                {data.specialThanks && <Preview data={data.specialThanks} />}
              </div>
            </div>
          </section>
          <Replies post={data} />
        </div>
        <div className="hidden sidebar lg:pl-6 lg:ml-8 lg:block">
          <div className="sidebar-sticky-margin">
            <PostedBy data={data} key={data._id} />
          </div>
        </div>
      </main>
      {toggle.createModal && <Create onToggle={(show) => handleToggle({ createModal: show || !toggle.createModal })} />}
    </>
  );
};

export default inject(({ customerCaseStore, userStore }) => ({
  customerCaseStore,
  userStore,
}))(observer(withRouter(Detail)));
