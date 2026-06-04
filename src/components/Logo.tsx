export default function Logo({ className = "", light = false }: { className?: string, light?: boolean }) {
  const textColor = light ? "text-white" : "text-slate-900";
  const primaryTextColor = light ? "text-white" : "text-slate-900";
  const subTextColor = light ? "text-white/60" : "text-slate-500";
  const bgColor = light ? "white" : "currentColor";
  const innerColor = light ? "#0f172a" : "white"; // slate-900 or white

  return (
    <div className={`flex items-center gap-5 ${className}`}>
      <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${textColor} shrink-0`}>
        <path d="M20 2L4 9V18C4 27.5 10.8 36.3 20 39C29.2 36.3 36 27.5 36 18V9L20 2Z" fill={bgColor}/>
        <path d="M20 5.5L6.5 11.5V18C6.5 26 12 33.5 20 35.5C28 33.5 33.5 26 33.5 18V11.5L20 5.5Z" fill={innerColor}/>
        <path d="M20 8.5L9.5 13.5V18C9.5 24.5 14 30.5 20 32.5C26 30.5 30.5 24.5 30.5 18V13.5L20 8.5Z" fill={bgColor}/>
        <path d="M19 14.5H21V19H25.5V21H21V25.5H19V21H14.5V19H19V14.5Z" fill={innerColor}/>
      </svg>
      <div className="flex flex-col justify-center py-1">
        <span className={`text-[16px] font-bold tracking-[0.12em] uppercase leading-[1.1] ${primaryTextColor}`}>National</span>
        <span className={`text-[11px] font-bold tracking-[0.18em] uppercase leading-[1.3] ${primaryTextColor}`}>Emergency Authority</span>
        <span className={`text-[7px] font-bold tracking-[0.3em] uppercase leading-none mt-2 ${subTextColor}`}>Official Public Safety Platform</span>
      </div>
    </div>
  );
}
