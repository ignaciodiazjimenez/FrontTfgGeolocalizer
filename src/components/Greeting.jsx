import React, { useState, useEffect } from "react";
import { getToken } from "../utils/api";

export default function Greeting() {
  const [name, setName] = useState("");

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        // payload.sub suele ser el username
        setName(payload.sub || payload.username || "");
      } catch {
        setName("");
      }
    }
  }, []);

  if (!name) return null;
  return (
    <p className="text-lg text-white mb-6">
      ¡Bienvenid@, <span className="font-semibold">{name}</span>!
    </p>
  );
}
