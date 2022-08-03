import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type pageSwitcherProps = {
  nextPage: () => void;
  previousPage: () => void;
  getCanNextPage: () => boolean;
  getCanPreviousPage: () => boolean;
};

export function PageSwitchers({
  nextPage,
  previousPage,
  getCanNextPage,
  getCanPreviousPage,
}: pageSwitcherProps) {
  return (
    <div className="center m-auto flex gap-2">
      <button
        className="m-auto rounded border p-1"
        onClick={() => previousPage()}
        disabled={!getCanPreviousPage()}
      >
        {<FontAwesomeIcon className="w-full" icon={faArrowLeft} />}
      </button>
      <button
        className="m-auto rounded border p-1"
        onClick={() => nextPage()}
        disabled={!getCanNextPage()}
      >
        {<FontAwesomeIcon className="w-full" icon={faArrowRight} />}
      </button>
    </div>
  );
}
