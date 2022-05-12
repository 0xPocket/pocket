import { useState } from 'react';
import Button from '../common/Button';

type ToggleThemeModeProps = {};

function ToggleThemeMode({}: ToggleThemeModeProps) {
  const [darkTheme, setDarkTheme] = useState(false);

  const toggleTheme = () => {
    setDarkTheme((prev) => !prev);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="flex items-center justify-center">
      <Button action={toggleTheme}>Toggle</Button>
      <p className="text-dark dark:text-bright">
        {darkTheme ? 'dark' : 'light'}
      </p>
    </div>
  );
}

export default ToggleThemeMode;
