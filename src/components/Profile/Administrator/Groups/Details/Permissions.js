import { flatten, groupBy, values } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { ROUTES } from 'definitions';
import Loading from 'components/common/Loading';
import React from 'react';

const Permissions = ({ id, groupStore }) => {
  const [items, setItems] = React.useState({ data: [] });
  const [isLoading, setIsLoading] = React.useState(false);

  const getData = React.useCallback(async () => {
    setIsLoading(true);
    await groupStore.getPermissions(id).then((res) => {
      const { data } = res;
      const allItems = [];

      Object.keys(data).map((key) => {
        const items = data[key];

        items.forEach((item) => {
          allItems.push({ ...item, access: [key] });
        });

        return true;
      });

      const groupedByID = values(groupBy(allItems, '_id'));
      const cleaned = groupedByID.map((items) => {
        const firstItem = items[0];

        if (items.length > 1) {
          const access = items.map((item) => item.access);

          return { ...firstItem, access: flatten(access) };
        } else {
          return firstItem;
        }
      });

      setItems({ data: cleaned });
      setIsLoading(false);
    });
  }, [groupStore, id]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      <p>
        {items.data.length !== 0
          ? 'Members of this group can access these categories'
          : 'There are no categories associated with this group.'}
      </p>
      <div className="w-full overflow-auto table-responsive">
        <table className="table w-full">
          <tbody>
            {items.data.map((item) => (
              <tr key={item._id}>
                <td>
                  <Link to={`${item.hasChild ? ROUTES.CATEGORIES : ROUTES.CATEGORY_DETAILS}/${item?.slug}`}>
                    <div className="flex items-center">
                      <div className="inline-block w-4 h-4 mr-2" style={{ background: item.color }}></div>
                      <i className="mr-2 text-sm material-icons">lock</i>
                      {item.name}
                    </div>
                  </Link>
                </td>
                <td>
                  {item.access.includes('crs')
                    ? 'Create / Reply / See'
                    : item.access.includes('rs')
                    ? 'Reply / See'
                    : 'See'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isLoading && <Loading />}
    </>
  );
};

export default inject(({ groupStore }) => ({ groupStore }))(observer(withRouter(Permissions)));
