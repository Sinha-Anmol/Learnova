import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'content/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => {
      // Return a Promise of parameters to prerender
      return Promise.resolve([{ id: '1' }, { id: '2' }, { id: '3' }]);
    }
  },
  {
    path: 'student-dashboard/content-view/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => {
      // Return a Promise of parameters to prerender
      return Promise.resolve([{ id: '1' }, { id: '2' }, { id: '3' }]);
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
