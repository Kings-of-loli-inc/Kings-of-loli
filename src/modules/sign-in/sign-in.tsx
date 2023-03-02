import { useState, VFC } from 'react';

import { AuthorizationButton } from '../../components/authorizarion-button/authorization-button';
import { AuthorizationHeader } from '../../components/authorization-header/authorization-header';
import { AuthorizationWrapper } from '../../components/authorization-page-wrapper/authorization-page-wrapper';
import { SignUpForm } from './sign-in-form/sign-in-form';
import styles from './sign-up.module.css';
export const SignUp: VFC = () => {
  const [health, setHealth] = useState(3);
  const healthDecrement = () =>
    setHealth((previous) => (previous === 0 ? 3 : previous - 1));
  return (
    <AuthorizationWrapper>
      <div className={styles.signUp}>
        <AuthorizationHeader health={health} />
        <SignUpForm onSubmit={healthDecrement} />
        <div className={styles.signUpButtons}>
          <AuthorizationButton />
        </div>
      </div>
    </AuthorizationWrapper>
  );
};
