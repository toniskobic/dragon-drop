import { Directive, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

import { AppState } from '../state/app.reducer';
import { selectIsExporting } from '../state/editor/editor.reducer';

@Directive({
  selector: '[drdExcludeFromExport]',
  standalone: true,
})
export class ExcludeFromExportDirective implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private store: Store<AppState>
  ) {
    this.store
      .select(selectIsExporting)
      .pipe(takeUntil(this.destroy$))
      .subscribe(isExporting => {
        if (isExporting) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
