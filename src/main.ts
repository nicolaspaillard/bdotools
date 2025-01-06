import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, Routes, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { AppComponent } from './app/app.component';

export const routes: Routes = [
  { path: '', title: 'Bdo Tools', loadComponent: () => import('@routes/home/home.component').then((m) => m.HomeComponent), data: { animation: 0 } },
  { path: 'trade', title: 'Trade calculator', loadComponent: () => import('@routes/trade/trade.component').then((m) => m.TradeComponent), data: { animation: 0 } },
  { path: 'untile', title: 'Untile', loadComponent: () => import('@routes/untile/untile.component').then((m) => m.UntileComponent), data: { animation: 0 } },
  { path: '**', redirectTo: '' },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
      ripple: true,
    }),
  ],
}).catch((err) => console.error(err));
