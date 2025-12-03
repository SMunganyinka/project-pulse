import React from "react";

interface AlertProps {
  type: "error" | "success" | "info";
  message: string;
}

const colors: Record<AlertProps["type"], string> = {
  error: "bg-red-500/10 text-red-300 border-red-500/40",
  success: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
  info: "bg-sky-500/10 text-sky-300 border-sky-500/40"
};

const Alert: React.FC<AlertProps> = ({ type, message }) => {
  return <div className={`rounded-md border px-3 py-2 text-sm ${colors[type]}`}>{message}</div>;
};

export default Alert;