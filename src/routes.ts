import { Routes } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';

export const routes: Routes = [
  {
    path: '/api',
    children: [
      { path: '/auth', module: AuthModule },
    ],
  },
];
