import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { RoleGuard } from './role.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'teacher',
    component: TeacherDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'teacher' }, // Only teachers can access this route
  },
  {
    path: 'student',
    component: StudentDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'student' }, // Only students can access this route
  },
];