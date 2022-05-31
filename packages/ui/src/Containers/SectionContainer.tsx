type SectionContainerProps = {
  children: React.ReactNode;
};

export function SectionContainer({ children }: SectionContainerProps) {
  return (
    <section className="container relative mx-auto my-12 min-h-screen ">
      {children}
    </section>
  );
}
