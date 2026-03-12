import type { DataQualityFlag } from "@/lib/types";

type Props = {
  flag: DataQualityFlag;
  className?: string;
};

const FLAG_CONFIG: Record<DataQualityFlag, { label: string; classes: string }> = {
  national_statistic: {
    label: "National Statistic",
    classes: "bg-green-100 text-green-800 border-green-200",
  },
  official_statistic: {
    label: "Official Statistic",
    classes: "bg-blue-100 text-blue-800 border-blue-200",
  },
  experimental_statistic: {
    label: "Experimental Statistic",
    classes: "bg-amber-100 text-amber-800 border-amber-200",
  },
  management_information: {
    label: "Management Information",
    classes: "bg-slate-100 text-slate-800 border-slate-200",
  },
  manual_transcription: {
    label: "Manually Transcribed",
    classes: "bg-slate-100 text-slate-800 border-slate-200",
  },
  suppressed: {
    label: "Suppressed Data",
    classes: "bg-red-50 text-red-700 border-red-100",
  },
  provisional: {
    label: "Provisional",
    classes: "bg-indigo-50 text-indigo-700 border-indigo-100",
  },
  revised: {
    label: "Revised",
    classes: "bg-purple-50 text-purple-700 border-purple-100",
  },
};

export function DataQualityBadge({ flag, className = "" }: Props) {
  const config = FLAG_CONFIG[flag];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${config.classes} ${className}`}
    >
      {config.label}
    </span>
  );
}
