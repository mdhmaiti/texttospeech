"use client"
import { useState, useRef } from "react";
import useApiText from "./useApitText";

const useSpeechSynthesis = () => {
  type SpeechState = "idle" | "playing"; // it tells if to render the speak fetch or the play/ pause button
  const [speechState, setSpeechState] = useState<SpeechState>("idle"); // motnitors the triggers of speech utterence
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // to pause play state;
  const utterenceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const { textToSpeak } = useApiText();

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
      resetHighlightedRange();
      resetHighlightedRangeS();
    
    };

    //once the reading the done i want it to stop the process
    speechSynthesis.onend = null; // on end is given by the web api
    // changing the state for the playing using the global speech
    speechSynthesis.addEventListener("end", () => {
      setIsPlaying(false);
      resetHighlightedRange();
      resetHighlightedRangeS();
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
        resetHighlightedRange();
        resetHighlightedRangeS();

      }

      
    }
    utterenceRef.current?.addEventListener("boundary", (event) => {
      // Update the highlighted range when the speech reaches a word boundary
      updateHighlightedRange(event.charIndex, event.charIndex + event.charLength);
      updateHighlightedRangeS(
        event.charIndex,
        event.charIndex + event.charLength
      );
    });

    

    return { isPlaying, speechState,highlightedRange,highlightedRangeS,speakWithText,stopSpeech,resumePauseSpeech}
};
export default useSpeechSynthesis;



