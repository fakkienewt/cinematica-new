import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Main } from './main/main';
import { Page } from './page/page';

const routes: Routes = [

  { path: '', component: Main },

  { path: 'movie/:index', component: Page},

  { path: 'only_movies/:index', component: Page},

  { path: 'series/:index', component: Page},

  { path: 'cartoons/:index', component: Page}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
