import React, { FC } from 'react';

import { trpc } from '../../trpc';
import { Home } from './home';

export const HomeContainer: FC = () => {
  const { data: users } = trpc.users.getAllUsers.useQuery({});
  const { mutate: createUser } = trpc.auth.register.useMutation();
  const handleUserCreate = () => {
    createUser({
      name: '123',
      password: 'some test',
    });
  };
  return (
    <>
      <Home users={users} onUserCreate={handleUserCreate} />
    </>
  );
};
