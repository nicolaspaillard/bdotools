import { animate, group, query, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { routes } from 'src/main';

export const slide = trigger('routeAnimations', [transition(':increment', slideTo('right')), transition(':decrement', slideTo('left'))]);

@Component({
  selector: 'app-root',
  animations: [slide],
  imports: [RouterModule, CommonModule, ButtonModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  routes: Route[] = routes.filter((route) => route.path && route.data);
}
function slideTo(direction: any) {
  const optional = { optional: true };
  return [
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: '0',
          width: '100%',
          height: '100%',
          [direction]: 0,
        }),
      ],
      optional,
    ),
    query(':enter', [style({ [direction]: '-100%' })]),
    group([query(':leave', [animate('600ms ease', style({ [direction]: '100%' }))], optional), query(':enter', [animate('600ms ease', style({ [direction]: '0%' }))])]),
  ];
}
