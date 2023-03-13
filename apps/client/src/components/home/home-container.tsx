import React, { FC } from 'react';

import { trpc } from '../../trpc';
import { Home } from './home';

export const HomeContainer: FC = () => {
  const { data: users } = trpc.users.getAllUsers.useQuery({ limit: 20 });
  return (
    <>
      <Home users={users} />
    </>
  );
};
