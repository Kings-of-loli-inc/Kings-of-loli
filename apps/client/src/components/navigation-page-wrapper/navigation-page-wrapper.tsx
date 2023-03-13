import { FC } from 'react';

import { NavBar } from '../../modules/nav-bar/nav-bar';

export const NavigationPageWrapper: FC = ({ children }) => {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
};
