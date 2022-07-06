import React from 'react';
import Slider from 'react-slick';
import Avis from './Avis';

type CarrouselProps = {};

const avis = [
  {
    content: 'carrousel.avis1.content',
    author: 'carrousel.avis1.author',
  },
  {
    content: 'carrousel.avis2.content',
    author: 'carrousel.avis2.author',
  },
  {
    content: 'carrousel.avis3.content',
    author: 'carrousel.avis3.author',
  },
];

function Carrousel({}: CarrouselProps) {
  const settings = {
    dots: true,
    infinite: true,
    customPaging: () => (
      <span className="text-3xl hover:text-dark-lightest dark:text-white">
        •
      </span>
    ),
    appendDots: (dots: React.ReactNode) => (
      <div>
        <ul>{dots}</ul>
      </div>
    ),
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 13000,
    centerMode: true,
    fade: true,
    arrows: false,
    centerPadding: '0',
  };

  return (
    <Slider {...settings}>
      {avis.map((a, index) => (
        <Avis content={a.content} author={a.author} key={index} />
      ))}
    </Slider>
  );
}

export default Carrousel;
