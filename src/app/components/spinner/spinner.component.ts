import { OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatProgressSpinnerModule, ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { OverlayService } from 'src/app/services/overlay.service';
import { AppState } from 'src/app/state/app.reducer';
import { selectIsExporting } from 'src/app/state/editor/editor.reducer';

@Component({
  selector: 'drd-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnInit, OnDestroy {
  @ViewChild('progressSpinnerRef', { static: true }) private progressSpinnerRef!: TemplateRef<unknown>;

  @Input() color?: ThemePalette;
  @Input() diameter?: number = 100;
  @Input() mode!: ProgressSpinnerMode;
  @Input() strokeWidth?: number;
  @Input() value?: number;
  @Input() backdropEnabled = true;
  @Input() positionGloballyCenter = true;

  private progressSpinnerOverlayConfig!: OverlayConfig;
  private overlayRef!: OverlayRef;
  private subscriptions: Subscription[] = [];

  constructor(
    private vcRef: ViewContainerRef,
    private overlayService: OverlayService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.progressSpinnerOverlayConfig = {
      hasBackdrop: this.backdropEnabled,
    };
    if (this.positionGloballyCenter) {
      this.progressSpinnerOverlayConfig['positionStrategy'] = this.overlayService.positionGloballyCenter();
    }

    this.overlayRef = this.overlayService.createOverlay(this.progressSpinnerOverlayConfig);

    this.subscriptions.push(
      this.store.select(selectIsExporting).subscribe(isExporting => {
        const displayProgressSpinner = isExporting;
        if (displayProgressSpinner && !this.overlayRef.hasAttached()) {
          this.overlayService.attachTemplatePortal(this.overlayRef, this.progressSpinnerRef, this.vcRef);
        } else if (!displayProgressSpinner && this.overlayRef.hasAttached()) {
          this.overlayRef.detach();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }
}
