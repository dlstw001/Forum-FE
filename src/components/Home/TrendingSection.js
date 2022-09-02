import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { colorHex } from 'utils';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { ROUTES, SCREENS } from 'definitions';
import cx from 'classnames';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import Slider from 'react-slick';

const TrendingSection = ({ categoryStore }) => {
  const [items, setItems] = React.useState({ data: [] });
  const [isLoading, setIsLoading] = React.useState(true);

  const getData = React.useCallback(async () => {
    categoryStore
      .find({ showInHome: true, sort_by: 'name', order_by: 'acs' })
      .then((res) => setItems({ ...res, data: Object.values(res.data).sort((a, b) => a.homeOrder - b.homeOrder) }))
      .finally(() => setIsLoading(false));
  }, [categoryStore]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  return (
    <section className="mb-12" data-tut="trending_section">
      {isLoading && (
        <Slider {...settings}>
          {[...Array(6)].map((i, index) => (
            <div key={index}>
              <SkeletonCard className="p-4" />
            </div>
          ))}
        </Slider>
      )}
      {!isLoading && (
        <Slider {...settings}>
          {items.data.map((i) => (
            <div key={i._id}>
              <CategoryCard data={i} isClickable={true} className="p-4" />
            </div>
          ))}
        </Slider>
      )}
    </section>
  );
};

export default inject(({ categoryStore }) => ({ categoryStore }))(observer(TrendingSection));

const SkeletonCard = ({ className }) => {
  return (
    <div className={cx('w-full m-auto trending', className)}>
      <Skeleton width={'100%'} height={145} />
    </div>
  );
};

const CardWrapper = ({ isClickable, data, children }) =>
  isClickable ? <Link to={`${ROUTES.CATEGORY_DETAILS}/${data.slug}`}>{children}</Link> : <div>{children}</div>;

const CategoryCard = ({ data, isClickable, className }) => {
  return (
    <div className={cx('w-full m-auto trending', className)}>
      <CardWrapper data={data} isClickable={isClickable}>
        <div className="relative">
          <div className="category-line" style={{ borderColor: colorHex(data.color) }} />
          <div className="items-meta-top">
            <div className="category-title">{data.name}</div>
            <p className="section-description">{data.desc}</p>
          </div>
          <div className="flex items-center items-meta-bottom">
            <i className="mr-2 text-sm material-icons">description</i>
            {data.postLastMonth > 0 && <span>{data.postLastMonth} / month</span>}
            {data.postLastMonth === 0 && <span>{data.postCount}</span>}
          </div>
        </div>
      </CardWrapper>
    </div>
  );
};

const CarouselNav = (props) => {
  const { className, style, onClick, children, arrowClassName, 'data-cy': dataNavbarCy } = props;
  const styles = { ...style, display: 'block' };

  return (
    <button className={cx(arrowClassName, className)} style={styles} onClick={onClick} data-cy={dataNavbarCy}>
      <i className="material-icons">{children}</i>
    </button>
  );
};

const settings = {
  infinite: false,
  dots: false,
  arrows: true,
  speed: 500,
  rows: 2,
  slidesPerRow: 4,
  autoplay: true,
  centerPadding: '15px',
  autoplaySpeed: 5000,
  nextArrow: <CarouselNav arrowClassName="nav-next">keyboard_arrow_right</CarouselNav>,
  prevArrow: <CarouselNav arrowClassName="nav-previous">keyboard_arrow_left</CarouselNav>,
  responsive: [
    {
      breakpoint: SCREENS.XL,
      settings: {
        slidesPerRow: 3,
        rows: 2,
      },
    },
    {
      breakpoint: SCREENS.LG,
      settings: {
        slidesPerRow: 2,
        rows: 1,
        arrows: true,
        dots: true,
      },
    },
    {
      breakpoint: SCREENS.MD,
      settings: {
        slidesPerRow: 2,
        rows: 1,
        arrows: true,
        dots: true,
      },
    },
    {
      breakpoint: SCREENS.SM - 1,
      settings: {
        slidesPerRow: 1,
        rows: 1,
        arrows: false,
        dots: true,
      },
    },
  ],
};
