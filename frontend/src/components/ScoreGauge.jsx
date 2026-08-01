import React from 'react';

export const ScoreGauge = ({ score = 0, size = 180, strokeWidth = 14 }) => {
  const normalizedScore = Math.min(100, Math.max(0, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let colorClass = 'stroke-emerald-400';
  let glowColor = 'drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]';
  let textGrad = 'from-emerald-400 to-teal-200';
  let badgeLabel = 'Excellent Match';
  let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

  if (normalizedScore < 50) {
    colorClass = 'stroke-rose-500';
    glowColor = 'drop-shadow-[0_0_12px_rgba(244,63,94,0.5)]';
    textGrad = 'from-rose-400 to-red-200';
    badgeLabel = 'Needs Improvement';
    badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  } else if (normalizedScore < 75) {
    colorClass = 'stroke-amber-400';
    glowColor = 'drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]';
    textGrad = 'from-amber-400 to-yellow-200';
    badgeLabel = 'Moderate Match';
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-slate-800"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated score circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={`${colorClass} ${glowColor} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Inner score label */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br ${textGrad}`}>
            {normalizedScore}
          </span>
          <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            / 100 ATS
          </span>
        </div>
      </div>

      <div className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold border ${badgeBg}`}>
        {badgeLabel}
      </div>
    </div>
  );
};
