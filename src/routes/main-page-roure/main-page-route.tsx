/* eslint-disable unicorn/filename-case */
import { VFC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { HomePage } from '../../modules/home-page/home-page';
import { ProfilePage } from '../../modules/profile-page/profile-page';
import { SettingsPage } from '../../modules/settings-page/settings-page';
import { StatsPage } from '../../modules/stats-page/stats-page';

export const MainPageRoute: VFC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<ProfilePage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
};
