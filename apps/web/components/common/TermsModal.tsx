import { z } from 'zod';
import { useTerms } from '../../hooks/useTerms';
import { useZodForm } from '../../utils/useZodForm';
import FormattedMessage from './FormattedMessage';
import { DialogPopupWrapper } from './wrappers/DialogsWrapper';

const TermsSchema = z.object({
  terms: z.literal(true),
});

export function TermsModal() {
  const { accept, accepted } = useTerms();
  const { register, handleSubmit, formState } = useZodForm({
    schema: TermsSchema,
    mode: 'all',
    reValidateMode: 'onChange',
  });

  return (
    <DialogPopupWrapper isOpen={!accepted} setIsOpen={() => null}>
      <form
        onSubmit={handleSubmit(() => accept())}
        className="flex w-96 flex-col items-center justify-center gap-4"
      >
        <h1 className="text-2xl font-bold">Terms and Conditions</h1>
        <div className="flex gap-4">
          <input {...register('terms')} type="checkbox" />
          <label className="text-gray-900 dark:text-gray-300 ml-2 text-sm font-medium">
            <FormattedMessage
              id="legal.terms.confirm"
              values={{
                privacy: (
                  <a href="/privacy-policy" target="_blank">
                    <FormattedMessage id="legal.privacy" />
                  </a>
                ),
                terms: (
                  <a href="/terms-and-conditions" target="_blank">
                    <FormattedMessage id="legal.terms" />
                  </a>
                ),
              }}
            />
          </label>
        </div>
        <button
          className="action-btn"
          disabled={!formState.isValid}
          type="submit"
        >
          Accept
        </button>
      </form>
    </DialogPopupWrapper>
  );
}
