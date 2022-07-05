type AvisProps = {
  author: string;
  content: string;
};

function Avis({ author, content }: AvisProps) {
  return (
    <div className="relative z-0 m-auto my-8 flex max-w-4xl flex-col gap-4  overflow-hidden rounded-2xl border border-bright-darkest bg-bright-dark p-8  shadow-xl dark:border-opacity-20 dark:bg-dark-light">
      <p className="text-2xl font-thin">{content}</p>
      <h3 className="text-right text-3xl">{author}</h3>
    </div>
  );
}

export default Avis;
