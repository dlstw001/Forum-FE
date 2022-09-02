import { dateFormat } from 'utils';
import { FLAGSTATUS, ROUTES } from 'definitions';
import { Link } from 'react-router-dom';
import React from 'react';
import UserItem from 'components/common/UserItem';

const ReviewItem = ({ item, data }) => {
  return (
    <div>
      <div className="flex mb-2">
        <div className="flex">
          <Link
            to={`${ROUTES.PROFILE}/${item?.creator?.displayName?.toLowerCase()}`}
            className="flex items-center mr-4"
          >
            <UserItem user={item?.creator} size="xs" className="mr-2" />
            {item.creator?.displayName}
          </Link>
          <div className="flex items-center">
            <span className="mr-4 text-primary">
              {item.percentage_agreed} <i className="text-lg material-icons">thumb_up</i>
            </span>
            <span className="mr-4 text-gray-600 capitalize">
              <i className="text-lg material-icons">flag</i> {item.type.name}
            </span>
            <span className="text-gray-600">Date: {dateFormat(item.createdAt)}</span>
          </div>
        </div>
        {data.status !== 0 && (
          <>
            <span className="hidden md:mx-8 md:block">|</span>
            <div className="flex">
              <Link
                to={`${ROUTES.PROFILE}/${data.histories[
                  data.histories.length - 1
                ]?.creator?.displayName?.toLowerCase()}`}
                className="flex items-center mr-4"
              >
                <UserItem
                  user={data.histories[data.histories.length - 1]?.creator?.avatar}
                  size="xs"
                  className="mr-2"
                />

                {data.histories[data.histories.length - 1].creator.displayName}
              </Link>
              <div>
                <span className="mr-4 text-primary">
                  <i className="material-icons">{FLAGSTATUS[data.histories[data.histories.length - 1].status].icon}</i>
                  {FLAGSTATUS[data.histories[data.histories.length - 1].status].name}
                </span>
                <span className="text-gray-600">
                  Date: {dateFormat(data.histories[data.histories.length - 1]?.createdAt)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewItem;
