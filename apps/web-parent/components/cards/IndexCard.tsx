import ALink from '../common/ALink';

type IndexCardProps = {
  title: string;
  content: string;
  href: string;
  style?: {};
};

function IndexCard({ title, content, href, style }: IndexCardProps) {
  return (
    <div
      style={style}
      className="relative aspect-[2/2] w-[400px] overflow-hidden rounded-2xl border border-gray-lightest bg-white p-8 shadow-xl"
    >
      <h2 className="z-10 mb-4 bg-gradient-blue-text bg-clip-text pb-4 text-5xl text-transparent">
        {title}
      </h2>
      <span className="z-10 text-2xl">{content}</span>
      <ALink
        href={href}
        text="Learn more"
        className="absolute bottom-8 right-8 z-10"
      />
      <div className="absolute right-[-200px] bottom-[-200px] z-0 h-[600px] w-[500px] bg-light-radial-herosection opacity-10"></div>
    </div>
  );
}

export default IndexCard;
