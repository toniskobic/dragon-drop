import { CanDeactivateComponent } from '../models/can-deactivate.model';

export function canDeactivateGuard(component: CanDeactivateComponent) {
  return component.canDeactivate();
}
