import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendPositive = true,
  variant = 'blue',
  linkTo,
  linkText = 'Lihat Selengkapnya',
}) {
  const variantStyles = {
    // Aqua/Sky (New Orders style)
    blue: {
      bg: 'bg-gradient-to-br from-sky-500 to-blue-600',
      watermark: 'text-white/20',
      footerHover: 'hover:bg-blue-700/50',
    },
    // Green/Emerald (Bounce Rate style)
    emerald: {
      bg: 'bg-gradient-to-br from-emerald-500 to-teal-700',
      watermark: 'text-white/20',
      footerHover: 'hover:bg-emerald-700/50',
    },
    // Yellow/Amber (User Registrations style)
    amber: {
      bg: 'bg-gradient-to-br from-amber-500 to-orange-600',
      watermark: 'text-white/20',
      footerHover: 'hover:bg-amber-700/50',
    },
    // Red/Rose (Unique Visitors style)
    rose: {
      bg: 'bg-gradient-to-br from-rose-500 to-red-600',
      watermark: 'text-white/20',
      footerHover: 'hover:bg-rose-700/50',
    },
    // Sky/Cyan alternative
    sky: {
      bg: 'bg-gradient-to-br from-cyan-600 to-blue-600',
      watermark: 'text-white/20',
      footerHover: 'hover:bg-blue-800/50',
    },
    // Indigo/Navy
    indigo: {
      bg: 'bg-gradient-to-br from-indigo-600 to-blue-800',
      watermark: 'text-white/20',
      footerHover: 'hover:bg-indigo-800/50',
    },
  };

  const style = variantStyles[variant] || variantStyles.blue;

  const content = (
    <div
      className={`relative overflow-hidden rounded-xl shadow-md text-white ${style.bg} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group flex flex-col justify-between`}
    >
      {/* Top Body */}
      <div className="p-5 sm:p-6 pb-4 relative z-10 flex items-start justify-between">
        <div className="space-y-1 pr-4">
          <div className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-xs">
            {value}
          </div>
          <p className="text-sm sm:text-base font-semibold text-white/95 leading-snug">
            {title}
          </p>
          {(subtext || trend) && (
            <div className="flex items-center gap-2 pt-1 text-xs text-white/85 font-medium">
              {subtext && <span>{subtext}</span>}
              {trend && (
                <span
                  className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                    trendPositive
                      ? 'bg-white/25 text-white'
                      : 'bg-black/25 text-white'
                  }`}
                >
                  {trend}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Large Watermark Icon (AdminLTE style) */}
        {Icon && (
          <div className="absolute right-3 top-3 pointer-events-none opacity-25 group-hover:opacity-35 group-hover:scale-110 transition-all duration-300">
            <Icon className="w-20 h-20 sm:w-24 sm:h-24 stroke-[1.4]" />
          </div>
        )}
      </div>

      {/* Footer Info Bar */}
      {linkTo ? (
        <Link
          to={linkTo}
          className={`relative z-10 flex items-center justify-center gap-1.5 py-2 px-4 bg-black/15 ${style.footerHover} text-white text-xs sm:text-sm font-semibold transition-colors border-t border-black/10 cursor-pointer`}
        >
          <span>{linkText}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      ) : (
        <div className="relative z-10 flex items-center justify-between py-2 px-5 bg-black/10 text-white/80 text-xs font-semibold border-t border-black/10">
          <span>Data Resmi DKP Sulut</span>
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
        </div>
      )}
    </div>
  );

  return content;
}
