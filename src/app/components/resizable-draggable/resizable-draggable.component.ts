import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { ResizableDirective, ResizableModule, ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'drd-resizable-draggable',
  standalone: true,
  imports: [CommonModule, ResizableModule],
  templateUrl: './resizable-draggable.component.html',
  styleUrls: ['./resizable-draggable.component.scss'],
})
export class ResizableDraggableComponent implements AfterViewInit {
  @Input() title = 'Test';

  @ViewChild('resizableElement', { read: ResizableDirective }) resizable!: ResizableDirective;
  public style: object = {};

  ngAfterViewInit() {
    const resizable$ = this.resizable.resizing;
    resizable$.subscribe(event => {
      console.log(event);
      if (event.rectangle.height) {
        const height = this.roundUpNearest100(event.rectangle.height);
        this.style = {
          height: `${height <= 50 ? 50 : height}px`,
        };
      }
    });
  }

  onResizeEnd(event: ResizeEvent): void {
    if (event.rectangle.height) {
      const height = this.roundUpNearest100(event.rectangle.height);
      this.style = {
        height: `${height <= 50 ? 50 : height}px`,
      };
    }
  }

  roundUpNearest100(num: number) {
    return Math.round(num / 100) * 100;
  }
}
