// app.routes.ts
import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { RoleGuard } from './role.guard';
import { PdfUploadComponent } from './teacher-dashboard/pdf-upload/pdf-upload.component';
import { VideoUploadComponent } from './teacher-dashboard/video-upload/video-upload.component';
export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'teacher',
    component: TeacherDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'Teacher' },
    children: [
      { path: 'upload-video', component: VideoUploadComponent },
      { path: 'upload-pdf', component: PdfUploadComponent }
    ]
  },
  {
    path: 'student',
    component: StudentDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'Student' }
  },
  { path: '**', redirectTo: '' }
];