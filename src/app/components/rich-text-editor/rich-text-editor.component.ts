import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { CKEditorComponent, CKEditorModule } from '@ckeditor/ckeditor5-angular';
// import Editor from '@ckeditor/ckeditor5-build-balloon-block';
import { Store } from '@ngrx/store';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
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
  Editor = Editor;

  @ViewChild('editor') editor!: CKEditorComponent<Editor>;

  @Input() id: string = '';
  @Input() data: string = '';

  editorConfig = {
    fontFamily: {
      options: [
        { title: 'Primary font', model: 'var(--primary-font-family), var(--alternative-font-family)' },
        { title: 'Secondary font', model: 'var(--secondary-font-family), var(--alternative-font-family)' },
      ],
      supportAllValues: true,
    },
  };

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
