// src/components/TextToSpeech.js
"use client"
import React, { useState, useRef } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ToggleLD } from "./ToggleLD";

const TextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSSML, setIsSSML] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [textToSpeak, setTextToSpeak] = useState("");

  const initializeUtterance = () => {
    const speechSynthesis = (window as any).speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();
    utteranceRef.current = utterance;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsSSML(false);
    };

    speechSynthesis.onend = null;
    speechSynthesis.addEventListener("end", () => {
      setIsPlaying(false);
    });
  };

  const speakWithText = () => {
    if (!isPlaying) {
      initializeUtterance();
      utteranceRef.current!.text = textToSpeak;
      (window as any).speechSynthesis.speak(utteranceRef.current);

      setIsPlaying(true);
      setIsSSML(true);
    }
  };

  const resumePauseSpeech = () => {
    if (!isPlaying) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
    } else if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    }
  };

  const stopSpeech = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsSSML(false);
    }
  };
  const fetchTextFromAPI = async () => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts/"+ + Math.floor(Math.random() * 100));
      const data = await response.json();
      // Use an array to store text parts
    const newTextParts = [textToSpeak, data.title, data.body];

    // Filter out empty or undefined parts
    const filteredTextParts = newTextParts.filter(part => part !== undefined && part !== '');

    // Join the text parts with line breaks
    const postText = filteredTextParts.join('\n\n');
      setTextToSpeak(postText);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  return (
    <div className="flex flex-col gap-10 w-full  ">
      <Textarea
        className=" min-h-64 w-wull "
        placeholder="Type something...."
        onChange={(event) => setTextToSpeak(event.target.value)}
        value={textToSpeak}
      />
      <div className="flex flex-wrap flex-start gap-4 ">
        {!isSSML ? (
            <>
            <Button onClick={speakWithText}>
              <p>Speak</p>
            </Button>
            <Button onClick={fetchTextFromAPI}>
              <p>Fetch </p>
            </Button>
          </>
        ) : (
          <Button className="w-24" onClick={resumePauseSpeech}>
            {!isPlaying ? <p>Play</p> : <p>Pause</p>}
          </Button>
        )}

        <Button  className="w-24" onClick={stopSpeech} disabled={!isPlaying}>
          Stop
        </Button>
        <ToggleLD/>
      </div>
    </div>
  );
};

export default TextToSpeech;
