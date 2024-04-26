/**
 * This action triggers a custom event on node entering/exiting the viewport.
 * example:
 * <p
 *  use:inView
 *  on:enter={() => console.log("enter")}
 *  on:exit={() => console.log("exit")}
 * >
 *
 * optional params { root, top, bottom }
 * top and bottom are numbers
 * use:inView={ bottom: 100 } // 100 pixels from bottom of viewport
 */

/**
 * Creates an IntersectionObserver that triggers a custom event
 * on a node entering or exiting the viewport.
 *
 * @param node The node to observe.
 * @param params Optional parameters for the observer.
 * @param params.root The root element to use for the observer.
 * @param params.top The number of pixels from the top of the viewport.
 * @param params.bottom The number of pixels from the bottom of the viewport.
 * @returns An object with two methods: update and destroy.
 */
export default function inView(
  node: HTMLElement,
  params: { root?: HTMLElement; top?: number; bottom?: number } = {}
): {
  update(params: { root?: HTMLElement; top?: number; bottom?: number }): void;
  destroy(): void;
} {
  let observer: IntersectionObserver | undefined;

  const handleIntersect = (e: IntersectionObserverEntry[]): void => {
    const v = e[0].isIntersecting ? 'enter' : 'exit';
    node.dispatchEvent(new CustomEvent(v));
  };

  const setObserver = ({
    root,
    top,
    bottom,
  }: {
    root?: HTMLElement;
    top?: number;
    bottom?: number;
  }): void => {
    const marginTop = top ? top * -1 : 0;
    const marginBottom = bottom ? bottom * -1 : 0;
    const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;
    const options = { root, rootMargin };
    if (observer) observer.disconnect();
    observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(node);
  };

  setObserver(params);

  return {
    /**
     * Updates the parameters of the IntersectionObserver.
     *
     * @param params The new parameters for the observer.
     * @param params.root The new root element to use for the observer.
     * @param params.top The new number of pixels from the top of the viewport.
     * @param params.bottom The new number of pixels from the bottom of the viewport.
     */
    update(params: { root?: HTMLElement; top?: number; bottom?: number }): void {
      setObserver(params);
    },

    /**
     * Destroys the IntersectionObserver.
     */
    destroy(): void {
      if (observer) observer.disconnect();
    },
  };
}
