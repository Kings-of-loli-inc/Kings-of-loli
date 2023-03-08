import { VFC } from 'react';

import { AuthorizationPageRoute } from '../authorization-page-route/authorization-page-route';
import { MainPageRoute } from '../main-page-roure/main-page-route';
import styles from './app-route.module.css';
export const AppRoute: VFC = () => {
  return (
    <div className={styles.app}>
      <MainPageRoute />
      <AuthorizationPageRoute />
    </div>
  );
};
