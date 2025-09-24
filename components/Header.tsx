import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-6 py-4 border-b-4 border-[--majorelle-blue]">
        <h1 className="text-2xl md:text-3xl font-bold text-[--royal-blue] tracking-tight">
          Free Fall Physics Simulator
        </h1>
        <p className="text-[--text-light] mt-1">Explore the effects of gravity and air resistance.</p>
      </div>
    </header>
  );
};

export default Header;