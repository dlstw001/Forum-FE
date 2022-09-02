import Cases from './components/Cases';
import CreateTopics from './components/CreateTopics';
import FeaturedTopics from './components/FeaturedTopics';
import Hero from './components/Hero/';
import JoinForum from './components/JoinForum';
import PreFooter from './components/PreFooter';
import React from 'react';
import WantToFeature from './components/WantToFeature';
import WOW from 'wowjs';

export default () => {
  React.useEffect(() => {
    new WOW.WOW({
      boxClass: 'wow',
      animateClass: 'animated',
      offset: 300,
      mobile: true,
    }).init();
  }, []);

  return (
    <main className="w-full mx-auto">
      <Hero />
      <Cases />
      <WantToFeature />
      <JoinForum />
      <FeaturedTopics />
      <CreateTopics />
      <PreFooter />
    </main>
  );
};
