import { create } from "zustand";

export interface LoadingState {
  isLoading: boolean;
  progress: number;
  currentStage: string;
  setLoadingState: (state: Partial<Omit<LoadingState, "setLoadingState">>) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: true,
  progress: 0,
  currentStage: "initializing",
  setLoadingState: (state) => set((previous) => ({ ...previous, ...state })),
}));
