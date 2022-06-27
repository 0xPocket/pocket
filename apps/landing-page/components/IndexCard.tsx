import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type IndexCardProps = {
  title: string;
  content: string;
  icon: IconDefinition;
  varitaion?: boolean;
};

function IndexCard({
  title,
  content,
  icon,
  varitaion = false,
}: IndexCardProps) {
  return (
    <div className=" relative z-0 overflow-hidden rounded-2xl border border-gray-lightest bg-white p-8 shadow-xl dark:border-opacity-20 dark:bg-dark-light sm:aspect-square lg:aspect-[2/1.25] xl:aspect-square 2xl:aspect-[2/1.5]">
      <h2
        className={`z-10 mb-4  ${
          varitaion ? 'bg-gradient-pink-text' : 'bg-gradient-blue-text'
        } bg-clip-text pb-4 text-center text-4xl text-transparent`}
      >
        {title}
      </h2>
      <div className="z-10 text-center text-xl tracking-wide">{content}</div>
      <FontAwesomeIcon
        icon={icon}
        className="absolute bottom-0 -right-8 -z-10 h-40 w-40 -rotate-12 opacity-10"
      />
      <div className="absolute right-[-200px] bottom-[-200px] -z-20 h-[600px] w-[500px] bg-light-radial-herosection opacity-5"></div>
    </div>
  );
}

export default IndexCard;
