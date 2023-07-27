import {
  trigger,
  animate,
  transition,
  style,
  query,
} from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* => *', [
    query(
      ':leave',
      [
        style({
          opacity: 1,
        }),
        animate('0.3s', style({ opacity: 0, display: 'none' })),
      ],
      { optional: true }
    ),
    query(
      ':enter',
      [
        style({
          opacity: 0,
        }),
        animate('0.3s', style({ opacity: 1 })),
      ],
      { optional: true }
    ),
  ]),
]);
