import MobileDropdownButton from 'components/common/MobileDropdownButton';
import React from 'react';
import TabsInHome from 'components/Home/TabsInHome';
import useToggle from 'hooks/useToggle';

export default ({ children, ...rest }) => {
  const { toggle, handleToggle } = useToggle({ mobileMenu: false });
  return (
    <>
      <div className="flex mb-4">
        <MobileDropdownButton
          title={rest.current}
          onToggle={() => handleToggle({ mobileMenu: !toggle.mobileMenu })}
          isOpen={toggle.mobileMenu}
        />
        {children}
      </div>
      <div className="mb-4 lg:hidden">
        {toggle.mobileMenu && (
          <div className="p-4 bg-gray-50 ">
            <div className="flex mb-4">
              <button onClick={() => handleToggle({ mobileMenu: false })} className="ml-auto material-icons">
                close
              </button>
            </div>
            <TabsInHome
              {...rest}
              onSelect={() => handleToggle({ mobileMenu: !toggle.mobileMenu })}
              className="text-gray-400"
            />
          </div>
        )}
      </div>
    </>
  );
};
