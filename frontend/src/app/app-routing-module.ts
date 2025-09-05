import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Main } from './main/main';
import { Page } from './page/page';
import { NewsPage } from './news-page/news-page';
import { SeriesPage } from './series-page/series-page';
import { Kdrama } from './kdrama/kdrama';
import { Anime } from './anime/anime';

const routes: Routes = [

  { path: '', component: Main },

  { path: 'movie/:index', component: Page},

  { path: 'only_movies/:index', component: Page},

  { path: 'series/:index', component: SeriesPage},

  { path: 'anime/:id', component: Anime},

  { path: 'news/:id', component: NewsPage},

  { path: 'kdrama/:id', component: Kdrama }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
