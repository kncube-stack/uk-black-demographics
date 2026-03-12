import type { DataQualityFlag } from "@/lib/types";

type Props = {
  flag: DataQualityFlag;
  className?: string;
};

const FLAG_CONFIG: Record<DataQualityFlag, { label: string; classes: string; description: string }> = {
  national_statistic: {
    label: "National Statistic",
    classes: "bg-green-100 text-green-800 border-green-200",
    description: "Highest level of trust: Accredited by the UK Statistics Authority.",
  },
  official_statistic: {
    label: "Official Statistic",
    classes: "bg-blue-100 text-blue-800 border-blue-200",
    description: "Reliable data published by a government body or official agency.",
  },
  experimental_statistic: {
    label: "Experimental Statistic",
    classes: "bg-amber-100 text-amber-800 border-amber-200",
    description: "Official data using new or evolving methods. Use with awareness.",
  },
  management_information: {
    label: "Management Information",
    classes: "bg-slate-100 text-slate-800 border-slate-200",
    description: "Internal data for operational use, not formal statistics.",
  },
  manual_transcription: {
    label: "Manually Transcribed",
    classes: "bg-slate-100 text-slate-800 border-slate-200",
    description: "Data manually extracted from official reports or PDFs by our team.",
  },
  suppressed: {
    label: "Suppressed Data",
    classes: "bg-red-50 text-red-700 border-red-100",
    description: "Data hidden by the source to protect privacy in small population groups.",
  },
  provisional: {
    label: "Provisional",
    classes: "bg-indigo-50 text-indigo-700 border-indigo-100",
    description: "Initial release that may be updated as more data is processed.",
  },
  revised: {
    label: "Revised",
    classes: "bg-purple-50 text-purple-700 border-purple-100",
    description: "Updated version of an earlier release.",
  },
};

export function DataQualityBadge({ flag, className = "" }: Props) {
  const config = FLAG_CONFIG[flag];

  return (
    <span
      title={config.description}
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider cursor-help ${config.classes} ${className}`}
    >
      {config.label}
    </span>
  );
}
