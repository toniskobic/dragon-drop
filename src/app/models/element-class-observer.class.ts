export class ElementClassObserver {
  private targetNode: Node;
  private classToObserve: string;
  private classAddedCallback?: () => void;
  private classRemovedCallback?: () => void;
  private observer: MutationObserver | null;
  private lastClassState: boolean;

  constructor(
    targetNode: Element,
    classToWatch: string,
    classAddedCallback?: () => void,
    classRemovedCallback?: () => void
  ) {
    this.targetNode = targetNode;
    this.classToObserve = classToWatch;
    this.classAddedCallback = classAddedCallback;
    this.classRemovedCallback = classRemovedCallback;
    this.observer = null;
    this.lastClassState = targetNode?.classList.contains(this.classToObserve);

    this.init();
  }

  private init(): void {
    this.observer = new MutationObserver(this.mutationCallback);
    this.observe();
  }

  public observe(): void {
    if (this.targetNode instanceof Node) this.observer!.observe(this.targetNode, { attributes: true });
  }

  public disconnect(): void {
    this.observer!.disconnect();
  }

  private mutationCallback = (mutationsList: MutationRecord[]): void => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const currentClassState = (mutation.target as Element).classList.contains(this.classToObserve);
        if (this.lastClassState !== currentClassState) {
          this.lastClassState = currentClassState;
          if (currentClassState) {
            if (this.classAddedCallback) this.classAddedCallback();
          } else {
            if (this.classRemovedCallback) this.classRemovedCallback();
          }
        }
      }
    }
  };
}
