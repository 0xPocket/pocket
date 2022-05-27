type ErrorMessageProps = {
  message?: string;
};

export function FormErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div>
      <span className="mt-2 text-sm text-danger">{message}</span>
    </div>
  );
}
