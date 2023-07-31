import {
  animate,
  animateChild,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({
          opacity: 0,
          position: 'absolute',
          height: '100%',
          width: '100%',
        }),
      ],
      { optional: true }
    ),
    query(
      ':leave',
      [
        style({
          opacity: 1,
          position: 'absolute',
          height: '100%',
          width: '100%',
        }),
        animate('0.3s', style({ opacity: 0 })),
      ],
      { optional: true }
    ),
    query(
      ':enter',
      [
        style({
          opacity: 0,
          position: 'relative',
          height: '100%',
          width: '100%',
        }),
        animate('0.3s', style({ opacity: 1 })),
      ],
      { optional: true }
    ),
    query('@*', animateChild(), { optional: true }),
  ]),
]);
