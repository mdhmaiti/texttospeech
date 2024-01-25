"use client"

import React from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ToggleLD } from "./ToggleLD";
import useSpeechSynthesis from "../hooks/useSpeechSynthesis";
import useApiText from "@/hooks/useApitText";


const TextToSpeechWH = () => {
    const {
      isPlaying,
      speakWithText,
      resumePauseSpeech,
      stopSpeech,
    } = useSpeechSynthesis();
    const { textToSpeak, setTextToSpeak, fetchTextFromAPI } = useApiText();
  
    // the value field to fetch the 
    return (
      <div className="flex flex-col gap-10 w-full">
        <Textarea
          className="min-h-64 w-full"
          placeholder="Type something...."
          onChange={(event) => setTextToSpeak(event.target.value)}
          value={textToSpeak}
        />
        <div className="flex flex-wrap flex-start gap-4">
          {isPlaying ? (
            <>
              <Button onClick={resumePauseSpeech}>
                {!isPlaying ? <p>Play</p> : <p>Pause</p>}
              </Button>
              <Button onClick={stopSpeech} disabled={!isPlaying}>
                Stop
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => speakWithText(textToSpeak)}>
                <p>Speak</p>
              </Button>
              <Button onClick={fetchTextFromAPI}>
                <p>Fetch</p>
              </Button>
            </>
          )}
          <ToggleLD />
        </div>
      </div>
    );
  };
  
  export default TextToSpeechWH;