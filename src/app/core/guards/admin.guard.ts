import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, from, map, switchMap, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.user$.pipe(
    filter(user => user !== undefined),
    take(1),
    switchMap(user => user ? from(auth.getProfile(user.uid)) : from([null])),
    map(profile => profile?.role === 'admin' ? true : router.createUrlTree(['/dashboard']))
  );
};