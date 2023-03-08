import { VFC } from 'react';

import { trpc } from '../../trpc';
import { Home } from './home';

export const HomeContainer: VFC = () => {
  const { data: users } = trpc.users.getAll.useQuery();
  const { mutate: createUser } = trpc.users.createUser.useMutation();
  const handleUserCreate = () => {
    createUser({
      email: `text@example.com`,
    });
  };
  return (
    <>
      <Home users={users} onUserCreate={handleUserCreate} />
    </>
  );
};
