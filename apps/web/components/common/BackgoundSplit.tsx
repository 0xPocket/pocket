type BackgoundSplitProps = {
  className: string;
};

function BackgoundSplit({ className }: BackgoundSplitProps) {
  return (
    <div
      className={`${className} absolute -z-50 h-[1080px] w-[1920px] bg-dark-radial-herosection opacity-10`}
    ></div>
  );
}

export default BackgoundSplit;
