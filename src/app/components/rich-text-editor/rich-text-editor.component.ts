import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { CKEditorComponent, CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { Store } from '@ngrx/store';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { ExcludeFromExportDirective } from 'src/app/directives/exclude-from-export.directive';
import { ContextMenuType } from 'src/app/models/context-menu-type.enum';
import { ElementClassObserver } from 'src/app/models/element-class-observer.class';
import { AppState } from 'src/app/state/app.reducer';
import { DesignCanvasElementActions } from 'src/app/state/design-canvas/design-canvas.actions';

import { ContextMenuWrapperComponent } from '../../context-menus/context-menu-wrapper/context-menu-wrapper.component';

@Component({
  selector: 'drd-rich-text-editor',
  standalone: true,
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
  imports: [CommonModule, CKEditorModule, ContextMenuWrapperComponent, ExcludeFromExportDirective],
})
export class RichTextEditorComponent implements OnDestroy {
  Editor = Editor;

  @ViewChild('editor') editor!: CKEditorComponent<Editor>;
  @ViewChild(ContextMenuWrapperComponent) contextMenuComponent!: ContextMenuWrapperComponent;

  @Input() id: string = '';
  @Input() data: string = '';

  contextMenuType = ContextMenuType.Element;

  editorConfig = {
    fontFamily: {
      options: [
        { title: 'Primary font', model: 'var(--primary-font-family), var(--alternative-font-family)' },
        { title: 'Secondary font', model: 'var(--secondary-font-family), var(--alternative-font-family)' },
      ],
      supportAllValues: true,
    },
    fontSize: {
      options: ['default', 8, 12, 16, 18, 24, 30, 36, 42],
      supportAllValues: true,
    },
    fontColor: {
      colors: [
        {
          color: 'var(--primary-color)',
          label: 'Primary color',
        },
        {
          color: 'var(--secondary-color)',
          label: 'Secondary color',
        },
        {
          color: 'var(--tertiary-color)',
          label: 'Tertiary color',
        },
        {
          color: '#000000',
          label: 'Black',
        },
        {
          color: '#FFFFFF',
          label: 'White',
        },
      ],
      supportAllValues: true,
    },
  };

  changed = false;
  editorClassWatcher: ElementClassObserver | null = null;
  sectionResizeClassWatcher: ElementClassObserver | null = null;
  elementDragClassWatcher: ElementClassObserver | null = null;
  elementResizeClassWatcher: ElementClassObserver | null = null;

  constructor(private store: Store<AppState>) {}

  onChange() {
    this.changed = true;
    this.initClassWatchers();
  }

  onMouseDown(event: MouseEvent) {
    if (event.button === 2) {
      event.preventDefault();
    }
  }

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.contextMenuComponent.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuComponent.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenuComponent.matMenuTrigger.openMenu();
  }

  private initClassWatchers() {
    if (!this.editorClassWatcher) {
      const element = document.getElementsByClassName(
        'ck ck-balloon-panel ck-balloon-panel_toolbar_west ck-toolbar-container'
      )[0] as HTMLDivElement;
      this.editorClassWatcher = new ElementClassObserver(
        element,
        'ck-balloon-panel_visible',
        undefined,
        this.updateElement
      );
    }

    if (!this.sectionResizeClassWatcher) {
      const resizableSection = this.editor.editorInstance?.sourceElement?.closest('div.cdk-drag.rectangle');
      if (resizableSection) {
        this.sectionResizeClassWatcher = new ElementClassObserver(
          resizableSection,
          'resize-active',
          this.updateElement
        );
      }
    }

    if (!this.elementDragClassWatcher) {
      const draggableEl = this.editor.editorInstance?.sourceElement?.closest('gridster-item');
      if (draggableEl) {
        this.elementDragClassWatcher = new ElementClassObserver(
          draggableEl,
          'gridster-item-moving',
          this.updateElement
        );
      }
    }
    if (!this.elementResizeClassWatcher) {
      const resizableEl = this.editor.editorInstance?.sourceElement?.closest('gridster-item');
      if (resizableEl) {
        this.elementResizeClassWatcher = new ElementClassObserver(
          resizableEl,
          'gridster-item-resizing',
          this.updateElement
        );
      }
    }
  }

  private updateElement = () => {
    if (this.changed) {
      this.store.dispatch(
        DesignCanvasElementActions.updateElement({
          data: this.editor.editorInstance?.getData() as string,
          id: this.id,
        })
      );
      this.changed = false;
    }
  };

  ngOnDestroy() {
    if (this.editorClassWatcher) this.editorClassWatcher.disconnect();
    if (this.sectionResizeClassWatcher) this.sectionResizeClassWatcher.disconnect();
    if (this.elementDragClassWatcher) this.elementDragClassWatcher.disconnect();
    if (this.elementResizeClassWatcher) this.elementResizeClassWatcher.disconnect();
  }
}
