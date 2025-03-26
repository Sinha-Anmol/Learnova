import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRole = route.data['role']; // Get the required role from the route data
    const userRole = this.authService.getRole(); // Get the user's role

    if (userRole === requiredRole) {
      return true; // Allow access if the roles match
    } else {
      this.router.navigate(['/login']); // Redirect to login if the roles don't match
      return false;
    }
  }
}