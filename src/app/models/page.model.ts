import { DynamicComponent } from './dynamic-component.model';

export interface Page {
  id: string;
  title: string;
  components: DynamicComponent[];
}
