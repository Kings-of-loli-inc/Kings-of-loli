import { VFC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { LogIn } from '../../modules/log-in/log-in';
import { SignUp } from '../../modules/sign-in/sign-in';

export const AuthorizationPageRoute: VFC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/LogIn" element={<LogIn />} />
      </Routes>
    </BrowserRouter>
  );
};
