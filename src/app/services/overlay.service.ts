import { Overlay, OverlayConfig, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Injectable, TemplateRef, ViewContainerRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  constructor(private overlay: Overlay) {}

  createOverlay(config: OverlayConfig): OverlayRef {
    return this.overlay.create(config);
  }

  attachTemplatePortal(overlayRef: OverlayRef, templateRef: TemplateRef<unknown>, vcRef: ViewContainerRef) {
    const templatePortal = new TemplatePortal(templateRef, vcRef);
    overlayRef.attach(templatePortal);
  }

  positionGloballyCenter(): PositionStrategy {
    return this.overlay.position().global().centerHorizontally().centerVertically();
  }
}
