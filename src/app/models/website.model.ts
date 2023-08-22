import { FormControl } from '@angular/forms';

export interface Website {
  title: string;
}

export interface WebsiteInput extends Website {
  formControl: FormControl<string>;
  valueChanged: boolean;
}
