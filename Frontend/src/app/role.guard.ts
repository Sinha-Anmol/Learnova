import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const expectedRole = route.data['role'];
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const payload = token.split('.')[1];
      const decodedToken = JSON.parse(atob(payload));
      const userRole = decodedToken.role;

      if (userRole === expectedRole) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}