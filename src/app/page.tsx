import TextToSpeech from "@/components/TextToSpeech";
import TextToSpeechWH from "@/components/TextToSpeechWH";

import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      {/* <TextToSpeechWH/>  */}
      <TextToSpeech/> 
    </main>
  );
}
