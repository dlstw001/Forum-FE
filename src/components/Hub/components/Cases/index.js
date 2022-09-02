import { debounce, indexOf } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { ROUTES } from 'definitions';
import cx from 'classnames';
import Item from './Item';
import React from 'react';
import Skeleton from './Skeleton';

// TODO: Remove static data here.

const ANIMATE_OPTIONS = {
  duration: 500,
  iterations: 1,
};

const defaultItems = {
  data: [
    {
      slug: 'https://speedfusion.com/news/a-thai-boxing-match-live-streaming-event-prepared-by-cyn',
      image: 'https://speedfusiondev.wpengine.com/wp-content/uploads/CYN_v2-455x340.jpg',
      title: 'A Thai boxing match live streaming event prepared by CYN',
      summary:
        'A Thai boxing match streamed using a MAX HD2. This deployment is interesting, the visuals compelling...',
    },
    {
      slug:
        'https://speedfusion.com/news/anywhere-connectivity-for-teradici-pcoip-powered-by-peplink-mbx-quad-5g-router/',
      image: 'https://speedfusiondev.wpengine.com/wp-content/uploads/West_02-455x340.jpg',
      title: 'Anywhere Connectivity for Teradici PCoIP Powered by Peplink MBX Quad 5G Router',
      summary: 'We have a client that needs to run Teradici PCoIP from anywhere. They will use about 250GB...',
    },
    {
      slug: 'https://forum.peplink.com/case/the-future-of-live-streaming',
      image: 'https://speedfusiondev.wpengine.com/wp-content/uploads/JVC_v2-455x340.jpg',
      title: 'The Future of Live Streaming',
      summary:
        'The effects of COVID-19 has undoubtedly increased pressure in many different industries with entertai...',
    },
    {
      slug:
        'https://speedfusion.com/news/peplink-mbx-provides-all-powerful-connectivity-for-the-mobile-operations-to-a-broadcasting-company/',
      image: 'https://speedfusiondev.wpengine.com/wp-content/uploads/West_v2-455x340.jpg',
      title: 'Peplink MBX Provides All-Powerful Connectivity for the Mobile Operations to a Broadcasting Company',
      summary:
        'A broadcasting company needed connectivity for mobile operations. We built them the SFC-6U-MAX-HD4-M...',
    },
    {
      slug: 'https://speedfusion.com/news/max-hd2-dome-enables-streaming-apps-for-port-vauban-antibes/',
      image: 'https://speedfusiondev.wpengine.com/wp-content/uploads/SeaSatCom_v2-1-455x340.jpg',
      title: 'MAX HD2 Dome Enables Streaming Apps for Port Vauban Antibes',
      summary: 'Another Peplink MAX HD2 Dome deployed in PORT VAUBAN ANTIBES ! Combined with&nbs...',
    },
    {
      slug:
        'https://speedfusion.com/news/peplink-mbx-provides-all-powerful-connectivity-for-the-mobile-operations-to-a-broadcasting-company/',
      image: 'https://speedfusiondev.wpengine.com/wp-content/uploads/West_v2-455x340.jpg',
      title: 'Peplink MBX Provides All-Powerful Connectivity for the Mobile Operations to a Broadcasting Company',
      summary:
        'A broadcasting company needed connectivity for mobile operations. We built them the SFC-6U-MAX-HD4-M...',
    },
    {
      slug: 'https://speedfusion.com/news/max-hd2-dome-enables-streaming-apps-for-port-vauban-antibes/',
      image: 'https://speedfusiondev.wpengine.com/wp-content/uploads/SeaSatCom_v2-1-455x340.jpg',
      title: 'MAX HD2 Dome Enables Streaming Apps for Port Vauban Antibes',
      summary: 'Another Peplink MAX HD2 Dome deployed in PORT VAUBAN ANTIBES ! Combined with&nbs...',
    },
  ],
};

const Cases = ({ caseStore }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [items, setItems] = React.useState({ data: [] });
  const [filters /*setFilters*/] = React.useState({
    pageSize: 10,
    pageIndex: 1,
  });

  const container = React.useRef(null);
  const track = React.useRef(null);
  const [disabledButton, setDisabledButton] = React.useState(false);

  const sliderSetup = React.useCallback(() => {
    let track, slides, focusSlide;

    if (!container?.current) return;

    track = container?.current?.querySelector('.carousel-track');
    slides = track?.querySelectorAll('.carousel-slide') || [];
    focusSlide = { style: {} };

    if (track.querySelectorAll('.carousel-slide.focus').length > 0) {
      focusSlide = track.querySelector('.carousel-slide.focus');

      if (indexOf(slides, focusSlide) === 2) {
        track.append(track.querySelector('.carousel-slide:first-child'));
        track.append(track.querySelector('.carousel-slide:first-child'));

        rearrangeSlides();
      } else if (indexOf(slides, focusSlide) === 1) {
        track.append(track.querySelector('.carousel-slide:first-child'));
        rearrangeSlides();
      } else {
        rearrangeSlides();
      }
    } else {
      focusSlide = track.querySelector('.carousel-slide:first-child');
      focusSlide.classList.add('focus');
      rearrangeSlides();
    }

    slides.forEach((slide) => (slide.style.width = `${getSlideWidth()}px`));
    focusSlide.style.width = `${getActiveSlideWidth()}px`;

    container.current.style.height = `${focusSlide.clientHeight}px`;
    setIsLoading(false);
  }, []);

  const getData = React.useCallback(async () => {
    setIsLoading(true);
    const payload = {
      page: filters.pageIndex,
      limit: filters.pageSize,
    };

    // TODO: Replace static data here.
    await caseStore
      .find(payload)
      .then(() => setItems({ ...defaultItems }))
      .finally(() => sliderSetup());
  }, [caseStore, filters.pageIndex, filters.pageSize, sliderSetup]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  const rearrangeSlides = () => {
    const track = container.current.querySelector('.carousel-track');
    const windowWidth = window?.innerWidth;

    if (windowWidth >= 1280) {
      track.prepend(track.querySelector('.carousel-slide:last-child'));
      track.prepend(track.querySelector('.carousel-slide:last-child'));
    } else if (windowWidth >= 768) {
      track.prepend(track.querySelector('.carousel-slide:last-child'));
    }
  };

  const getSlideWidth = () => {
    const windowWidth = window?.innerWidth;
    const containerWidth = container?.current?.clientWidth;

    if (windowWidth < 768) return containerWidth;
    else if (windowWidth < 1280) return containerWidth * 0.3;
    else return containerWidth * 0.1875;
  };

  const getActiveSlideWidth = () => {
    const windowWidth = window?.innerWidth;
    const containerWidth = container?.current?.clientWidth;

    if (windowWidth < 768) return containerWidth;
    else if (windowWidth < 1280) return containerWidth * 0.4;
    else return containerWidth * 0.25;
  };

  const onClickPrev = debounce(() => {
    const windowWidth = window?.innerWidth;
    const slide = track.current.querySelector('.carousel-slide:last-child');
    const focus = track.current.querySelector('.carousel-slide.focus');
    const newFocus = focus?.previousSibling || null;
    let focusAnimate, newFocusAnimate, slideAnimate;

    setDisabledButton(true);

    if (windowWidth >= 768) {
      focusAnimate = focus.animate([{ width: `${getSlideWidth()}px` }], ANIMATE_OPTIONS);
      newFocusAnimate = newFocus.animate([{ width: `${getActiveSlideWidth()}px` }], ANIMATE_OPTIONS);

      focusAnimate.onfinish = function () {
        focus.style.width = `${getSlideWidth()}px`;
      };

      newFocusAnimate.onfinish = function () {
        newFocus.style.width = `${getActiveSlideWidth()}px`;
      };
    }

    track.current.style.left = `-${slide.clientWidth}px`;
    track.current.prepend(slide);

    slideAnimate = track.current.animate([{ left: '0px' }], ANIMATE_OPTIONS);
    slideAnimate.onfinish = function () {
      focus && focus.classList.remove('focus');
      newFocus && newFocus.classList.add('focus');
      track.current.style.left = '0px';
      setDisabledButton(false);
    };
  }, 300);

  const onClickNext = debounce(() => {
    const windowWidth = window?.innerWidth;
    const slide = track.current.querySelector('.carousel-slide:first-child');
    const focus = track.current.querySelector('.carousel-slide.focus');
    const newFocus = focus?.nextSibling || null;
    let focusAnimate, newFocusAnimate, slideAnimate;

    setDisabledButton(true);

    if (windowWidth >= 768) {
      focusAnimate = focus?.animate([{ width: `${getSlideWidth()}px` }], ANIMATE_OPTIONS);
      newFocusAnimate = newFocus.animate([{ width: `${getActiveSlideWidth()}px` }], ANIMATE_OPTIONS);

      focusAnimate.onfinish = function () {
        focus.style.width = `${getSlideWidth()}px`;
      };

      newFocusAnimate.onfinish = function () {
        newFocus.style.width = `${getActiveSlideWidth()}px`;
      };
    }

    slideAnimate = track.current.animate([{ left: `-${slide.clientWidth}px` }], ANIMATE_OPTIONS);

    slideAnimate.onfinish = function () {
      focus && focus.classList.remove('focus');
      newFocus && newFocus.classList.add('focus');
      track.current.append(slide);
      track.current.style.left = '0px';
      setDisabledButton(false);
    };
  }, 300);

  React.useEffect(() => {
    window.addEventListener('resize', sliderSetup, true);
    return () => window.removeEventListener('scroll', sliderSetup, true);
  }, [sliderSetup]);

  return (
    <section className="customer-case-slider">
      <div className="container px-3 py-2 mx-auto mb-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="section-title">Featured Cases</h1>
          <Link to={ROUTES.CASES} className="ml-4 btn btn-primary btn-submit-case">
            View All Cases
          </Link>
        </div>
        <div
          className="carousel wow fadeInUp"
          id="cases-container"
          data-wow-duration="240ms"
          data-wow-delay="100ms"
          data-wow-offset="50"
          ref={container}
        >
          {isLoading && <Skeleton />}
          <div className={cx('carousel-track', { 'opacity-0': isLoading, 'animated fadeIn': !isLoading })} ref={track}>
            {items?.data?.map((item, index) => (
              <Item key={index} data={item} />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <button
            className="button-prev nav-button material-icons-outlined"
            onClick={onClickPrev}
            disabled={disabledButton}
          >
            chevron_left
          </button>
          <button
            className="button-next nav-button material-icons-outlined"
            onClick={onClickNext}
            disabled={disabledButton}
          >
            chevron_right
          </button>
        </div>
      </div>
    </section>
  );
};

export default inject(({ caseStore }) => ({ caseStore }))(observer(Cases));
