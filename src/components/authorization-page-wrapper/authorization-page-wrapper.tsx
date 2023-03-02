import { FC } from 'react';

import { AuthorizationBackground } from '../authorization-background/authorization-background';

export const AuthorizationWrapper: FC = ({ children }) => {
  return (
    <>
      <AuthorizationBackground />
      {children}
    </>
  );
};
