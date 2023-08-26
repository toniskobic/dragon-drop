export const GRIDSTER_BREAKPOINT = 641;

export const MOBILE_BREAKPOINT = 640;

export const ROWS_NUMBER_BREAKPOINT = 400;

export const COLUMNS_NUMBER = 10;

export const ROWS_NUMBER_LOWER = 4;

export const ROWS_NUMBER_UPPER = 10;

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
  'ck-widget__resizer',
];

export const ATTRIBUTES_TO_REMOVE = [
  'cdkdroplist',
  'cdkscrollable',
  'mwlresizable',
  'cdkdrag',
  'drddragcursor',
  'cdkdragboundary',
  'contenteditable',
  'data-cke-filler',
  'role',
];

export const CLASSES_TO_REMOVE = [
  'ng-star-inserted',
  'cdk-drop-list',
  'cdk-drag',
  'ck-widget_with-selection-handle',
  'ck-widget_selected',
  'ck-widget',
  'ck-table-resized',
  'ck-widget_with-resizer',
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
  <link rel="stylesheet" href="../public/css/styles.css">
  {fonts}

</head>

<body>
  {content}
  <script src="../public/javascript/index.js" defer></script>
</body>

</html>`;

export const JAVASCRIPT_TEMPLATE = `class ResponsiveUIManager {
  colNo = 10;
  rowsNoLower = 4;
  rowsNoUpper = 10;
  gridsterBreakpoint = 641;
  mobileBreakpoint = 640;
  rowsNumberBreakpoint = 400;
  sections = [];

  constructor() {
    this.init();
  }

  init() {
    this.addMenuButtonClickEventListeners();
    this.mobileNavManagement();
    this.menuButtonManagement();
    this.navLinksManagement();

    this.sections = [...document.getElementsByClassName("content")].map(
      (section) => {
        const contentWidth = section.clientWidth;
        const colWidth = contentWidth / this.colNo;
        const rowsNumber =
          section.clientHeight > this.rowsNumberBreakpoint
            ? this.rowsNoUpper
            : this.rowsNoLower;
        const rowsHeight = section.clientHeight / rowsNumber;
        const items = [...section.getElementsByClassName("section-element")];

        if (window.innerWidth < this.gridsterBreakpoint) {
          this.positionMobileSectionElements(items, contentWidth);
        } else {
          this.positionDesktopSectionElements(items, rowsHeight, colWidth);
        }

        return { domEl: section, contentWidth, colWidth, rowsHeight, items };
      }
    );
  }

  handleResize() {
    this.mobileNavManagement();
    this.menuButtonManagement();
    this.navLinksManagement();

    this.sections.forEach((el) => {
      if (el.domEl.clientWidth !== el.contentWidth) {
        el.contentWidth = el.domEl.clientWidth;
        el.colWidth = el.contentWidth / this.colNo;

        if (window.innerWidth < this.gridsterBreakpoint) {
          this.positionMobileSectionElements(el.items, el.contentWidth);
        } else {
          this.positionDesktopSectionElements(
            el.items,
            el.rowsHeight,
            el.colWidth
          );
        }
      }
    });
  }

  mobileNavManagement() {
    if (window.innerWidth > this.mobileBreakpoint) {
      const openNavs = [
        ...document.querySelectorAll(".nav-mobile:not(.nav-mobile-hidden)"),
      ];
      openNavs.forEach((nav) => {
        nav.classList.add("nav-mobile-hidden");
      });
    }
  }

  menuButtonManagement() {
    if (window.innerWidth > this.mobileBreakpoint) {
      const menuButtons = document.querySelectorAll(
        "nav.nav .menu-button-wrapper:not(.hidden)"
      );
      [...menuButtons].forEach((button) => {
        button.classList.add("hidden");
      });
    } else {
      const menuButtons = document.querySelectorAll(
        "nav.nav .menu-button-wrapper"
      );
      [...menuButtons].forEach((button) => {
        if (button.classList.contains("hidden"))
          button.classList.remove("hidden");
      });
    }
  }

  addMenuButtonClickEventListeners() {
    const headers = [...document.querySelectorAll("header.header")];
    headers.forEach((header) => {
      const menuButtons = [
        ...header.getElementsByClassName("menu-button-wrapper"),
      ];
      menuButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const mobileNav = header.getElementsByClassName("nav-mobile")[0];
          mobileNav.classList.contains("nav-mobile-hidden")
            ? mobileNav.classList.remove("nav-mobile-hidden")
            : mobileNav.classList.add("nav-mobile-hidden");
        });
      });
    });
  }

  navLinksManagement() {
    const navLinksContainers = [
      ...document.querySelectorAll(".nav-links-container"),
    ];
    if (window.innerWidth < this.mobileBreakpoint) {
      navLinksContainers.forEach((container) => {
        container.classList.add("hidden");
      });
    } else {
      navLinksContainers.forEach((container) => {
        if (container.classList.contains("hidden"))
          container.classList.remove("hidden");
      });
    }
  }

  positionDesktopSectionElements(items, rowsHeight, colWidth) {
    items.forEach((item) => {
      item.classList.remove("section-element-mobile");
      item.style.height = "";
      item.style.top = \`\${item.dataset.y * rowsHeight}px\`;
      item.style.left = \`\${item.dataset.x * colWidth}px\`;
      item.style.width = \`\${item.dataset.cols * colWidth}px\`;
    });
  }

  positionMobileSectionElements(items, contentWidth) {
    items.forEach((item) => {
      item.classList.add("section-element-mobile");
      item.style.top = "";
      item.style.left = "";
      item.style.width = "";
      item.style.height = \`\${
        (item.dataset.rows / item.dataset.cols) * contentWidth
      }px\`;
    });
  }
}

window.addEventListener("load", () => {
  const responsiveUiManager = new ResponsiveUIManager();

  window.addEventListener("resize", () => {
    responsiveUiManager.handleResize();
  });
});

`;

export const CSS_TEMPLATE = `*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  border: none;
}

body {
  margin: 0;
  height: 100vh;
}

img {
  display: block;
  max-width: 100%;
}

article ol,
article ul {
  list-style-position: inside;
}

a {
  text-underline-position: under;
}

@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}

:focus:not(:focus-visible) {
  outline: none;
}

label,
button,
select,
summary,
[type='radio'],
[type='submit'],
[type='checkbox'] {
  cursor: pointer;
}

html {
  font-size: 62.5%;
  -webkit-text-size-adjust: none;
  text-size-adjust: none;
  font-family: var(--primary-font-family), var(--alternative-font-family);
}

html * {
  font-size: 1.6rem;
  font-family: inherit;
}

.canvas {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.rectangle:not(:last-child) {
  flex-grow: 0;
}
.rectangle:last-child {
  flex-grow: 1;
}
.rectangle:last-child>* {
  height: 100%;
}

.header nav.nav ul li:hover {
  filter: invert(0.5);
}

.header nav.nav-mobile ul li:hover {
  filter: invert(0.5);
}

.header nav.nav .menu-button-wrapper:hover {
  filter: invert(0.5);
}

.header nav.nav-mobile .menu-button-wrapper:hover {
  filter: invert(0.5);
}

.footer nav ul li:hover {
  filter: invert(0.5);
}
`;

export const CSS_MOBILE_TEMPLATE = `@media only screen and (max-width: 640px) {
  .container {
    height: auto;
  }
}

@media only screen and (max-width: 640px) {
  .container .content {
    padding-block: 20px;
  }
}

.section-element {
  display: block;
  position: absolute;
  transition: all 0.3s ease 0s;
  padding-inline: 10px;
}

.section-element-mobile {
  position: relative;
  width: 100%;
}`;
