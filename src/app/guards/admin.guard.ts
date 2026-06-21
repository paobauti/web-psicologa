import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export const adminGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

  const { data } = await supabase.auth.getUser();

  if (data.user) {
    return true;
  }

  router.navigate(['/admin/login']);
  return false;
};