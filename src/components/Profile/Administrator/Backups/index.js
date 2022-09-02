import { inject, observer } from 'mobx-react';
import Breadcrumb from 'components/common/Breadcrumb';
import DashboardSectionList from '../../DashboardSectionList';
import MobileMenu from 'components/Profile/MobileMenu';
import React from 'react';

const Backups = () => {
  const getData = React.useCallback(async () => {}, []);

  React.useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      <main className="container wrapper lg:flex">
        <DashboardSectionList isAdmin className="hidden lg:block" />
        <div className="flex-grow">
          <Breadcrumb title={`Backups`} className="mb-8" />
          <MobileMenu isAdmin title="Backups" />
          <h1>No Backups Available</h1>
        </div>
      </main>
    </>
  );
};

export default inject(({ Backups }) => ({ Backups }))(observer(Backups));
