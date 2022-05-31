import { Link } from 'react-scroll';

type IndexCardProps = {
  title: string;
  content: string;
  to: string;
};

function IndexCard({ title, content, to }: IndexCardProps) {
  return (
    <div className="relative aspect-[2/2] w-[400px] overflow-hidden rounded-2xl border border-gray-lightest bg-white p-8 shadow-xl dark:border-opacity-20 dark:bg-dark-light">
      <h2 className="z-10 mb-4 bg-gradient-blue-text bg-clip-text pb-4 text-5xl text-transparent">
        {title}
      </h2>
      <span className="z-10 text-2xl">{content}</span>
      <Link className="absolute bottom-8 right-8 z-10" to={to}>
        Learn more
      </Link>
      <div className="absolute right-[-200px] bottom-[-200px] z-0 h-[600px] w-[500px] bg-light-radial-herosection opacity-5"></div>
    </div>
  );
}

export default IndexCard;
