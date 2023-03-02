import { useState, VFC } from 'react';

import { AuthorizationButton } from '../../components/authorizarion-button/authorization-button';
import { AuthorizationHeader } from '../../components/authorization-header/authorization-header';
import { AuthorizationWrapper } from '../../components/authorization-page-wrapper/authorization-page-wrapper';
import { LogInForm } from './log-in-form/log-in-form';
import styles from './log-in-page.module.css';

export const LogIn: VFC = () => {
  const [health, setHealth] = useState(3);
  const healthDecrement = () =>
    setHealth((previous) => (previous === 0 ? 3 : previous - 1));
  return (
    <AuthorizationWrapper>
      <div className={styles.logIn}>
        <AuthorizationHeader health={health} />
        <LogInForm onSubmit={healthDecrement} />
        <div className={styles.logInButtons}>
          <AuthorizationButton />
        </div>
      </div>
    </AuthorizationWrapper>
  );
};
