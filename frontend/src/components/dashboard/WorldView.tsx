import React from "react";

export function WorldView() {
  return (
    <div className="flex flex-col flex-1">
      <div className="w-full h-[50vh] rounded-xl overflow-hidden shadow-lg">
        <iframe
          src="https://cyberscope.rickokkersen.nl/globe"
          className="w-full h-full rounded-xl border border-gray-200"
          title="World Globe"
          allowFullScreen
        />
      </div>
    </div>
  );
}