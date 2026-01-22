import { Outlet } from 'react-router-dom';


export const RootLayout = () => {
  return (
    <div className="h-screen pt-10">
        <Outlet /> 
    </div>
  );
};