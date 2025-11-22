'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type TourState = {
  step: number;
  isOpen: boolean;
  isCompleted: boolean;
};

type TourActions = {
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  start: () => void;
  finish: () => void;
  close: () => void;
};

export const useTour = create<TourState & TourActions>()(
  persist(
    (set, get) => ({
      step: 0,
      isOpen: false,
      isCompleted: false,
      nextStep: () => set(state => ({ step: state.step + 1 })),
      prevStep: () => set(state => ({ step: state.step - 1 })),
      goToStep: (step: number) => set({ step }),
      start: () => {
        if (!get().isCompleted) {
          set({ isOpen: true, step: 0 });
        }
      },
      finish: () => set({ isOpen: false, isCompleted: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: 'ugo-ai-studio-tour-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ isCompleted: state.isCompleted }), // Only persist the 'isCompleted' status
    }
  )
);
