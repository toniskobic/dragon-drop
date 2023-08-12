import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { map, Observable, of, Subscription } from 'rxjs';
import { PageInput } from 'src/app/models/page.model';
import { UtilsService } from 'src/app/services/utils.service';
import { AppState } from 'src/app/state/app.reducer';
import { DesignCanvasActions } from 'src/app/state/design-canvas/design-canvas.actions';
import { selectCurrentPageSections, selectPages } from 'src/app/state/design-canvas/design-canvas.reducer';

@Component({
  selector: 'drd-pages-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    TranslateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
  ],
  templateUrl: './pages-sidenav.component.html',
  styleUrls: ['./pages-sidenav.component.scss'],
})
export class PagesSidenavComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  pages$ = this.store.select(selectPages);
  currentPageComponents$ = this.store.select(selectCurrentPageSections);

  pagesInput$: Observable<PageInput[]> = of([]);

  pagesOpened = false;

  constructor(
    private store: Store<AppState>,
    private utilsService: UtilsService
  ) {
    this.utilsService.initSvgIcons(['check', 'close', 'add', 'remove']);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.pages$
        .pipe(
          map(pages => {
            this.pagesInput$ = of(
              pages.map(page => {
                const formControl = new FormControl<string>(page.title, { nonNullable: true });
                return {
                  ...page,
                  formControl: formControl,
                  valueChanged: false,
                  confirmDelete: false,
                };
              })
            );
            this.subscriptions.push(
              this.pagesInput$.subscribe(value => {
                value.forEach(page => {
                  this.subscriptions.push(
                    page.formControl.valueChanges.subscribe(() => {
                      page.valueChanged = true;
                    })
                  );
                });
              })
            );
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }

  addPage(event: Event) {
    event.stopPropagation();
    this.store.dispatch(DesignCanvasActions.addPage());
  }

  close(page: PageInput) {
    if (page.confirmDelete) {
      page.confirmDelete = false;
    } else {
      page.formControl.setValue(page.title);
      page.valueChanged = false;
    }
  }

  confirm(page: PageInput) {
    if (page.confirmDelete) {
      this.store.dispatch(DesignCanvasActions.removePage({ pageId: page.id }));
      page.confirmDelete = false;
    } else {
      const updatedPage = { id: page.id, title: page.formControl.value, sections: page.sections };
      this.store.dispatch(
        DesignCanvasActions.updatePage({
          page: updatedPage,
        })
      );
      page.valueChanged = false;
    }
  }

  removePage(page: PageInput) {
    page.confirmDelete = !page.confirmDelete;
  }
}
