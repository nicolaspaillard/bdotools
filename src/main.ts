import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideZoneChangeDetection } from '@angular/core';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { initializeAppCheck, provideAppCheck, ReCaptchaEnterpriseProvider } from '@angular/fire/app-check';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
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
    provideFirebaseApp(() => initializeApp({ projectId: 'bdo-tools-8ee84', appId: '1:1080259118563:web:78a0c99876678cf7810cd6', storageBucket: 'bdo-tools-8ee84.firebasestorage.app', apiKey: 'AIzaSyBVgoYHyhh6FlTzfT6Q8RSvp605TJKhn0o', authDomain: 'bdo-tools-8ee84.firebaseapp.com', messagingSenderId: '1080259118563', measurementId: 'G-TSCD1RDJ8F' })),
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    UserTrackingService,
    provideAppCheck(() => {
      // TODO get a reCAPTCHA Enterprise here https://console.cloud.google.com/security/recaptcha?project=_
      const provider = new ReCaptchaEnterpriseProvider('6LcwbfkqAAAAAJTFap35siG1v2WfJkjZXHVwnA3C');
      return initializeAppCheck(undefined, { provider, isTokenAutoRefreshEnabled: true });
    }),
    provideFirestore(() => getFirestore()),
  ],
}).catch((err) => console.error(err));
