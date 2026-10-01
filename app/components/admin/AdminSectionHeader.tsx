export const SectionHeader = ({
  title,
  buttonText,
  onButtonClick,
  className = '',
}: {
  title: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}) => (
  <div
    className={`flex justify-between items-center border border-l-muted-secondary border-t-muted-secondary border-b-gold-light border-r-gold-light ps-2 pe-1 py-1 my-2 ${className}`}
  >
    <h4 className="!font-label text-gold uppercase">{title}</h4>
    {buttonText && (
      <button
        type="button"
        onClick={onButtonClick}
        className="border border-gold active:bg-gold px-3 py-1 rounded !text-sm normal-case"
      >
        {buttonText}
      </button>
    )}
  </div>
);
