import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { ROOT_ROUTES } from 'definitions';
import cx from 'classnames';
import DetailSlide from './DetailSlide';
import ImageSlide from './ImageSlide';
import React from 'react';
import Slider from 'react-slick';

const DATA = [
  {
    id: 605,
    title: 'Introducing BR1 Pro 5G and B310X 5G!',
    excerpt: 'Fiber, cellular, or Ethernet. The choice is yours with our Balance 310 Fiber 5G',
    redirect_url: `${ROOT_ROUTES.FORUM}/t/introducing-br1-pro-5g-and-b310x-5g`,
    youtube_url: '',
    call_to_action: 'Explore More',
    thumbnail_mobile: '/assets/hub/Br1_Pro_B310x_mobile_v2.jpg',
    thumbnail_desktop: '/assets/hub/Br1_Pro_B310x_v2.jpg',
  },
  {
    id: 610,
    title: 'The antenna range we’ve all been waiting for!',
    excerpt: 'Check out the latest update on our Stingray and Hummingbird antenna range.',
    redirect_url: `${ROOT_ROUTES.FORUM}/t/peplink-antenna/27073`,
    youtube_url: '',
    call_to_action: 'Explore More',
    thumbnail_mobile: '/assets/hub/antenna_family_for_mobile.jpg',
    thumbnail_desktop: '/assets/hub/antenna_family.jpg',
  },
  {
    id: 700,
    title: 'OpenVPN WAN license now available',
    excerpt: 'Integrate Peplink devices and securely connect with OpenVPN',
    redirect_url: `${ROOT_ROUTES.FORUM}/t/introducing-the-openvpn-wan-license/30392`,
    youtube_url: '',
    call_to_action: 'Learn more',
    thumbnail_mobile: '/assets/hub/openVPN_mobile.jpg',
    thumbnail_desktop: '/assets/hub/openVPN-1.jpg',
  },
];

const SliderPrevArrow = (props) => {
  const { style, onClick } = props;
  return (
    <button className={cx('hero-prev-btn hero-slider-btn material-icons-outlined')} style={style} onClick={onClick}>
      arrow_back_ios
    </button>
  );
};

const SliderNextArrow = (props) => {
  const { style, onClick } = props;
  return (
    <button className={cx('hero-next-btn hero-slider-btn material-icons-outlined')} style={style} onClick={onClick}>
      arrow_forward_ios
    </button>
  );
};

export default () => {
  const imageSettings = {
    infinite: true,
    dots: true,
    arrows: true,
    speed: 300,
    slidesPerRow: 1,
    autoplay: false,
    fade: true,
    slidesToScroll: 1,
    prevArrow: <SliderPrevArrow />,
    nextArrow: <SliderNextArrow />,
  };

  const detailSettings = {
    infinite: true,
    dots: false,
    arrows: false,
    speed: 300,
    slidesPerRow: 1,
    autoplay: false,
    slidesToScroll: 1,
  };

  const [imageSlider, setImageSlider] = React.useState(null);
  const [detailsSlider, setDetailsSlider] = React.useState(null);

  return (
    <section id="hero-banner" className="mb-16">
      <div className="container relative mx-auto">
        <Slider {...imageSettings} asNavFor={detailsSlider} ref={(slider) => setImageSlider(slider)}>
          {DATA?.map((item) => (
            <ImageSlide item={item} key={item.id} />
          ))}
        </Slider>

        <div className="details-slider">
          <div className="slide-wrapper ">
            <Slider {...detailSettings} asNavFor={imageSlider} ref={(slider) => setDetailsSlider(slider)}>
              {DATA.map((item) => (
                <DetailSlide item={item} key={item.id} />
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};
