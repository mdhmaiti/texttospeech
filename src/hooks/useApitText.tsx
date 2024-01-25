"use client"
// src/hooks/useApiText.js
import { useState } from "react";

const useApiText = () => {
  const [textToSpeak, setTextToSpeak] = useState("");

  const fetchTextFromAPI = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts/" +
          Math.floor(Math.random() * 100)
      );
      const data = await response.json();
      // Use an array to store text parts
      const newTextParts = [textToSpeak, data.title, data.body];

      // Filter out empty or undefined parts
      const filteredTextParts = newTextParts.filter(
        (part) => part !== undefined && part !== ""
      );

      // Join the text parts with line breaks
      const postText = filteredTextParts.join("\n\n");
      setTextToSpeak(postText);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  return { textToSpeak, setTextToSpeak, fetchTextFromAPI };
};

export default useApiText;
