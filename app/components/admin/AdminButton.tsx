interface IParams {
  btnDisabled: boolean;
  btnText: string;
  btnAction: () => void;
}

export const AdminButton = ({ btnDisabled, btnText, btnAction }: IParams) => {
  return (
    <button
      onClick={btnAction}
      disabled={btnDisabled}
      className="w-full rounded py-2.5 font-paragraph font-bold text-sm uppercase tracking-widest text-background bg-btn-primary hover:opacity-90 cursor-pointer disabled:bg-none disabled:bg-btn-disabled disabled:text-btn-disabled-text disabled:cursor-not-allowed"
    >
      {btnText}
    </button>
  );
};
