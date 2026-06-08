const MatchItem = ({ date, league, team1, team2, time, format, stage }) => {
  return (
    <div className="grid grid-cols-[160px_1fr_80px_1fr_120px] items-center px-6 py-4 border-b border-gray-700 text-white hover:bg-[#25204d] transition-colors">
      
      {/* Date et Ligue */}
      <div className="flex flex-col">
        <span className="text-xs font-bold">{date}</span>
        <span className="text-[10px] text-gray-400 uppercase">{league}</span>
      </div>

      {/* Équipe 1 : Conteneur de taille fixe */}
      <div className="flex items-center justify-end gap-3">
        <span className="font-bold text-lg truncate">{team1}</span>
        <div className="w-8 h-8 bg-blue-500 rounded-full flex-shrink-0"></div>
      </div>

      {/* Bloc VS : Centré */}
      <div className="flex flex-col items-center justify-center">
        <span className="font-bold text-sm">{time}</span>
        <span className="text-xs text-gray-400">VS</span>
      </div>

      {/* Équipe 2 : Conteneur de taille fixe */}
      <div className="flex items-center justify-start gap-3">
        <div className="w-8 h-8 bg-red-500 rounded-full flex-shrink-0"></div>
        <span className="font-bold text-lg truncate">{team2}</span>
      </div>

      {/* Stream/Format */}
      <div className="flex flex-col items-end justify-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.16em] text-gray-400">
          {stage}
        </span>
        <span className="bg-purple-500 w-4 h-4 rounded-full"></span>
        <span className="text-xs uppercase tracking-[0.12em] text-gray-300">
          {format}
        </span>
      </div>
      
    </div>
  );
};

export default MatchItem;
