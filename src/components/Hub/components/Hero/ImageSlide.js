import React from 'react';

export default ({ item }) => (
  <div key={item.id}>
    <img src={item.thumbnail_desktop} alt={item.title} className="desktop-image" />
    <img src={item.thumbnail_mobile} alt={item.title} className="mobile-image" />
  </div>
);
