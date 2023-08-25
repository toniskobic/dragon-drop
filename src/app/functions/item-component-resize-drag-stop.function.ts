// eslint-disable-next-line import/no-unresolved
import { GridsterResizable } from 'angular-gridster2/lib/gridsterResizable.service';

export function dragStop(this: GridsterResizable, e: MouseEvent) {
  e.stopPropagation();
  e.preventDefault();
  this.mousemove();
  this.mouseup();
  this.mouseleave();
  this.cancelOnBlur();
  this.touchmove();
  this.touchend();
  this.touchcancel();
  this.gridster.dragInProgress = false;
  this.gridster.updateGrid();
  if (this.gridster.options.resizable && this.gridster.options.resizable.stop) {
    Promise.resolve(this.gridster.options.resizable.stop(this.gridsterItem.item, this.gridsterItem, e)).then(
      this.makeResize,
      this.cancelResize
    );
  } else {
    this.makeResize();
  }
  setTimeout(() => {
    this.gridsterItem?.renderer?.removeClass(this.gridsterItem.el, 'gridster-item-resizing');
    if (this.gridster) {
      this.gridster.movingItem = null;
      this.gridster.previewStyle();
    }
  });
}
