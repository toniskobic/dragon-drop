import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { CKEditorComponent, CKEditorModule } from '@ckeditor/ckeditor5-angular';
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon-block';
import { Store } from '@ngrx/store';
import { ElementClassObserver } from 'src/app/models/element-class-observer.class';
import { AppState } from 'src/app/state/app.reducer';
import { DesignCanvasActions } from 'src/app/state/design-canvas/design-canvas.actions';

@Component({
  selector: 'drd-rich-text-editor',
  standalone: true,
  imports: [CommonModule, CKEditorModule],
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
})
export class RichTextEditorComponent {
  Editor = BalloonEditor;

  @ViewChild('editor') editor!: CKEditorComponent<BalloonEditor>;

  @Input() id: string = '';
  @Input() data: string = '';

  changed = false;
  classWatcher: ElementClassObserver | null = null;

  constructor(private store: Store<AppState>) {}

  onChange() {
    this.changed = true;

    if (!this.classWatcher) {
      const element = document.getElementsByClassName('ck ck-button ck-block-toolbar-button')[0] as HTMLDivElement;
      this.classWatcher = new ElementClassObserver(element, 'ck-hidden', () => {
        if (this.changed) {
          this.store.dispatch(
            DesignCanvasActions.updateElement({ data: this.editor.editorInstance?.getData() as string, id: this.id })
          );
          this.changed = false;
        }
      });
    }
  }
}
