import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export const SkillBadge = ({ skill, type = 'matched' }) => {
  const isMatched = type === 'matched';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
        isMatched
          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25 hover:bg-emerald-500/20'
          : 'bg-rose-500/10 text-rose-300 border-rose-500/25 hover:bg-rose-500/20'
      }`}
    >
      {isMatched ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <XCircle className="w-3.5 h-3.5 text-rose-400" />
      )}
      {skill}
    </span>
  );
};
