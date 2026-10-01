import PageAudioPlayer from "@/components/PageAudioPlayer";
import { PAGE_AUDIO_ENABLED } from "@/data/pageAudio";

export default function LeadersAudio() {
  if (!PAGE_AUDIO_ENABLED) return null;

  return (
    <PageAudioPlayer
      src="/audio/time-note.mp3"
      label="Listen to Tyler read this (40 sec)"
      ariaLabel="Listen to Tyler read this note"
    />
  );
}
