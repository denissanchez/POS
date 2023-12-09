import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(SweetAlert2Module.forRoot()), importProvidersFrom(BrowserAnimationsModule), importProvidersFrom(NgxSpinnerModule.forRoot({
    type: 'ball-atom'
  }))]
};
