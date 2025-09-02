import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Main } from './main/main';
import { Page } from './page/page';
import { NewsPage } from './news-page/news-page';
import { SeriesPage } from './series-page/series-page';

const routes: Routes = [

  { path: '', component: Main },

  { path: 'movie/:index', component: Page},

  { path: 'only_movies/:index', component: Page},

  { path: 'series/:index', component: SeriesPage},

  { path: 'cartoons/:index', component: Page},

  { path: 'anime/:index', component: Page},

  { path: 'news/:id', component: NewsPage}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
