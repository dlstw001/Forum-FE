import { inject, observer } from 'mobx-react';
import { some } from 'lodash';
import CategoryItem from './CategoryItem';
import CreateSectionModal from 'components/common/modals/SectionModal';
import Delete from './Delete';
import Dropdown from 'components/common/Dropdown';
import DropdownMenu from 'components/common/DropdownMenu';
import Loading from 'components/common/Loading';
import React from 'react';
import Reorder from './Reorder';
import useToggle from 'hooks/useToggle';

const ParentSection = ({ userStore, categoryStore }) => {
  const [categories, setCategories] = React.useState([]);

  const { handleToggle, toggle } = useToggle({
    createSectionModal: false,
    reorderSections: false,
    deleteSections: false,
    viewSection: true,
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const getData = React.useCallback(async () => {
    setIsLoading(true);

    await categoryStore.all();
    setIsLoading(false);

    handleToggle({ viewSection: true, reorderSections: false, deleteSections: false });
  }, [categoryStore, handleToggle]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  React.useEffect(() => {
    const parent = categoryStore.list.data
      .filter((i) => !i.parent)
      .reduce((acc, val) => ({ ...acc, [val._id]: val }), {});

    categoryStore.list.data
      .filter((i) => i.parent)
      .forEach((i) => {
        if (some(parent, { _id: i.parent._id })) {
          //not all sub-cats can hv parent (becoz parent can be hidden, while child not)
          const child = parent[i.parent._id].child || [];
          parent[i.parent._id] = {
            ...parent[i.parent._id],
            child: [...child, i],
          };
        }
      });
    const sorted = Object.values(parent).sort((a, b) => a.ordering - b.ordering);
    setCategories(sorted);
  }, [categoryStore.list.data]);

  const items = React.useMemo(() => {
    return {
      col1: categories.slice(0, 10),
      col2: categories.slice(10),
    };
  }, [categories]);

  const onToggleReorder = () => {
    handleToggle({ reorderSections: !toggle.reorderSections });
    getData();
  };

  const onToggleDelete = () => {
    handleToggle({ deleteSections: !toggle.deleteSections });
    getData();
  };

  const DROPDOWN_BUTTONS = [
    {
      label: 'Create Category',
      handler: () => handleToggle({ createSectionModal: !toggle.createSectionModal }),
    },
    {
      label: 'Reorder Category',
      handler: () => handleToggle({ reorderSections: !toggle.reorderSections, viewSection: false }),
      'data-cy': 'reorder_sections_btn',
    },
    {
      label: 'Delete Category',
      handler: () => handleToggle({ deleteSections: !toggle.deleteSections, viewSection: false }),
      'data-cy': 'delete_sections_btn',
    },
  ];

  return (
    <>
      <main className="container mx-auto">
        <div className="px-3 py-16 mx-auto mb-1">
          <div className="flex">
            <h2 className="mb-4 page-title">Categories</h2>

            {userStore.IS_ADMIN_OR_MODERATOR && !toggle.reorderSections && !toggle.deleteSections && (
              <Dropdown
                placement="bottom-end"
                menuClassname="action-menu"
                className="flex items-center h-full ml-auto"
                menu={({ style }) => (
                  <ul className="text-gray-500 bg-secondary menu" style={style}>
                    {DROPDOWN_BUTTONS.map((i) => (
                      <DropdownMenu key={i.label} item={i} handleClick={i.handler} />
                    ))}
                  </ul>
                )}
              >
                <i className="ml-auto material-icons btn-action" data-cy="action_menu_dropdown">
                  more_vert
                </i>
              </Dropdown>
            )}
          </div>
          <p className="mb-12">Post a question to our forum to get the right people to answer you.</p>
          {isLoading && <Loading />}
          {toggle.viewSection && (
            <>
              <div className="grid lg:grid-cols-2 gap-4">
                <div>
                  {items.col1
                    .filter((i) => !i.deleted)
                    .map((data) => (
                      <CategoryItem key={data._id} data={data} isClickable />
                    ))}
                </div>
                <div>
                  {items.col2
                    .filter((i) => !i.deleted)
                    .map((data) => (
                      <CategoryItem key={data._id} data={data} isClickable />
                    ))}
                </div>
              </div>
            </>
          )}
          {toggle.reorderSections && <Reorder items={[...items.col1, ...items.col2]} onToggle={onToggleReorder} />}
          {toggle.deleteSections && <Delete items={categories} onToggle={onToggleDelete} />}
        </div>
      </main>
      {toggle.createSectionModal && (
        <CreateSectionModal
          onToggle={(show) => {
            handleToggle({ createSectionModal: show || !toggle.createSectionModal });
          }}
          isParent={true}
        />
      )}
    </>
  );
};

export default inject(({ categoryStore, userStore }) => ({ categoryStore, userStore }))(observer(ParentSection));
