import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// import { registerRequest } from '../../api/auth';
// import { createUser } from '../../interfaces/authorization-interfaces/user-interface/user-interface';

type State = {
  token: string | undefined;
  isAuth: boolean;
  errors: any;
};

type Actions = {
  // eslint-disable-next-line no-unused-vars
  setToken: (token: string) => void;
  // register: (user: createUser) => void;
  logout: () => void;
  cleanErrors: () => void;
};

export const useAuthStore = create(
  persist<State & Actions>(
    (set) => ({
      token: undefined,
      isAuth: false,
      errors: undefined,
      setToken: (token: string) =>
        set(() => ({
          token,
          isAuth: !!token,
        })),
      // register: async () => {
      //   try {
      //     // const responseRegister = await registerRequest(user);
      //     set(() => ({
      //       token: 'huina',
      //       isAuth: true,
      //     }));
      //   } catch (error: any) {
      //     set(() => ({ errors: error.response.data }));
      //   }
      // },
      logout: () => set(() => ({ token: undefined, isAuth: false })),
      cleanErrors: () => set(() => ({ errors: undefined })),
    }),
    {
      name: 'auth',
    },
  ),
);
