import { Routes } from '@angular/router';
import { EditorComponent } from './pages/editor/editor.component';

export const routes: Routes = [
    { path: 'editor', component: EditorComponent },
    { path: '', redirectTo: '/editor', pathMatch: 'full' },
    { path: '**', redirectTo: '/editor' },
];
