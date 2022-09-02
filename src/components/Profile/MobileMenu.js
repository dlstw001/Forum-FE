import DashboardSectionList from './DashboardSectionList';
import MobileDropdownButton from 'components/common/MobileDropdownButton';
import React from 'react';
import useToggle from 'hooks/useToggle';

export default ({ title, children, ...rest }) => {
  const { handleToggle, toggle } = useToggle({
    mobileMenu: false,
  });

  return (
    <>
      <MobileDropdownButton
        title={title}
        onToggle={() => handleToggle({ mobileMenu: !toggle.mobileMenu })}
        isOpen={toggle.mobileMenu}
      >
        {children}
      </MobileDropdownButton>

      {toggle.mobileMenu && (
        <div className="mb-4 lg:hidden">
          <div className="p-4 bg-gray-50 ">
            <div className="flex mb-4">
              <button onClick={() => handleToggle({ mobileMenu: false })} className="ml-auto material-icons">
                close
              </button>
            </div>
            <DashboardSectionList {...rest} />
          </div>
        </div>
      )}
    </>
  );
};
