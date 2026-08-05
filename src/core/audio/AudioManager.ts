"use client";

import type { MusicMood } from "../director/directorTypes";

type TrackGroup = "intro" | "deep" | "silence" | "hope" | "finale";

interface AudioTrack {
  readonly group: TrackGroup;
  readonly gain: GainNode;
  readonly source: AudioBufferSourceNode | null;
  targetVolume: number;
}

interface AudioManagerState {
  context: AudioContext | null;
  masterGain: GainNode | null;
  muted: boolean;
  tracks: Record<TrackGroup, AudioTrack>;
  currentGroup: TrackGroup | null;
  crossfadeDuration: number;
}

const GROUP_FOR_MOOD: Record<MusicMood, TrackGroup> = {
  Silence: "silence",
  Ambient: "intro",
  DeepSpace: "deep",
  Tension: "deep",
  Discovery: "deep",
  Hope: "hope",
  Finale: "finale",
};

function createSilentBuffer(context: AudioContext, durationSeconds = 2): AudioBuffer {
  const sampleRate = context.sampleRate;
  const buffer = context.createBuffer(1, durationSeconds * sampleRate, sampleRate);
  const data = buffer.getChannelData(0);
  // Fill with extremely low amplitude noise so the track is "active" but silent.
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() - 0.5) * 0.0001;
  }
  return buffer;
}

class AudioManagerImpl {
  private state: AudioManagerState;

  constructor() {
    this.state = {
      context: null,
      masterGain: null,
      muted: false,
      tracks: {
        intro: {
          group: "intro",
          gain: null as unknown as GainNode,
          source: null,
          targetVolume: 0,
        },
        deep: {
          group: "deep",
          gain: null as unknown as GainNode,
          source: null,
          targetVolume: 0,
        },
        silence: {
          group: "silence",
          gain: null as unknown as GainNode,
          source: null,
          targetVolume: 0,
        },
        hope: {
          group: "hope",
          gain: null as unknown as GainNode,
          source: null,
          targetVolume: 0,
        },
        finale: {
          group: "finale",
          gain: null as unknown as GainNode,
          source: null,
          targetVolume: 0,
        },
      },
      currentGroup: null,
      crossfadeDuration: 1.2,
    };
  }

  init() {
    if (typeof window === "undefined") return;
    if (this.state.context) return;

    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const masterGain = context.createGain();
    masterGain.connect(context.destination);
    masterGain.gain.value = this.state.muted ? 0 : 0.75;

    const buffer = createSilentBuffer(context, 2);

    (Object.keys(this.state.tracks) as TrackGroup[]).forEach((group) => {
      const gain = context.createGain();
      gain.connect(masterGain);
      gain.gain.value = 0;

      const source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gain);
      source.start();

      this.state.tracks[group] = { group, gain, source, targetVolume: 0 };
    });

    this.state.context = context;
    this.state.masterGain = masterGain;
  }

  setMuted(muted: boolean) {
    this.state.muted = muted;
    if (this.state.masterGain) {
      const now = this.state.context?.currentTime ?? 0;
      this.state.masterGain.gain.setTargetAtTime(muted ? 0 : 0.75, now, 0.1);
    }
  }

  setMood(mood: MusicMood, reducedMotion = false) {
    if (reducedMotion) {
      this.setMuted(true);
      return;
    }

    this.init();
    const group = GROUP_FOR_MOOD[mood];
    if (!group || group === this.state.currentGroup) return;
    this.state.currentGroup = group;

    const now = this.state.context?.currentTime ?? 0;
    (Object.values(this.state.tracks) as AudioTrack[]).forEach((track) => {
      const target = track.group === group ? 1 : 0;
      track.targetVolume = target;
      track.gain.gain.setTargetAtTime(target, now, this.state.crossfadeDuration);
    });
  }

  teardown() {
    if (this.state.context && this.state.context.state !== "closed") {
      this.state.context.close();
    }
    this.state.context = null;
    this.state.masterGain = null;
    this.state.currentGroup = null;
  }

  isMuted() {
    return this.state.muted;
  }
}

export const AudioManager = new AudioManagerImpl();
