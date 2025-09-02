import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { Main } from './main/main';
import { Service } from './services/service';
import { HttpClientModule } from '@angular/common/http';
import { Page } from './page/page';
import { NewsPage } from './news-page/news-page';
import { SeriesPage } from './series-page/series-page';

@NgModule({
  declarations: [
    App,
    Header,
    Footer,
    Main,
    Page,
    NewsPage,
    SeriesPage
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    Service,
  ],
  bootstrap: [App]
})
export class AppModule { }
