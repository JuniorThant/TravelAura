"use client";
import { useState } from "react";
import { Input } from "../ui/input";

export default function AISearch() {
  const [query, setQuery] = useState("");
  const [rooms, setRooms] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      // Step 1: AI Search - Get Room IDs
      const response = await fetch("/api/aiSearch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      
      if (data.roomIds.length) {
        // Step 2: Fetch Room Details by ID
        const roomData = await fetchRoomsById(data.roomIds);
        setRooms(roomData);
      } else {
        setRooms([]);
      }
    } catch (error) {
      console.error("Search Error:", error);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Search for rooms"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs dark:bg-muted"
        />
        <button onClick={handleSearch} className="px-4 py-2 bg-blue-500 text-white rounded">
          Search
        </button>
      </div>
      {/* Display Room Results */}
      <div>
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div key={room.id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-bold">{room.type}</h3>
              <p>Price: ${room.price}</p>
              <p>Guests: {room.guests}</p>
              <p>Amenities: {room.amenities}</p>
            </div>
          ))
        ) : (
          <p>No rooms found.</p>
        )}
      </div>
    </div>
  );
};

// Fetch Room Details Function
const fetchRoomsById = async (roomIds: string[]) => {
  const response = await fetch("/api/fetchRooms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roomIds }),
  });

  return response.json();
};
