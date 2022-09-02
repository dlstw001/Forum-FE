import { inject, observer } from 'mobx-react';
import CategoryCard from 'components/common/TrendingSectionItem';
import CategoryItem from './CategoryItem';
import CreateSectionModal from 'components/common/modals/SectionModal';
import Delete from './Delete';
import Dropdown from 'components/common/Dropdown';
import DropdownMenu from 'components/common/DropdownMenu';
import Loading from 'components/common/Loading';
import React from 'react';
import Reorder from './Reorder';
import useToggle from 'hooks/useToggle';

const ChildSection = ({ userStore, categoryStore, match }) => {
  const [categories, setCategories] = React.useState([]);
  const { handleToggle, toggle } = useToggle({
    createSectionModal: false,
    reorderSections: false,
    deleteSections: false,
    editSectionModal: false,
    viewSection: true,
  });

  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setCategories(
      (categoryStore.data.item.childCategories &&
        categoryStore.data.item.childCategories.map((i) => ({
          ...i,
          read_restricted: categoryStore.data.item.read_restricted,
        }))) ||
        []
    );
  }, [categoryStore.data.item]);

  const getData = React.useCallback(async () => {
    await categoryStore.get(match.params.id);
    setIsLoading(false);
    handleToggle({ viewSection: true, reorderSections: false, deleteSections: false });
  }, [categoryStore, handleToggle, match.params.id]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  React.useEffect(() => {
    const sorted = categoryStore.items.data
      .filter((i) => i?.parent?._id === match.params.id)
      .slice()
      .sort((a, b) => a.ordering - b.ordering);
    setCategories(sorted);
  }, [categoryStore.items.data, match.params.id]);

  const onToggleReorder = () => {
    handleToggle({ reorderSections: !toggle.reorderSections });
    setIsLoading(true);
    getData();
  };

  const onToggleDelete = () => {
    handleToggle({ deleteSections: !toggle.deleteSections });
    setIsLoading(true);
    getData();
  };

  const DROPDOWN_BUTTONS = [
    {
      label: 'Create Category',
      handler: () => handleToggle({ createSectionModal: !toggle.createSectionModal }),
    },
    {
      label: 'Edit Category',
      handler: () => handleToggle({ editSectionModal: !toggle.editSectionModal }),
      'data-cy': 'edit_section_btn',
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
      <main className="container px-4 mx-auto">
        <div className="container py-24 mx-auto mb-1">
          <div className="flex">
            <h2 className="mb-8 page-title">{categoryStore.data.item?.name}</h2>
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
          <p className="mb-12">{categoryStore.data.item?.desc}</p>
          {isLoading && <Loading />}
          {toggle.viewSection && (
            <>
              {categoryStore.data.item.slug === 'Product-Discussion' ? (
                <div className="grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8">
                  {categories
                    .filter((i) => i.slug !== 'Other-Products')
                    .map((item) => (
                      <CategoryCard key={item._id} data={item} isClickable={true} />
                    ))}
                </div>
              ) : (
                <>
                  {categories.map((data) => (
                    <CategoryItem key={data._id} data={data} isClickable />
                  ))}
                </>
              )}
            </>
          )}
          {toggle.reorderSections && <Reorder items={categories} onToggle={onToggleReorder} />}
          {toggle.deleteSections && <Delete items={categories} onToggle={onToggleDelete} />}
        </div>
      </main>
      {toggle.createSectionModal && (
        <CreateSectionModal
          onToggle={(show) => {
            handleToggle({ createSectionModal: show || !toggle.createSectionModal });
          }}
        />
      )}
      {toggle.editSectionModal && (
        <CreateSectionModal
          data={categoryStore.data.item}
          onToggle={(show) => {
            handleToggle({ editSectionModal: show || !toggle.editSectionModal });
          }}
          isParent={true}
          onSuccess={getData}
        />
      )}
    </>
  );
};

export default inject(({ userStore, categoryStore }) => ({ userStore, categoryStore }))(observer(ChildSection));
