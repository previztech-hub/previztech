"use client";

import React from 'react';

export default function FilmPlayer({ src, poster, title }) {
  return (
    <div className="bg-black rounded-2xl overflow-hidden shadow-xl">
      <video
        controls
        preload="metadata"
        poster={poster}
        playsInline
        className="w-full h-auto"
      >
        <source src={src} type="video/mp4" />
      </video>

      {title && (
        <div className="p-3 text-white text-sm tracking-wide">
          {title}
        </div>
      )}
    </div>
  );
}
