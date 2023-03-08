import { VFC } from 'react';

import { NavigationPageWrapper } from '../../components/navigation-page-wrapper/navigation-page-wrapper';
import { leaderboardData } from '../../database/leaderboard-database';
import { UserPossitionProperties } from '../../interfaces/page-interfaces/page-interfaces';
import styles from './stats-page.module.css';

const UserPossition: VFC<UserPossitionProperties> = ({ user }) => {
  const { score, name, place } = user;
  return (
    <div className={styles.player}>
      <span>
        {place}. {name}
      </span>
      <span>{score}</span>
    </div>
  );
};
export const StatsPage: VFC = () => {
  return (
    <NavigationPageWrapper>
      <div className={styles.container}>
        <div className={styles.leaderboard}>
          <h1>
            <span className={styles.projectName}> leaderboard</span>
          </h1>
          {leaderboardData.users.map((user) => (
            <UserPossition user={user} key={user.place} />
          ))}
        </div>
      </div>
    </NavigationPageWrapper>
  );
};
