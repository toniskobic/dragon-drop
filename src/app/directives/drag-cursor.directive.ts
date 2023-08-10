import { CdkDrag } from '@angular/cdk/drag-drop';
import { Directive, OnDestroy, OnInit, Self } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[drdDragCursor]',
  standalone: true,
})
export class DragCursorDirective implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  constructor(@Self() private drag: CdkDrag) {}

  ngOnInit() {
    this.subscriptions?.push(
      this.drag._dragRef.started.subscribe(() => {
        document.body.classList.add('dragging-cursor');
      })
    );
    this.subscriptions?.push(
      this.drag._dragRef.ended.subscribe(() => {
        document.body.classList.remove('dragging-cursor');
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }
}
