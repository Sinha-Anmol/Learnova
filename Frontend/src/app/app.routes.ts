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
import { VideoListComponent } from './student-dashboard/video-list/video-list.component';
import { PdfListComponent } from './student-dashboard/pdf-list/pdf-list.component';
import { ContentListComponent } from './student-dashboard/content-list/content-list.component';
import { ContentViewComponent } from './student-dashboard/content-view/content-view.component';
import { AnalysisSComponent } from './student-dashboard/analysis-s/analysis-s.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'teacher',
    component: TeacherDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'Teacher' },
  },
  { path: 'teacher/pdf-upload', component: PdfUploadComponent },
  { path: 'teacher/video-upload', component: VideoUploadComponent },
  {
    path: 'student',
    component: StudentDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'student' }
  },
  { path: 'student-dashboard', component: StudentDashboardComponent },
  { path: 'student-dashboard/videos', component: VideoListComponent },
  { path: 'student-dashboard/pdfs', component: PdfListComponent },
  { path: 'content-list', component: ContentListComponent },
  { path: 'content/:id', component: ContentViewComponent },
  { path: 'student-dashboard/analysisS', component: AnalysisSComponent },
  {
    path: 'student-dashboard/content-view/:id',
    component: ContentViewComponent
  },
  { path: '', redirectTo: 'student-dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];