import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import clsx from "clsx";
import { AlertProps } from "@/types/alert/alert";

const variants = {
  error: {
    icon: AlertCircle,
    className: "border-error/30 bg-error-light/20 text-error",
  },

  success: {
    icon: CheckCircle2,
    className: "border-success/30 bg-success-light/20 text-success",
  },

  warning: {
    icon: TriangleAlert,
    className: "border-warning/30 bg-warning-light/20 text-warning",
  },

  info: {
    icon: Info,
    className: "border-info/30 bg-info-light/20 text-info",
  },
};

export default function Alert({
  children,
  variant = "info",
  className,
}: AlertProps) {
  const config = variants[variant];

  const Icon = config.icon;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={clsx(
        "flex w-full items-start gap-3 rounded-lg border px-4 py-3",
        "text-sm leading-relaxed",
        "shadow-sm",
        config.className,
        className,
      )}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />

      <div className="min-w-0 flex-1 wrap-break-word">{children}</div>
    </div>
  );
}
