type Props = {
  className?: string;
};

export function CensusCaveatBanner({ className }: Props) {
  return (
    <div
      className={`rounded-[20px] border border-amber-200 bg-amber-50/60 px-5 py-4 ${className ?? ""}`}
    >
      <p className="text-sm font-semibold text-amber-800">
        Census 2021 data
      </p>
      <p className="mt-1 text-sm leading-6 text-amber-700">
        This section uses data from the England and Wales Census held on 21 March 2021.
        It is the most recent Census available — the next Census is expected in 2026,
        with results from 2027.
      </p>
    </div>
  );
}
