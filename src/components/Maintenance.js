import React from 'react';

const Maintenance = () => {
  const url = localStorage.getItem('referrer');

  const handleTryAgain = React.useCallback(() => {
    localStorage.removeItem('referrer');
    window.location = url || window.location.origin;
  }, [url]);

  // const getData = React.useCallback(async () => {
  //   try {
  //     const res = await categoryStore.find();
  //     if (res) {
  //       handleTryAgain();
  //     }
  //   } catch (error) {
  //     setTimeout(() => {
  //       getData();
  //     }, 5000);
  //   }
  // }, [categoryStore, handleTryAgain]);

  // React.useEffect(() => {
  //   getData();
  // }, [getData]);

  return (
    <div className="flex items-center justify-center w-screen h-screen p-4 bg-black">
      <div>
        <img alt="logo" src="/assets/logo.svg" />

        <p className="mb-8 text-center text-danger">
          Unable to connect to the server due to maintenance or offline network. <br /> Please make sure you're
          connected to the Internet or try again later.
        </p>
        <div className="flex justify-center">
          <button onClick={handleTryAgain} className="btn btn-primary">
            Try again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
