import { Link } from "react-router-dom";
import { logoutUser, clearMessages } from '../features/auth/authSlice';
import { Hero } from "../components/Hero";
import { GameSelectionCards } from "../components/GameSelectionCards";


export const HomePage = () => {
  return (
    <>
      <Hero />
      <GameSelectionCards />
    </>
    
  );
}

