import type { FC } from 'react';

type SectionContainerProps = {
  children: React.ReactNode;
};

const SectionContainer: FC<SectionContainerProps> = ({ children }) => {
  return (
    <section className="container relative mx-auto my-12 ">{children}</section>
  );
};

export default SectionContainer;
