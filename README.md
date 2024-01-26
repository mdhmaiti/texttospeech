# Building the app

* build

## first general code that works

``` js
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
```

## with hooks

With hooks the code becomes more maintainable, I can use the hooks for the speech synthesis and to fetch the data from the api

```js
  "use client"
  // speech synthesis hook 
import { useState, useRef } from "react";

const useSpeechSynthesis = () => {
  type SpeechState = "idle" | "playing"; // it tells if to render the speak fetch or the play/ pause button
  const [speechState, setSpeechState] = useState<SpeechState>("idle"); // motnitors the triggers of speech utterence
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // to pause play state;
  const utterenceRef = useRef<SpeechSynthesisUtterance | null>(null);
 
  // note: the stop will contain both the isSSML state and the is Playing state as when i press the stop it should

  // a function to initialilze the speech lets call it initial sppech utterence
  const initializeUtterance = () => {
    // take the speech from the windows ; window provides the sppech synthesis
    if ('speechSynthesis' in window) {
    const speechSynthesis = (window as any).speechSynthesis;
    //for every new text lets initalize a new speech
    utterenceRef.current = new SpeechSynthesisUtterance(); // for every current speech always form a new object

    // when the utterence ends set the set the playing and the ssml to false
    utterenceRef.current.onend = () => {
      setIsPlaying(false);
      setSpeechState("idle");
    
    };

    //once the reading the done i want it to stop the process
    speechSynthesis.onend = null; // on end is given by the web api
    // changing the state for the playing using the global speech
    speechSynthesis.addEventListener("end", () => {
      setIsPlaying(false);
    });
  };
};

// resume/pause speech 
const resumePauseSpeech =()=>{
    if(!isPlaying){
      window.speechSynthesis.resume();
        setIsPlaying(true);
    }else if(isPlaying){
      window.speechSynthesis.pause();
     setIsPlaying(false);
    }


    }

    //stop speech 
    const stopSpeech = ()=>{
      if(isPlaying){
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setSpeechState("idle");
      }


    }

    const speakWithText =(text: string)=>{
      if(!isPlaying){
        // initialize the new instance
        initializeUtterance();
        // give the text to the ref so that it can speak 
        utterenceRef.current!.text = text; // it will come from the state;
        // pass the reference to the speak of the global
        (window as any).speechSynthesis.speak(utterenceRef.current);
        setIsPlaying(true);
        setSpeechState("playing");

      }
    }

    return { isPlaying, speechState,speakWithText,stopSpeech,resumePauseSpeech}
};
export default useSpeechSynthesis;





```

```js
// hooks for the fetch
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

```


 
