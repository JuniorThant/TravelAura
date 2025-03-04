"use client";
import { useState } from "react";
import { Input } from "../ui/input";

export default function AISearch() {
  const [query, setQuery] = useState("");
  const [roomIds, setRoomIds] = useState<string[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const response = await fetch("/api/aiSearch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      setRoomIds(data.roomIds);
      
      // Fetch room details
      if (data.roomIds.length) {
        const roomData = await fetchRoomsById(data.roomIds);
        console.log("Rooms:", roomData);
      }
    } catch (error) {
      console.error("Search Error:", error);
    }
  };

  return (
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
  );
}

// Fetch Room Details
const fetchRoomsById = async (roomIds: string[]) => {
  const response = await fetch("/api/fetchRooms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roomIds }),
  });

  return response.json();
};
