type SectionContainerProps = {
  children: React.ReactNode;
};

function SectionContainer({ children }: SectionContainerProps) {
  return <section className="container mx-auto my-4">{children}</section>;
}

export default SectionContainer;
