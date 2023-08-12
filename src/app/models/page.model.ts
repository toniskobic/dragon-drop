import { FormControl } from '@angular/forms';

import { DynamicComponent } from './dynamic-component.model';

export interface Page {
  id: string;
  title: string;
  components: DynamicComponent[];
}

export interface PageInput extends Page {
  formControl: FormControl<string>;
  valueChanged: boolean;
  confirmDelete: boolean;
}
