import { useEffect, useState } from "react";

type AudioMessageProps = {
  sound: Howl;
  from: "user" | "kense";
  duration: any
};

function AudioMessage({ sound, from, duration }: AudioMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [newSound, setSound]= useState<Howl | null>(null)
  const [soundDuration, setDuration]= useState(0)


  useEffect(()=>{
    console.log("mudou a duração: ", duration)
  }, [duration])

  const togglePlay = () => {
    if(newSound)
    if (newSound.playing()) newSound.pause();
    else newSound.play();

    console.log("audio play: ", newSound)
  };

  useEffect(()=>{
    setSound(sound)
  }, [sound])

  useEffect(()=>{
    console.log("chegou com: ", duration)
    const maxDuration = 10;
    const maxWidth = 300;
    const width = (duration / maxDuration) * maxWidth;
    setDuration(width)
  }, [duration])
  useEffect(() => {
    if (!newSound) return;
    let rafId: number;

    const update = () => {
      if (newSound.playing()) {
        const current = newSound.seek() as number;
        const durationIn = newSound.duration();
        setProgress(durationIn ? current / duration : 0);
      }
      rafId = requestAnimationFrame(update);
    };

    newSound.on("play", () => setIsPlaying(true));
    newSound.on("pause", () => setIsPlaying(false));
    newSound.on("end", () => { setIsPlaying(false); setProgress(0); });

    update();

    return () => {
      cancelAnimationFrame(rafId);
      newSound.off("play");
      newSound.off("pause");
      newSound.off("end");
    };
  }, [newSound]);

  useEffect(()=>{
    console.log("progresso: ", progress)
  }, [progress])

  return (
    <div className={`w-full my-2 flex ${from === "user" ? "justify-end" : "justify-start"}`}>
      <div className="relative flex items-center gap-3 p-3 rounded-xl bg-black/30 backdrop-blur-md">
        <button onClick={togglePlay} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition">
          {isPlaying ? "⏸" : "▶"}
        </button>
        <div style={{ width: `${soundDuration}px` }} className="flex-1 h-2 bg-white/30 rounded">
          <div className="h-2 bg-blue-500" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </div>
  );
}

export default AudioMessage