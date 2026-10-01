"use client";

import PageAudioPlayer from "@/components/PageAudioPlayer";

export default function LeadersAudio() {
  return (
    <PageAudioPlayer
      src="/audio/time-note.mp3"
      label="Listen to Tyler read this (50 sec)"
      ariaLabel="Listen to Tyler read this note"
    />
  );
}
