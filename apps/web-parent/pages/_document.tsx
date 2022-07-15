import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,400;0,700;1,400&family=Raleway:wght@300;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className=" bg-bright-bg text-dark-lightest dark:bg-dark dark:text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
