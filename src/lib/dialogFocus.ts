type FocusTarget = HTMLElement | SVGElement;

interface DialogLayer {
  root: HTMLElement;
  dialog: HTMLElement;
  restoreTarget: FocusTarget | null;
  lastFocus: FocusTarget | null;
  onEscape: () => void;
}

const layers: DialogLayer[] = [];
const inertElements = new Map<HTMLElement, string | null>();
let observer: MutationObserver | undefined;
let redirectingFocus = false;
let activeLayer: DialogLayer | undefined;

function isFocusTarget(element: EventTarget | null): element is FocusTarget {
  return element instanceof HTMLElement || element instanceof SVGElement;
}

function isAvailable(element: FocusTarget) {
  return (
    element.isConnected &&
    !element.closest('[inert], [hidden], [aria-hidden="true"]') &&
    !element.matches(":disabled") &&
    element.getClientRects().length > 0 &&
    getComputedStyle(element).visibility !== "hidden"
  );
}

function getTabStops(dialog: HTMLElement) {
  return Array.from(
    dialog.querySelectorAll<FocusTarget>(
      'a[href], button, input, select, textarea, summary, iframe, audio[controls], video[controls], [tabindex], [contenteditable="true"]',
    ),
  )
    .filter((element) => element.tabIndex >= 0 && isAvailable(element))
    .sort((a, b) => {
      const aOrder = a.tabIndex > 0 ? a.tabIndex : Infinity;
      const bOrder = b.tabIndex > 0 ? b.tabIndex : Infinity;
      return aOrder === bOrder ? 0 : aOrder - bOrder;
    });
}

function getTopLayer() {
  // Portals share z-index; DOM paint order, rather than effect order, decides the top layer.
  return layers
    .filter((layer) => layer.root.isConnected)
    .sort((a, b) => {
      return a.root.compareDocumentPosition(b.root) &
        Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1;
    })
    .at(-1);
}

function focusLayer(layer: DialogLayer, containerOnly = false) {
  const previous = layer.lastFocus;
  const target = containerOnly
    ? layer.dialog
    : previous && layer.dialog.contains(previous) && isAvailable(previous)
      ? previous
      : (getTabStops(layer.dialog)[0] ?? layer.dialog);
  redirectingFocus = true;
  try {
    target.focus({ preventScroll: true });
    layer.lastFocus = target;
  } finally {
    redirectingFocus = false;
  }
}

function restoreInert(element: HTMLElement, original: string | null) {
  if (original === null) element.removeAttribute("inert");
  else element.setAttribute("inert", original);
}

function updateBackground() {
  const top = getTopLayer();
  activeLayer = top;
  const blocked = new Set<HTMLElement>();
  if (top) {
    // Walk the portal's ancestor path so neither its wrapper nor body becomes inert.
    let current: HTMLElement = top.root;
    while (current.parentElement) {
      for (const sibling of current.parentElement.children) {
        if (sibling !== current && sibling instanceof HTMLElement)
          blocked.add(sibling);
      }
      if (current.parentElement === document.body) break;
      current = current.parentElement;
    }
  }
  for (const [element, original] of inertElements) {
    if (!blocked.has(element)) {
      restoreInert(element, original);
      inertElements.delete(element);
    }
  }
  for (const element of blocked) {
    if (!inertElements.has(element))
      inertElements.set(element, element.getAttribute("inert"));
    if (!element.inert) element.inert = true;
  }
}

function handleFocus(event: FocusEvent) {
  if (redirectingFocus) return;
  const top = getTopLayer();
  if (!top) return;
  if (isFocusTarget(event.target) && top.dialog.contains(event.target)) {
    top.lastFocus = event.target;
  } else {
    focusLayer(top);
  }
}

function handleKey(event: KeyboardEvent) {
  const top = getTopLayer();
  if (!top || event.defaultPrevented) return;
  if (event.key === "Escape") {
    event.preventDefault();
    event.stopImmediatePropagation();
    top.onEscape();
  } else if (event.key === "Tab") {
    const stops = getTabStops(top.dialog);
    event.preventDefault();
    const index = stops.indexOf(document.activeElement as FocusTarget);
    const next =
      index < 0
        ? event.shiftKey
          ? stops.length - 1
          : 0
        : (index + (event.shiftKey ? -1 : 1) + stops.length) % stops.length;
    const target = stops[next] ?? top.dialog;
    target.focus({ preventScroll: true });
  }
}

function handleMutation() {
  updateBackground();
  const top = getTopLayer();
  if (
    top &&
    (!isFocusTarget(document.activeElement) ||
      !top.dialog.contains(document.activeElement) ||
      !isAvailable(document.activeElement))
  ) {
    focusLayer(top);
  }
}

export function registerDialogFocus(
  root: HTMLElement,
  dialog: HTMLElement,
  onEscape: () => void,
  focusContainer: boolean,
) {
  const layer: DialogLayer = {
    root,
    dialog,
    onEscape,
    restoreTarget: isFocusTarget(document.activeElement)
      ? document.activeElement
      : null,
    lastFocus: null,
  };
  if (!layers.length) {
    document.addEventListener("keydown", handleKey);
    document.addEventListener("focusin", handleFocus, true);
    observer = new MutationObserver(handleMutation);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        "disabled",
        "hidden",
        "tabindex",
        "style",
        "class",
        "aria-hidden",
      ],
    });
  }
  layers.push(layer);
  updateBackground();
  if (getTopLayer() === layer) focusLayer(layer, focusContainer);

  return () => {
    const index = layers.indexOf(layer);
    if (index < 0) return;
    // An animated sheet's portal may already be detached when its effect cleans up.
    const wasTop = activeLayer === layer;
    layers.splice(index, 1);
    updateBackground();
    if (!layers.length) {
      observer?.disconnect();
      observer = undefined;
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("focusin", handleFocus, true);
    }
    if (!wasTop) return;
    const top = getTopLayer();
    const target = layer.restoreTarget;
    if (
      target &&
      isAvailable(target) &&
      (!top || top.dialog.contains(target))
    ) {
      target.focus({ preventScroll: true });
    } else if (top) {
      focusLayer(top);
    } else {
      // The opener can disappear after navigation. Leave no detached element focused.
      const previous = document.body.getAttribute("tabindex");
      document.body.tabIndex = -1;
      document.body.focus({ preventScroll: true });
      if (previous === null) document.body.removeAttribute("tabindex");
      else document.body.setAttribute("tabindex", previous);
    }
  };
}
