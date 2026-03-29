import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      memberId: null,
      memberGrade: null,
      memberName: null,
      memberThumb: null,
      token: null,
      endTime: null,
      isReady: false,

      login: ({ memberId, memberGrade, memberName, memberThumb, token, endTime }) => {
        set({ memberId, memberGrade, memberName, memberThumb, token, endTime });
      },
      logout: () => {
        set({
          memberId: null,
          memberGrade: null,
          memberName: null,
          memberThumb: null,
          token: null,
          endTime: null,
        });
      },
      setReady: (ready) => {
        set({ isReady: ready });
      },
      setThumb: (thumb) => {
        set({ memberThumb: thumb });
      },
    }),
    {
      name: "auth-key",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        return {
          memberId: state.memberId,
          memberGrade: state.memberGrade,
          memberName: state.memberName, 
          memberThumb: state.memberThumb,
          token: state.token,
          endTime: state.endTime,
        };
      },
    }
  )
);

export default useAuthStore;