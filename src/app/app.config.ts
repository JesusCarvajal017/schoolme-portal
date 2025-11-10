import { provideEventPlugins } from "@taiga-ui/event-plugins";
import { provideAnimations } from "@angular/platform-browser/animations";
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { authInterceptor } from "./service/auth/token-interceptor-http";

export const appConfig: ApplicationConfig = {
  providers: 
  [provideAnimations(), 
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])), provideAnimations(),
    provideRouter(routes, withComponentInputBinding()), 
    provideEventPlugins(),
    provideHttpClient(),
    importProvidersFrom([SweetAlert2Module.forRoot()]),
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {subscriptSizing: 'dynamic'}},
  ]
};
