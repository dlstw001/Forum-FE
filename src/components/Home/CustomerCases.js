import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { inject, observer } from 'mobx-react';
import { showCreateCasesButton } from 'utils';
import CustomerCase from 'components/CustomerCase/Create';
import cx from 'classnames';
import Item from 'components/CustomerCase/components/Item';
import Loading from 'components/common/Loading';
import React from 'react';
import Slider from 'react-slick';
import useToggle from 'hooks/useToggle';

const CarouselNav = (props) => {
  const { className, onClick, children, arrowClassName } = props;

  return (
    <button className={cx(arrowClassName, className)} onClick={onClick}>
      <i className="material-icons">{children}</i>
    </button>
  );
};

const CustomerCases = ({ customerCaseStore, userStore }) => {
  const [cases, setCases] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toggle, handleToggle } = useToggle({ createModal: false });

  const settings = React.useMemo(
    () => ({
      infinite: false,
      dots: true,
      arrows: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      autoplay: true,
      centerPadding: '15px',
      autoplaySpeed: 5000,
      nextArrow: <CarouselNav arrowClassName="nav-next">keyboard_arrow_right</CarouselNav>,
      prevArrow: <CarouselNav arrowClassName="nav-previous">keyboard_arrow_left</CarouselNav>,
      responsive: [
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
          },
        },
        {
          breakpoint: 1286,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 4,
          },
        },
      ],
    }),
    []
  );

  React.useEffect(() => {
    customerCaseStore
      .getCostumerCases({ page: 1, limit: 20 })
      .then((res) => {
        setCases(res.data);
        setIsLoading(false);
      })
      .finally(() => setIsLoading(false));
  }, [customerCaseStore]);

  return (
    <>
      <section className="mb-12 customer-cases">
        <div className="flex items-baseline justify-between mb-8">
          <h2 data-tut="customer_cases" className="section-title">
            Customer Cases
          </h2>
          <div className="flex items-center justify-between">
            {showCreateCasesButton(userStore?.user) && (
              <button
                className="ml-auto btn btn-icon-xs md:mr-5 xs:mr-2"
                onClick={() => handleToggle({ createModal: true })}
              >
                <i className="icon-write-case material-icons md-18 md:mr-2">edit</i>
                <span className="md:inline-block xs:hidden">Write Your Own Cases</span>
              </button>
            )}

            <a
              className="btn btn-icon-xs"
              href={process.env.REACT_APP_CUSTOMER_CASES_PAGE}
              target="_self"
              rel="noopener noreferrer"
            >
              <i className="icon-view-all material-icons md-24 md:mr-1">list</i>
              <span className="md:inline-block xs:hidden">View All</span>
            </a>
          </div>
        </div>
        {!cases ||
          (isLoading && (
            <div className="flex flex-row items-center justify-center h-56">
              <div className="relative">
                <Loading />
              </div>
            </div>
          ))}
        {cases && !isLoading && (
          <div className="relative pb-16">
            <div className="">
              <Slider {...settings}>
                {cases.map((item, index) => (
                  <Item key={index} data={item} />
                ))}
              </Slider>
            </div>
          </div>
        )}
        {toggle.createModal && (
          <CustomerCase
            onToggle={(show) => {
              handleToggle({ createModal: show || !toggle.createModal });
            }}
          />
        )}
      </section>
    </>
  );
};

export default inject(({ customerCaseStore, userStore }) => ({ customerCaseStore, userStore }))(
  observer(CustomerCases)
);
