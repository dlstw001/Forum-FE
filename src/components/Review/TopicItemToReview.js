import { FLAGSTATUS } from 'definitions';
import { inject, observer } from 'mobx-react';
import { Preview } from 'components/common/Form/Editor';
import AvatarMedia from 'components/common/AvatarMedia';
import Dropdown from 'components/common/Dropdown';
import DropdownMenu from 'components/common/DropdownMenu';
import React from 'react';
import ReviewItem from './ReviewItem';

const SUBJECT = {
  REPLY: 'reply',
  POST: 'post',
};
const TopicItemToReview = ({ reviewStore, data, onSuccess }) => {
  const handleFunction = async (value) => {
    const payload = {
      id: data._id,
      status: value,
    };

    const res = await reviewStore.update(payload);
    onSuccess(res);
  };

  const subjectModel = React.useMemo(() => {
    return data.subjectModel || {};
  }, [data.subjectModel]);

  return (
    <>
      {subjectModel && (
        <div className="mb-6 topic-row topic-row-bottom">
          <div className="flex mb-4">
            <AvatarMedia
              user={subjectModel?.creator}
              // data={{ ...subjectModel, categoryHasChild: data.categoryHadChild }}
              data={
                data.subject === SUBJECT.REPLY
                  ? subjectModel.post
                  : { ...subjectModel, categoryHasChild: data.categoryHadChild }
              }
            />
            <div className="flex items-center ml-auto last-activity">
              <div className="flex items-center flag-status">
                {FLAGSTATUS[data.status].name}
                <i className="ml-2 forum-helper material-icons md-18">help</i>
              </div>
              <div id="action-menu">
                <Dropdown
                  placement="bottom-end"
                  menuClassname="action-menu"
                  className="flex items-center h-full ml-auto"
                  menu={({ style }) => (
                    <ul className="text-gray-500 bg-secondary menu" style={style}>
                      {FLAGSTATUS.slice(1, 5).map((i) => (
                        <DropdownMenu
                          key={i.label}
                          item={i}
                          handleClick={() => handleFunction(i.value)}
                          style={style}
                        />
                      ))}
                    </ul>
                  )}
                >
                  <i
                    className="ml-auto material-icons btn-action"
                    data-cy={`dropdown_menu_${
                      data.subject === 'reply' ? subjectModel?.post?.title : subjectModel?.title
                    }`}
                  >
                    more_vert
                  </i>
                </Dropdown>
              </div>
            </div>
          </div>
          <div className="mb-4 html-preview">
            <Preview data={subjectModel.content || subjectModel.raw} />
          </div>
          <div>
            {data.scores.map((items, index) => (
              <ReviewItem item={items} key={index} index={index} data={data} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default inject(({ reviewStore }) => ({ reviewStore }))(observer(TopicItemToReview));
