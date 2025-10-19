import React from "react";

function TopButtons({ setQuery }) {
  const cities = [
    {
      id: 1,
      title: "Surat",
    },
    {
      id: 2,
      title: "Ahmedabad",
    },
    {
      id: 3,
      title: "Gandhinagar",
    },
    {
      id: 4,
      title: "Baroda",
    },
    {
      id: 5,
      title: "Rajkot",
    },
  ];

  return (
    <div className="flex items-center justify-around my-6">
      {cities.map((city) => (
        <button
          key={city.id}
          className="text-white text-lg font-medium"
          onClick={() => setQuery({ q: city.title })}
        >
          {city.title}
        </button>
      ))}
    </div>
  );
}

export default TopButtons;
