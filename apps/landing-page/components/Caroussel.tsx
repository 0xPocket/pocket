import Slider from 'react-slick';
import Avis from './Avis';

type CarousselProps = {};

const avis = [
  {
    content:
      "Avant je prêtais ma carte bleue à mon fils pour qu'il achète des crypto-monnaies. Au moins avec Pocket, je vois ce qu'il fait avec. C'est un service que je recommande à tous les parents qui veulent un tant soit peu surveiller leurs enfants !",
    author: "Rémi, papa d'Antoine (14 ans)",
  },
  {
    content:
      "J'avais très peur de ce domaine, mais mon fils n'arrête pas de me demander de lui acheter des ntf d'un youtubeur (j'ai oublié le nom) alors on a décidé avec mon mari de lui créer un compte pocket !",
    author: 'Christine, maman de Jonathan (16 ans)',
  },
  {
    content:
      "Ça faisait pas mal de temps que ma fille me demandait d'acheter des cryptomonnaies et je n'étais vraiment pas rassuré par l'idée. Quand il m'a parlé du service de Pocket, j'ai pensé que ce serait un bon moyen de faire ça en toute sécurité.",
    author: 'Jean-Christophe, papa de Lou (16 ans)',
  },
];

function appendDotsFt(dots) {
  return (
    <div>
      <ul> {dots}</ul>
    </div>
  );
}

function customPaging() {
  return (
    <span className=" text-3xl hover:text-dark-lightest dark:text-white">
      •
    </span>
  );
}

function Caroussel({}: CarousselProps) {
  const settings = {
    dots: true,
    customPaging: customPaging,
    appendDots: appendDotsFt,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    centerMode: true,
    fade: true,
    arrows: false,
    useTransform: false,
    pauseOnHover: true,
    centerPadding: '0',
  };

  return (
    <Slider appendDots={appendDotsFt} {...settings}>
      {avis.map((a, index) => (
        <Avis content={a.content} author={a.author} key={index} />
      ))}
    </Slider>
  );
}

export default Caroussel;
