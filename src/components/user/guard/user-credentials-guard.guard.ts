import {CanMatchFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../../../services/auth/auth.service";

export const userCredentialsGuardGuard: CanMatchFn = (route, segments) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.getIsAuthenticated()) {
    return router.parseUrl("/acceso-denegado");
  }

  if (segments.length === 1 && segments[0].path === "usuario") {
    return router.parseUrl("/usuario/perfil");
  }

  if (segments.length > 1 && segments[0].path === "usuario") {
    return true;
  }

  return router.parseUrl("/404");
};
