// src/components/TextToSpeech.js
"use client";
import React, { useState, useRef } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ToggleLD } from "./ToggleLD";

const TextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSSML, setIsSSML] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [textToSpeak, setTextToSpeak] = useState("");
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);

  const [highlightedRange, setHighlightedRange] = useState({
    start: -1,
    end: -1,
  });
  const [highlightedRangeS, setHighlightedRangeS] = useState({
    start: -1,
    end: -1,
  });

  const updateHighlightedRange = (start: any, end: any) => {
    setHighlightedRange({ start, end });
  };

  const updateHighlightedRangeS = (start: any, end: any) => {
    const text = textToSpeak;
    const sentenceDelimiter = "." || "?" || "!";

    let sentenceStart = start;
    let sentenceEnd = end;

    // Find the start of the current sentence
    while (sentenceStart > -1 && text[sentenceStart] !== sentenceDelimiter) {
      sentenceStart--;
    }

    // Find the end of the current sentence
    while (
      sentenceEnd < text.length &&
      text[sentenceEnd] !== sentenceDelimiter
    ) {
      sentenceEnd++;
    }

    // Highlight the current sentence
    setHighlightedRangeS({ start: sentenceStart , end: sentenceEnd });
  };
  const resetHighlightedRangeS = () => {
    setHighlightedRange({ start: -1, end: -1 });
  };

  ///

  const resetHighlightedRange = () => {
    setHighlightedRange({ start: -1, end: -1 });
  };

  const initializeUtterance = () => {
    const speechSynthesis = (window as any).speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();
    utteranceRef.current = utterance;
   
    utterance.onend = () => {
      setIsPlaying(false);
      setIsSSML(false);
      resetHighlightedRange();
      resetHighlightedRangeS();
    };

    speechSynthesis.onend = null;
    speechSynthesis.addEventListener("end", () => {
      setIsPlaying(false);
      resetHighlightedRange();
      resetHighlightedRangeS();
    });
  };

  const speakWithText = () => {
    if (!isPlaying) {
      stopSpeech();
    

      // Re-initialize the utterance with the new voice
      initializeUtterance();
      utteranceRef.current!.text = textToSpeak;
      utteranceRef.current!.text = textToSpeak;
      if (selectedVoice) {
        const selectedVoiceObject = speechSynthesis
          .getVoices()
          .find((voice) => voice.name === selectedVoice);
        utteranceRef.current!.voice = selectedVoiceObject as SpeechSynthesisVoice | null;;
      }


      
      (window as any).speechSynthesis.speak(utteranceRef.current);

      setIsPlaying(true);
      setIsSSML(true);
      resetHighlightedRange();
      resetHighlightedRangeS();
    }
  };


  utteranceRef.current?.addEventListener("start", () => {
    // Reset the highlighted range when speech starts
    resetHighlightedRange();
  });
  
  utteranceRef.current?.addEventListener("end", () => {
    // Reset the highlighted range when speech ends
    resetHighlightedRange();
  });
  utteranceRef.current?.addEventListener("boundary", (event) => {
    // Update the highlighted range when the speech reaches a word boundary
    updateHighlightedRange(event.charIndex, event.charIndex + event.charLength);
    updateHighlightedRangeS(
      event.charIndex,
      event.charIndex + event.charLength
    );
  });
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
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts/" +
          +Math.floor(Math.random() * 100)
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

  return (
    <div className="flex flex-col gap-10 w-full  ">
      <Textarea
        className=" min-h-64 w-full "
        placeholder="Type something...."
        onChange={(event) => setTextToSpeak(event.target.value)}
        value={textToSpeak}
      />
      <div className="">
        <div className="max-w-full max-h-96 hover:overflow-y-scroll overflow-hidden  ">
          {textToSpeak.split('').map((char, index) => (
            <span key={index} className=" ">
               <span
              
              className={  `  ${ index >= highlightedRange.start && index < highlightedRange.end
                ? "bg-rose-400"
                : ""}   ${
                  index >= highlightedRangeS.start+1 && index < highlightedRangeS.end
                    ? "bg-lime-500 "
                    : ""
                }` 
               
              }
            >
               {char}
            </span>
         

            </span>
           
            
          ))}
        </div>
       
      </div>
      

      <div className="flex flex-wrap flex-start gap-4 ">

      <select
        value={selectedVoice|| ""}
        onChange={(e) => setSelectedVoice(e.target.value)}
        className="p-2 border rounded-md appearance-none"
      >
        <option value="">Default Voice</option>
        {speechSynthesis.getVoices().map((voice) => (
          <option key={voice.name} value={voice.name}>
            {voice.name}
          </option>
        ))}
      </select>
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

        <Button className="w-24" onClick={stopSpeech} disabled={!isPlaying}>
          Stop
        </Button>
        <ToggleLD />
      </div>
    </div>
  );
};

export default TextToSpeech;
