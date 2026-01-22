import { Swords, Globe, Trophy } from 'lucide-react';
import { GameSelectionCard } from './GameSelectionCard';

export const GameSelectionCards = () => {
  return (
    <div className="flex justify-around w-3/4 mx-auto">
      <GameSelectionCard 
        to="/#"
        title="Arena"
        description="Rywalizuj z innymi graczami online"
        icon={Globe}
        gradient="from-cyan-500 to-emerald-500"
      />
      
      <GameSelectionCard 
        to="/lobby"
        title="Pojedynek 1  vs  1"
        description="Pojedynek na śmierć i życie"
        icon={Swords}
        gradient="from-rose-500 to-purple-600"
      />

      <GameSelectionCard 
        to="#"
        title="Survival"
        description="Sprawdź ile wytrzymasz"
        icon={Trophy}
        gradient="from-amber-400 to-orange-600"
      />
    </div>
  );
};