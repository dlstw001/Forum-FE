import { debounce, isEmpty, isUndefined, toLower } from 'lodash-es';
import { inject, observer } from 'mobx-react';
import { NOTIFICATIONLVL } from 'definitions';
import { Redirect } from 'react-router-dom';
import { removeEmpty } from 'utils';
import { ROUTES } from 'definitions';
import { useForm } from 'react-hook-form';
import Breadcrumb from 'components/common/Breadcrumb';
import DashboardSectionList from '../../DashboardSectionList';
import MessageSettings from './MessageSettings';
import MobileMenu from 'components/Profile/MobileMenu';
import NotificationSettings from './NotificationSettings';
import React from 'react';
import WatchingSettings from './WatchingSettings';

const Settings = ({ userStore, categoryStore, tagStore, match }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const { displayName } = match.params;
  const [user, setUser] = React.useState();
  const [notificationSetList, setNotificationSetList] = React.useState([]);
  const [personalMessage, setPersonalMessage] = React.useState();
  const [canVisit, setCanVisit] = React.useState(true);
  const [categories, setCategories] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [ignoredUsers, setIgnoredUsers] = React.useState([]);
  const [mutedUsers, setMutedUsers] = React.useState([]);
  const [popUp, setPopUp] = React.useState(false);
  const methods = useForm();

  const { handleSubmit, reset, getValues } = methods;

  // setting the popup css
  const popUpState = popUp ? 'confirm-popup' : 'confirm-popup-close';

  const getData = React.useCallback(async () => {
    await userStore.get(displayName).then((data) => {
      setUser(data.item);
    });
    await categoryStore.find({ limit: 1000 }).then((data) => {
      setCategories(data);
    });
    await tagStore.find({ limit: 1000 }).then((data) => {
      setTags(data);
    });
    setIsLoading(false);
  }, [userStore, categoryStore, tagStore, displayName]);

  React.useEffect(() => {
    userStore?.user &&
      (toLower(userStore.user.displayName) === displayName || userStore.IS_ADMIN_OR_MODERATOR) &&
      getData();
  }, [displayName, getData, userStore.IS_ADMIN_OR_MODERATOR, userStore.user]);

  React.useEffect(() => {
    if (user && user?.notifications?.users) {
      user.notifications.users.ignored.map(async (i) => {
        await userStore.get(i).then((data) => {
          setIgnoredUsers((prevState) => [...prevState, data?.item]);
        });
      });
      user.notifications.users.muted.map(
        async (i) =>
          await userStore.get(i).then((data) => {
            setMutedUsers((prevState) => [...prevState, data?.item]);
          })
      );
    }
  }, [user, userStore]);

  const extractCategoriesByLevel = React.useCallback(
    (level) => {
      const extractedCategories = user?.notifications?.categories
        ?.filter((i) => i.lv === level)
        .map((i) => categoryStore.items.data.find((j) => i.category === j._id));

      return extractedCategories?.filter((i) => !isEmpty(i) || !isUndefined(i));
    },
    [categoryStore.items.data, user]
  );

  React.useEffect(() => {
    if (user && user.notifications.categories) {
      reset({
        ...getValues(),
        postDefaultLv: NOTIFICATIONLVL[user.notifications.postDefaultLv],
        watchedCategories: extractCategoriesByLevel(3),
        watchedFirstCategories: extractCategoriesByLevel(4),
        mutedCategories: extractCategoriesByLevel(0),
      });
    }
  }, [reset, user, categoryStore.items.data, getValues, extractCategoriesByLevel]);

  const extractTagsByLevel = React.useCallback(
    (level) => {
      const extractedTags = user?.notifications?.tags
        ?.filter((i) => i.lv === level)
        .map((i) => tagStore.items.data.find((j) => i.tag === j._id));

      return extractedTags?.filter((i) => !isEmpty(i) || !isUndefined(i));
    },
    [tagStore.items.data, user]
  );

  React.useEffect(() => {
    if (user && user.notifications.tags) {
      reset({
        ...getValues(),
        watchedTags: extractTagsByLevel(3),
        watchedFirstTags: extractTagsByLevel(4),
        mutedTags: extractTagsByLevel(0),
      });
    }
  }, [reset, user, tagStore.items.data, getValues, extractTagsByLevel]);

  React.useEffect(() => {
    if (ignoredUsers) reset({ ...getValues(), ignoredUser: ignoredUsers });
  }, [reset, user, ignoredUsers, getValues]);

  React.useEffect(() => {
    if (mutedUsers) reset({ ...getValues(), mutedUser: mutedUsers });
  }, [reset, user, mutedUsers, getValues]);

  React.useEffect(() => {
    if (user) setPersonalMessage(user.personalMessage);
  }, [user, setPersonalMessage]);

  const onSubmit = ({
    watchedCategories,
    watchedFirstCategories,
    mutedCategories,
    watchedTags,
    watchedFirstTags,
    mutedTags,
    ignoredUser,
    mutedUser,
    postDefaultLv,
    ...rest
  }) => {
    const payload = {
      id: user._id,
      notifications: {
        newTopic: notificationSetList.find((item) => item.name === 'NewTopics'),
        following: notificationSetList.find((item) => item.name === 'Following'),
        messages: notificationSetList.find((item) => item.name === 'Messages'),
        mentions: notificationSetList.find((item) => item.name === 'Mentions'),
        likes: notificationSetList.find((item) => item.name === 'Likes'),
        categories: [
          ...(!isEmpty(watchedCategories) ? watchedCategories?.map((i) => ({ category: i._id, lv: 3 })) : []),
          ...(!isEmpty(watchedFirstCategories) ? watchedFirstCategories?.map((i) => ({ category: i._id, lv: 4 })) : []),
          ...(!isEmpty(mutedCategories) ? mutedCategories?.map((i) => ({ category: i._id, lv: 0 })) : []),
        ],
        tags: [
          ...(!isEmpty(watchedTags) ? watchedTags?.map((i) => ({ tag: i._id, lv: 3 })) : []),
          ...(!isEmpty(watchedFirstTags) ? watchedFirstTags?.map((i) => ({ tag: i._id, lv: 4 })) : []),
          ...(!isEmpty(mutedTags) ? mutedTags?.map((i) => ({ tag: i._id, lv: 0 })) : []),
        ],
        users: {
          ignored: ignoredUser && ignoredUser.length > 0 ? ignoredUser?.map((i) => i._id) : undefined,
          muted: mutedUser && mutedUser.length > 0 ? mutedUser?.map((i) => i._id) : undefined,
        },
        postDefaultLv: postDefaultLv.value,
        ...rest,
      },
      personalMessage: personalMessage,
    };

    userStore.update(removeEmpty(payload)).then(() => {
      setPopUp(true);
      let timeoutFunc;
      timeoutFunc = setTimeout(() => {
        setPopUp(false);
        clearTimeout(timeoutFunc);
      }, 5000);
    });
  };

  const loadOptions = debounce((keyword, callback) => {
    if (keyword) {
      userStore.find({ displayName: keyword }).then((res) => {
        callback(res.data);
      });
    } else {
      callback([]);
    }
  }, 300);

  React.useEffect(() => {
    if (!isEmpty(localStorage.getItem(process.env.REACT_APP_APP_NAME))) {
      userStore?.user &&
        setCanVisit(toLower(userStore.user.displayName) === displayName || userStore.IS_ADMIN_OR_MODERATOR);
    } else {
      setCanVisit(false);
    }
  }, [displayName, userStore.IS_ADMIN_OR_MODERATOR, userStore.user]);

  if (!canVisit) {
    return <Redirect to={ROUTES.NOT_FOUND} />;
  }

  return (
    <main className="container wrapper lg:flex">
      <DashboardSectionList selected={'Settings'} displayName={displayName} className="hidden lg:block" />
      <form className="flex flex-col w-full" onSubmit={handleSubmit(onSubmit)}>
        <Breadcrumb
          title={`Settings`}
          between={{ title: displayName, link: `${ROUTES.PROFILE}/${displayName}` }}
          className="mb-8"
        />
        <MobileMenu displayName={displayName} title="Settings" />
        <NotificationSettings
          user={user}
          methods={methods}
          notificationSetList={notificationSetList}
          setNotificationSetList={setNotificationSetList}
          isLoading={isLoading}
        />
        <WatchingSettings loadOptions={loadOptions} categories={categories} tags={tags} methods={methods} />
        <MessageSettings user={user} personalMessage={personalMessage} setPersonalMessage={setPersonalMessage} />
        <button className="ml-auto btn btn-outline" type="submit" data-cy="confirm_btn">
          Save
        </button>
        <div className={popUpState}>
          <div className="confirm-popup-msg">Changes Saved Successfully.</div>

          <div className="confirm-popup-btn material-icons" onClick={() => setPopUp(false)}>
            close
          </div>
        </div>
      </form>
    </main>
  );
};

export default inject(({ userStore, categoryStore, tagStore }) => ({ userStore, categoryStore, tagStore }))(
  observer(Settings)
);
