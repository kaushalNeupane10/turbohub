export type AlertVariant = "error" | "success" | "warning" | "info";

export interface AlertProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  className?: string;
}
