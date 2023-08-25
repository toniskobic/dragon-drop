export const MIN_SECTION_DIMENSIONS_PX = 60;

export const ALTERNATIVE_FONT_FAMILIES = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy'];

export const USER_EXTERNAL_LINKS_IDS = ['primary-font', 'secondary-font'];

export const FAVICON_MAX_SIZE_BYTES = 1000000;

export const LOGO_MAX_SIZE_BYTES = 3000000;

export const FAVICON_FILE_TYPES = ['image/x-icon'];

export const LOGO_FILE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml'];

export const REMOVE_AND_REPLACE_ELEMENTS_BY_TAG = [
  'drd-resizable-draggable',
  'drd-rich-text-editor',
  'drd-header',
  'drd-section',
  'drd-footer',
  'gridster',
  'gridster-item',
  'ckeditor',
  'gridster-preview',
];

export const REMOVE_AND_REPLACE_ELEMENTS_BY_CLASS = ['ck-content'];

export const ELEMENTS_TO_REMOVE_BY_CLASS = [
  'gridster-item-resizable-handler',
  'gridster-column',
  'gridster-row',
  'ck-table-column-resizer',
  'ck-widget__selection-handle',
  'ck-fake-selection-container',
  'ck-widget__type-around',
];

export const ATTRIBUTES_TO_REMOVE = [
  'cdkdroplist',
  'cdkscrollable',
  'mwlresizable',
  'cdkdrag',
  'drddragcursor',
  'cdkdragboundary',
  'contenteditable',
];

export const CLASSES_TO_REMOVE = [
  'ng-star-inserted',
  'cdk-drop-list',
  'cdk-drag',
  'ck-widget_with-selection-handle',
  'ck-widget_selected',
  'ck-widget',
];

export const ATTRIBUTES_STARTING_WITH_TO_REMOVE = ['ng-reflect'];

export const ATTRIBUTES_STARTING_WITH_TO_REMOVE_DEV = ['_ngcontent'];

export const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta name="description" content="{description}"/>
  <link rel="icon" type="image/x-icon" href="../public/assets/favicon.ico">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&amp;display=swap"
    rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>

<body>
  {content}
  <script src="index.js" defer></script>
</body>

</html>`;

export const EXPORTED_JS_TEMPLATE = `window.addEventListener("load", () => {
  const colNo = 10;
  const rowsNoLower = 4;
  const rowsNoUpper = 10;

  const content = document.getElementsByClassName("content")[0];
  let contentWidth = content.clientWidth;
  let colWidth = contentWidth / colNo;

  const rowsNumber = content.clientHeight > 400 ? rowsNoUpper : rowsNoLower;

  const rowsHeight = content.clientHeight / rowsNumber;
  const items = [...content.getElementsByClassName("section-element")];

  positionSectionElements(items, rowsHeight, colWidth);

  window.addEventListener("resize", () => {
    if (content.clientWidth !== contentWidth) {
      contentWidth = content.clientWidth;
      colWidth = contentWidth / colNo;

      positionSectionElements(items, rowsHeight, colWidth);
    }
  });
});

positionSectionElements = (items, rowsHeight, colWidth) => {
  items.forEach((item) => {
    item.style.top = \`\${item.dataset.y * rowsHeight}px\`;
    item.style.left = \`$\{item.dataset.x * colWidth}px\`;
    item.style.width = \`\${item.dataset.cols * colWidth}px\`;
  });
};`;
