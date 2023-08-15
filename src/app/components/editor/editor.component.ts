import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CKEditorComponent, CKEditorModule } from '@ckeditor/ckeditor5-angular';
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon-block';
import { Store } from '@ngrx/store';
import { debounceTime, map } from 'rxjs';
import { AppState } from 'src/app/state/app.reducer';
import { DesignCanvasActions } from 'src/app/state/design-canvas/design-canvas.actions';

@Component({
  selector: 'drd-editable-text',
  standalone: true,
  imports: [CommonModule, CKEditorModule],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  public Editor = BalloonEditor;

  @ViewChild('editor', { static: true }) editor!: CKEditorComponent<BalloonEditor>;

  @Input() id: string = '';
  @Input() data: string = '';

  @Output() dataChange = new EventEmitter<string>();

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.editor.editorInstance?.focus();
    this.editor.change
      .pipe(
        debounceTime(300),
        map(() => {
          this.store.dispatch(
            DesignCanvasActions.updateElement({ data: this.editor?.editorInstance?.getData() as string, id: this.id })
          );
        })
      )
      .subscribe();
  }

  onChange() {}
}
