/* eslint-disable no-unused-vars */
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { inject, observer } from 'mobx-react';
//import { Link } from 'react-router-dom';
import { ROUTES, SCREENS } from 'definitions';
import cx from 'classnames';
import React from 'react';
//import Slider from 'react-slick';
//import TrendingSectionItem from 'components/common/TrendingSectionItem';

const CarouselNav = (props) => {
  const { className, style, onClick, children, arrowClassName, 'data-cy': dataNavbarCy } = props;
  const styles = { ...style, display: 'block' };

  return (
    <button className={cx(arrowClassName, className)} style={styles} onClick={onClick} data-cy={dataNavbarCy}>
      <i className="material-icons">{children}</i>
    </button>
  );
};

const TrendingSection = ({ categoryStore }) => {
  const [trend, setTrend] = React.useState([]);

  const settings = {
    infinite: false,
    dots: false,
    arrows: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    nextArrow: (
      <CarouselNav arrowClassName="nav-next" data-cy="trending_section_right">
        keyboard_arrow_right
      </CarouselNav>
    ),
    prevArrow: (
      <CarouselNav arrowClassName="nav-previous" data-cy="trending_section_left">
        keyboard_arrow_left
      </CarouselNav>
    ),
    responsive: [
      {
        breakpoint: SCREENS.XL,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: SCREENS.LG,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: SCREENS.MD,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: SCREENS.SM - 1,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  React.useEffect(() => {
    categoryStore.trendFixed({ limit: 4 }).then((res) => setTrend(res?.data));
  }, [categoryStore]);

  return (
    <>
      {/*<section className="mb-12 trending-section">
        <div className="flex items-center mb-8">
          <h2 className="section-title">Featuring</h2>
          <Link
            data-tut="view_all_trending"
            to={ROUTES.CATEGORIES}
            className="flex items-center ml-auto btn btn-icon-xs"
            data-cy="section_view_all"
          >
            <i className="icon-view-all material-icons md-24 md:mr-1">list</i>
            <span className="hidden md:block">View All</span>
          </Link>
        </div>

        {!!trend.length && (
          <Slider {...settings}>
            {trend.map((item) => (
              <TrendingSectionItem key={item._id} data={item} isClickable={true} className="px-4" />
            ))}
          </Slider>
        )}
            </section>*/}
      <section className="mb-12 trending-section">
        <div className="mb-8 grid lg:grid-cols-4 gap-6">
          <div className="bg-forum background-overlay lg:col-span-2 xs:col-span-4">
            <div className="forum-text-block">
              <div className="forum-title">Peplink Forum</div>
              <div className="forum-description">
                Ask questions, find answers, make new discoveries, and connect with others around the world who share
                the same passion for all things Peplink.
              </div>
            </div>
            <div className="lg:col-span-2 xs:col-span-4">
              <div className="grid grid-cols-2">
                <a href="https://forum.peplink.com/c/announcements/27">
                  <div className="relative bg-latest-announce">Latest Announcement</div>
                </a>
                <a href="https://forum.peplink.com/c/product-discussion/5">
                  <div className="relative bg-product-discuss">Product Discussion</div>
                </a>
                <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
                  <div className="relative bg-online-training">Online Training</div>
                </a>
                <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
                  <div className="relative bg-product-videos">Product Videos</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default inject(({ categoryStore }) => ({ categoryStore }))(observer(TrendingSection));
