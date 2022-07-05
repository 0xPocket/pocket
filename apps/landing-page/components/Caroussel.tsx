import Slider from 'react-slick';
import Avis from './Avis';

type CarousselProps = {};

const avis = [
  {
    content:
      "J'avais très peur de ce domaine, mais mon fils n'arrête pas de me demander de lui acheter des nft d'un youtubeur (j'ai oublié le nom) alors on a décidé avec mon mari de lui créer un compte pocket !",
    author: 'Christine, 45',
  },
  {
    content:
      "Mon petit Lucas voulait jouer à un jeu en ligne mais il lui fallait des NFT et des crypto, bon j'avais assez peur de me lancer là dedans je vous l'avoue. Un collègue m'a parlé de pocket, ça a l'air assez simple et sécurisé et l'équipe vous aide, vraiment un bon service",
    author: 'Jean-Christophe, 38',
  },
  {
    content:
      "Mon fils me demandait souvent de lui prêter ma carte bleue pour acheter des NFT. Je n'étais pas très rassurée. Au moins avec Pocket je peux suivre ses achats.",
    author: 'Paul, 41',
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
