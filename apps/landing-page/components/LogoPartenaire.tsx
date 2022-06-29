import Image from 'next/image';
import Link from 'next/link';

type LogoPartenaireProps = {
  imgUrl: string;
  width: string;
  height: string;
  alt: string;
};

function LogoPartenaire({ imgUrl, width, height, alt }: LogoPartenaireProps) {
  return (
    <div
      className={`relative h-28 w-28 ${width} ${height} opacity-60 transition-all hover:scale-105 hover:opacity-100`}
    >
      <Image src={imgUrl} alt={alt} layout="fill" />
    </div>
  );
}

export default LogoPartenaire;
