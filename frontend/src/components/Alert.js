import { jsx as _jsx } from "react/jsx-runtime";
const colors = {
    error: "bg-red-500/10 text-red-300 border-red-500/40",
    success: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
    info: "bg-sky-500/10 text-sky-300 border-sky-500/40"
};
const Alert = ({ type, message }) => {
    return _jsx("div", { className: `rounded-md border px-3 py-2 text-sm ${colors[type]}`, children: message });
};
export default Alert;
