import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ListItem } from 'src/app/models/list-item.model';

export abstract class InitIconsComponent {
  constructor(
    protected domSanitizer: DomSanitizer,
    protected matIconRegistry: MatIconRegistry,
    protected icons?: string[],
    protected listItems?: ListItem[]
  ) {
    this.initSvgIcons();
  }

  protected initSvgIcons() {
    const icons = this.icons || this.listItems?.map(item => item.icon);
    icons?.forEach(icon => {
      this.matIconRegistry.addSvgIcon(
        icon,
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          `assets/svgs/${icon}.svg`
        )
      );
    });
  }
}
