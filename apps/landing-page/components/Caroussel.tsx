import Slider from 'react-slick';
import Avis from './Avis';

type CarousselProps = {};

const avis = [
  {
    content:
      "Avant je prêtais ma carte bleue à mon fils pour qu'il achète des crypto-monnaies. Au moins avec Pocket, je vois ce qu'il fait avec. C'est un service que je recommande à tous les parents qui veulent un tant soit peu surveiller leurs enfants !",
    author: 'Rémi, 41',
  },
  {
    content:
      "J'avais très peur de ce domaine, mais mon fils n'arrête pas de me demander de lui acheter des nft d'un youtubeur (j'ai oublié le nom) alors on a décidé avec mon mari de lui créer un compte pocket !",
    author: 'Christine, 45',
  },
  {
    content:
      "Ça faisait pas mal de temps que ma fille me demandait d'acheter des cryptomonnaies et je n'étais vraiment pas rassuré par l'idée. Quand il m'a parlé du service de Pocket, j'ai pensé que ce serait un bon moyen de faire ça en toute sécurité.",
    author: 'Jean-Christophe, 38',
  },
];

function Caroussel({}: CarousselProps) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    centerMode: true,
    fade: true,
    arrows: false,
  };

  return (
    <Slider {...settings}>
      {avis.map((a, index) => (
        <Avis content={a.content} author={a.author} key={index} />
      ))}
    </Slider>
  );
}

export default Caroussel;
