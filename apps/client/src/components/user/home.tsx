import { VFC } from 'react';

import { RouterOutputs } from '../../trpc';

type HomeProperties = {
  users?: RouterOutputs['users']['getAll'];
  onUserCreate: () => void;
};

export const Home: VFC<HomeProperties> = ({ users, onUserCreate }) => {
  return (
    <>
      {console.log(users)}
      <div>{users?.map((user) => user.id)}</div>
      <button onClick={onUserCreate}>Create new User</button>
    </>
  );
};
