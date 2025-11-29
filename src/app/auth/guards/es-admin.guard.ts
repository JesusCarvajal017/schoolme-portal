import { inject, setTestabilityGetter } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthMainService } from '../../service/auth/auth-main.service';

export const esAdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const securityServices  = inject(AuthMainService);

  if(securityServices.estalogeado()){
    return true;
  }

  router.navigate(['/login']);
  return true;
  
};
