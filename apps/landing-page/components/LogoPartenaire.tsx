import Image from 'next/image';

type LogoPartenaireProps = {
  imgUrl: string;
  width: string;
  height: string;
  alt: string;
};

function LogoPartenaire({ imgUrl, width, height, alt }: LogoPartenaireProps) {
  return (
    <div
      className={`relative h-28 w-28 ${width} ${height} transition-all  hover:scale-105 hover:opacity-100 lg:opacity-60`}
    >
      <Image src={imgUrl} alt={alt} layout="fill" />
    </div>
  );
}

export default LogoPartenaire;
