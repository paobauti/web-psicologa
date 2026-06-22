import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase';

export const authGuard: CanActivateFn = async () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  const session = await supabase.getSession();

  if (!session) {
    localStorage.clear();
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: '/citas' }
    });
  }

  return true;
};