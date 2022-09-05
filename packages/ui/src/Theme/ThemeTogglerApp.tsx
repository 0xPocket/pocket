import { FC, useState } from "react";
import { useTheme } from "./ThemeContext";
import { Switch } from "@headlessui/react";

type ThemeTogglerAppProps = {
  className?: string;
};

const moon =
  "M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z";
const sun =
  "M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z";

export const ThemeTogglerApp: FC<ThemeTogglerAppProps> = ({ className }) => {
  const { dark, toggleDark } = useTheme();
  const [enabled, setEnabled] = useState(dark);

  return (
    <div className="flex items-center space-x-4">
      <svg
        className={className ? `${className}` : `h-8 w-8`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path fillRule="evenodd" d={sun} clipRule="evenodd" />
      </svg>
      <Switch
        checked={enabled}
        onChange={() => {
          setEnabled((prev) => !prev);
          toggleDark();
        }}
        className={`${
          enabled ? "bg-dark-lightest" : "bg-bright-darkest"
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${enabled ? "translate-x-5" : "translate-x-0"}
            bg-dark-lightest pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out dark:bg-white`}
        />
      </Switch>
      <svg
        className={className ? `${className}` : `h-8 w-8`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path fillRule="evenodd" d={moon} clipRule="evenodd" />
      </svg>
    </div>
  );
};
