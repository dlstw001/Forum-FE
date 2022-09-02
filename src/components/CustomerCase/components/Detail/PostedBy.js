import { dateFormat, timeAgoFormat } from 'utils';
import { Link } from 'react-router-dom';
import { ROUTES } from 'definitions';
import cx from 'classnames';
import Dropdown from 'components/common/Dropdown';
import React from 'react';
import ShareBar from 'components/common/ShareBar';
import UserItem from 'components/common/UserItem';
import useToggle from 'hooks/useToggle';

export default ({ data }) => {
  const { handleToggle, toggle } = useToggle({
    stats: false,
  });

  return (
    <>
      {data.creator && (
        <div className="p-3 mb-6 bg-gray-100 lg:bg-transparent">
          <div className="flex items-center lg:block">
            <UserItem user={data.creator} size="md">
              <div className="post-by">
                <div className="font-semibold text-primary">Posted By</div>
                <div>{data.creator.displayName}</div>
              </div>
            </UserItem>

            <div className="mt-3 ml-auto text-sm">
              <div>Created on {dateFormat(data.createdAt)}</div>
              <div>
                Last Activity: {data.lastModified ? timeAgoFormat(data.lastModified) : timeAgoFormat(data.createdAt)}
              </div>
            </div>
            <button onClick={() => handleToggle({ stats: !toggle.stats })} className="ml-4 btn btn-icon lg:hidden ">
              <span className="material-icons bg-gray-50">
                {toggle.stats ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
              </span>
            </button>
          </div>
          <div className={cx('lg:block mt-4', { hidden: !toggle.stats })}>
            <div className="flex items-center mb-4 lg:mb-8 lg:block">
              <Dropdown
                placement="bottom-end"
                menuClassname="bg-share w-auto"
                menu={() => (
                  <>
                    <ShareBar
                      props={{
                        url: window.location.href,
                        title: data.title,
                        description: data.content,
                        hashtag: data.tags,
                      }}
                    />
                  </>
                )}
              >
                <button className="btn-share" data-key={'share_topic'} data-cy="topic_btn_share">
                  <i className="material-icons flipped_img">reply</i> Share
                </button>
              </Dropdown>
            </div>

            {!!data.tags.length && (
              <>
                <h3 className="sidebar-title">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {data.tags.map((item) => (
                    <Link key={item._id} className="tags" to={`${ROUTES.TAG}/${item.name}`}>
                      {item.name}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
