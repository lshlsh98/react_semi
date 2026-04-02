import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      memberId: null,
      memberGrade: null,
      memberName: null,
      memberThumb: null,
      memberAddr: null,
      token: null,
      endTime: null,
      isReady: false,

      login: ({
        memberId,
        memberGrade,
        memberName,
        memberThumb,
        memberAddr,
        token,
        endTime,
      }) => {
        set({
          memberId,
          memberGrade,
          memberName,
          memberThumb,
          memberAddr,
          token,
          endTime,
        });
      },
      logout: (isNotLogout = false) => {
        set({
          memberId: null,
          memberGrade: null,
          memberName: null,
          memberThumb: null,
          memberAddr: null,
          token: null,
          endTime: null,
          isNotLogout,
        });
      },
      setReady: (ready) => {
        set({ isReady: ready });
      },
      setThumb: (thumb) => {
        set({ memberThumb: thumb });
      },
      setName: (name) => {
        set({ memberName: name });
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
          memberAddr: state.memberAddr,
          token: state.token,
          endTime: state.endTime,
        };
      },
    },
  ),
);

export default useAuthStore;
