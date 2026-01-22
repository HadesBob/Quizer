import { Link } from 'react-router-dom';
import {type LucideIcon } from 'lucide-react';

interface MenuCardProps {
  to: string;
  title: string;
  description: string;
  icon: LucideIcon;
  gradient?: string; // Opcjonalny własny gradient
}

export const GameSelectionCard = ({ 
  to, 
  title, 
  description, 
  icon: Icon, 
  gradient = "from-cyan-500 to-emerald-500" // Domyślny kolor
}: MenuCardProps) => {
  return (
   
<>
<Link className="card" to={to}>
  <div className="card-info">
    <h3 className="title">{title}</h3>
    <p>{description}</p>
  </div>
</Link>
</>
      
  );
};