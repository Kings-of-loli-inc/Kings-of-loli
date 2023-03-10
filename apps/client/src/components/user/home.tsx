import React, { FC } from 'react';

import { RouterOutputs } from '../../trpc';

type HomeProperties = {
  users?: RouterOutputs['users'][''];
  onUserCreate: () => void;
};

export const Home: FC<HomeProperties> = ({ users, onUserCreate }) => {
  return (
    <>
      {console.log(users)}
      <div>{users?.map((user) => user.id)}</div>
      <button onClick={onUserCreate}>Create new User</button>
    </>
  );
};
