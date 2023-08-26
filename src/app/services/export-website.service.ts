/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import { firstValueFrom, Subject, Subscription, take } from 'rxjs';
import { environment } from 'src/environments/environment';

import {
  ATTRIBUTES_STARTING_WITH_TO_REMOVE,
  ATTRIBUTES_STARTING_WITH_TO_REMOVE_DEV,
  ATTRIBUTES_TO_REMOVE,
  CLASSES_TO_REMOVE,
  COLUMNS_NUMBER,
  CSS_MOBILE_TEMPLATE,
  CSS_TEMPLATE,
  ELEMENTS_TO_REMOVE_BY_CLASS,
  GRIDSTER_BREAKPOINT,
  HTML_TEMPLATE,
  JAVASCRIPT_TEMPLATE,
  MOBILE_BREAKPOINT,
  REMOVE_AND_REPLACE_ELEMENTS_BY_CLASS,
  REMOVE_AND_REPLACE_ELEMENTS_BY_TAG,
  ROWS_NUMBER_BREAKPOINT,
  ROWS_NUMBER_LOWER,
  ROWS_NUMBER_UPPER,
} from '../constants/constants';
import { Page } from '../models/page.model';
import { Viewport } from '../models/viewport.enum';
import { AppState } from '../state/app.reducer';
import { DesignCanvasPageActions } from '../state/design-canvas/design-canvas.actions';
import { selectPages } from '../state/design-canvas/design-canvas.reducer';
import { EditorActions } from '../state/editor/editor.actions';
import { selectFavicon, selectLogo, selectWebsiteTitle } from '../state/global-settings/global-settings.reducer';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class ExportWebsiteService {
  pagesNames: Map<string, string> = new Map<string, string>();
  pages: Page[] = [];
  pagesExported = 0;
  websiteTitle = '';
  cssRules: Set<string> = new Set<string>();
  cssVariables: { [key: string]: string } = {};
  favicon?: File | null = null;
  logo?: File | null = null;
  zip?: JSZip | null = null;
  pagesFolder?: JSZip | null = null;
  publicFolder?: JSZip | null = null;
  cssFolder?: JSZip | null = null;
  jsFolder?: JSZip | null = null;
  assetsFolder?: JSZip | null = null;

  private triggerChangeDetectSubject$ = new Subject<void>();
  triggerChangeDetect$ = this.triggerChangeDetectSubject$.asObservable();

  subscriptions: Subscription[] = [];

  constructor(
    private store: Store<AppState>,
    private utilsService: UtilsService,
    private http: HttpClient
  ) {}

  initWebsiteExport() {
    this.subscriptions.push(
      this.store
        .select(selectPages)
        .pipe(take(1))
        .subscribe(pages => {
          this.pages = pages;
          pages.forEach((page, index) => {
            const fileName = index === 0 ? 'index' : page.title.toLocaleLowerCase().replace(' ', '-');
            return this.pagesNames.set(page.title, fileName);
          });
        })
    );

    this.subscriptions.push(
      this.store
        .select(selectFavicon)
        .pipe(take(1))
        .subscribe(favicon => {
          this.favicon = favicon;
        })
    );

    this.subscriptions.push(
      this.store
        .select(selectLogo)
        .pipe(take(1))
        .subscribe(logo => {
          this.logo = logo;
        })
    );

    this.subscriptions.push(
      this.store
        .select(selectWebsiteTitle)
        .pipe(take(1))
        .subscribe(title => {
          this.websiteTitle = title;
        })
    );

    if (!this.pages.length) return;

    this.zip = new JSZip();
    this.pagesFolder = this.zip.folder('pages');
    this.publicFolder = this.zip.folder('public');
    this.cssFolder = this.publicFolder?.folder('css');
    this.jsFolder = this.publicFolder?.folder('javascript');
    this.assetsFolder = this.publicFolder?.folder('assets');

    this.setCurrentPage(this.pages[this.pagesExported].id);
    this.setIsExporting(true);
    this.setViewportToDesktop();
    this.closeSidebar();
    this.triggerChangeDetectSubject$.next();
  }

  async continueExport() {
    this.exportPage();
    this.pagesExported++;

    if (this.pagesExported < this.pages.length) {
      this.setCurrentPage(this.pages[this.pagesExported].id);
      this.triggerChangeDetectSubject$.next();
      return;
    }

    this.exportCss();
    this.exportJs();
    await this.exportAssets();
    await this.exportFolder();

    this.resetToDefault();
    this.closeSidebar();
    this.setIsExporting(false);
  }

  private resetToDefault() {
    this.pagesNames = new Map<string, string>();
    this.pages = [];
    this.pagesExported = 0;
    this.websiteTitle = '';
    this.cssRules = new Set<string>();
    this.cssVariables = {};
    this.favicon = null;
    this.logo = null;
    this.zip = null;
    this.pagesFolder = null;
    this.publicFolder = null;
    this.cssFolder = null;
    this.jsFolder = null;
    this.assetsFolder = null;
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }

  private exportPage() {
    const canvas = (document.getElementById('canvas') as HTMLElement).cloneNode(true) as HTMLElement;

    REMOVE_AND_REPLACE_ELEMENTS_BY_TAG.forEach(tagName => this.removeAndReplaceElement(canvas, tagName));
    REMOVE_AND_REPLACE_ELEMENTS_BY_CLASS.forEach(className => this.removeAndReplaceElement(canvas, className, true));
    ELEMENTS_TO_REMOVE_BY_CLASS.forEach(className => this.removeElement(canvas, className));

    ATTRIBUTES_TO_REMOVE.forEach(attribute => this.removeAttrOrClass(canvas, attribute));
    CLASSES_TO_REMOVE.forEach(className => this.removeAttrOrClass(canvas, className, true));
    ATTRIBUTES_STARTING_WITH_TO_REMOVE.forEach(attribute => this.removeAttributesStartingWith(canvas, attribute));
    if (!environment.production) {
      ATTRIBUTES_STARTING_WITH_TO_REMOVE_DEV.forEach(attribute => this.removeAttributesStartingWith(canvas, attribute));
    }

    this.replaceNavigationLinks(canvas);
    this.insertLogoSrc(canvas);

    const { rules, variables } = this.traverseAndCollectCssRulesAndVars(canvas);
    const variableValues = this.getCssVariableValues(document.documentElement, variables);

    rules.forEach(rule => this.cssRules.add(rule));
    this.cssVariables = { ...this.cssVariables, ...variableValues };

    const canvasHtml = this.removeHtmlComments(canvas.outerHTML);
    let html = HTML_TEMPLATE;
    html = this.utilsService.formatString(html, {
      title: `${this.pages[this.pagesExported].title} | ${this.websiteTitle}`,
      description: this.pages[this.pagesExported].title,
      content: canvasHtml,
      fonts: this.getFontFamilyStyles(),
    });

    this.pagesFolder?.file(`${this.pagesNames.get(this.pages[this.pagesExported].title)}.html`, html);
  }

  private exportCss() {
    const cssVariables: string[] = [];
    Object.entries(this.cssVariables).forEach(([key, value]) => {
      cssVariables.push(`${key}: ${value};`);
    });
    let css = `:root {\n${cssVariables.join('\n')}\n}\n`;
    css += `\n${CSS_TEMPLATE}\n\n`;
    css += [...this.cssRules].join('\n\n');
    css += `\n\n${CSS_MOBILE_TEMPLATE}\n`;

    this.cssFolder?.file('styles.css', css);
  }

  private exportJs() {
    let js = JAVASCRIPT_TEMPLATE;
    js = this.utilsService.formatString(js, {
      colNo: COLUMNS_NUMBER.toString(),
      rowsNoUpper: ROWS_NUMBER_UPPER.toString(),
      rowsNoLower: ROWS_NUMBER_LOWER.toString(),
      gridsterBreakpoint: GRIDSTER_BREAKPOINT.toString(),
      mobileBreakpoint: MOBILE_BREAKPOINT.toString(),
      rowsNumberBreakpoint: ROWS_NUMBER_BREAKPOINT.toString(),
    });

    this.jsFolder?.file('index.js', js);
  }

  private async exportAssets() {
    if (this.favicon) {
      this.assetsFolder?.file('favicon.ico', this.favicon);
    } else {
      const faviconBlob = await firstValueFrom(this.http.get('assets/icons/favicon.ico', { responseType: 'blob' }));
      this.assetsFolder?.file('favicon.ico', faviconBlob);
    }

    if (this.logo) {
      const lastIndex = this.logo.name.lastIndexOf('.');
      const fileExtension = lastIndex !== -1 ? this.logo.name.substring(lastIndex + 1) : '';
      this.assetsFolder?.file(`logo.${fileExtension}`, this.logo);
    }
  }

  private async exportFolder() {
    const zipFolder = await this.zip?.generateAsync({ type: 'blob' });
    if (zipFolder)
      saveAs(
        zipFolder,
        `${this.websiteTitle ? this.websiteTitle.toLocaleLowerCase().replace(' ', '-') : 'website'}.zip`
      );
  }

  private replaceNavigationLinks(el: HTMLElement): void {
    const navLink = [...(el.getElementsByClassName('nav-links') as HTMLCollectionOf<HTMLAnchorElement>)];

    navLink.forEach(link => {
      const href = this.pagesNames.get(link.innerText);
      link.href = `${href}.html`;
    });
  }

  private insertLogoSrc(el: HTMLElement): void {
    if (this.logo) {
      const logos = [...(el.querySelectorAll('.logo-wrapper .logo') as unknown as HTMLImageElement[])];

      logos.forEach(logo => {
        const lastIndex = this.logo?.name.lastIndexOf('.');
        const fileExtension = lastIndex && lastIndex !== -1 ? this.logo?.name.substring(lastIndex + 1) : '';
        const src = `../public/assets/logo.${fileExtension}`;
        logo.src = src;
      });
    }
  }

  private removeAndReplaceElement(rootEl: HTMLElement, qualifiedName: string, isClass: boolean = false): void {
    const selector = isClass ? `.${qualifiedName}` : qualifiedName;
    const elements = rootEl.querySelectorAll(selector);

    [...elements].forEach(el => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      el?.replaceWith(...el.childNodes);
    });
  }

  private removeAttrOrClass(rootEl: HTMLElement, qualifiedName: string, isClass: boolean = false) {
    const selector = isClass ? `.${qualifiedName}` : `[${qualifiedName}]`;

    if (isClass) {
      if (rootEl.classList.contains(qualifiedName)) {
        rootEl.classList.remove(qualifiedName);
      }
    } else if (rootEl.hasAttribute(qualifiedName)) {
      rootEl.removeAttribute(qualifiedName);
    }

    const elements = rootEl.querySelectorAll(selector);
    elements.forEach((element: Element) => {
      isClass ? element.classList.remove(qualifiedName) : element.removeAttribute(qualifiedName);
    });
  }

  private removeAttributesStartingWith(rootEl: HTMLElement, prefix: string) {
    [...rootEl.attributes].forEach(attr => {
      if (attr.name.startsWith(prefix)) {
        rootEl.removeAttribute(attr.name);
      }
    });

    const elements = rootEl.querySelectorAll('*'); // Selects all elements
    elements.forEach((element: Element) => {
      // Get all attribute names for the element
      const attributeNames = [...element.attributes].map(attr => attr.name);

      // Find attribute names that start with the prefix and remove them
      attributeNames.forEach(name => {
        if (name.startsWith(prefix)) {
          element.removeAttribute(name);
        }
      });
    });
  }

  private removeClass(rootEl: HTMLElement, className: string) {
    if (rootEl.classList.contains(className)) {
      rootEl.classList.remove(className);
    }

    const elements = rootEl.querySelectorAll(`.${className}]`);
    elements.forEach((element: Element) => {
      element.classList.remove(className);
    });
  }

  private removeElement(rootEl: HTMLElement, classNameToRemove: string): void {
    const elements = rootEl.getElementsByClassName(classNameToRemove);

    [...elements].forEach(el => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      el.remove();
    });
  }

  private removeHtmlComments(html: string): string {
    // eslint-disable-next-line no-useless-escape
    return html.replace(/<!--[\s\S]*?-->/g, '');
  }

  private traverseAndCollectCssRulesAndVars(el: HTMLElement): { rules: Set<string>; variables: Set<string> } {
    const cssRules = this.getCssRules(el);
    const cssVariables = new Set<string>();

    const inlineVars = this.collectInlineCssVariables(el);
    inlineVars.forEach(variable => cssVariables.add(variable));

    // Extract variables from the retrieved rules
    cssRules.forEach(rule => {
      const varsFromRule = this.extractCssVariablesFromRule(rule);
      varsFromRule.forEach(variable => cssVariables.add(variable));
    });

    const children = el.children;

    for (let i = 0; i < children.length; i++) {
      const { rules: childRules, variables: childVars } = this.traverseAndCollectCssRulesAndVars(
        children[i] as HTMLElement
      );

      childRules.forEach(rule => cssRules.add(rule));
      childVars.forEach(variable => cssVariables.add(variable));
    }

    return {
      rules: cssRules,
      variables: cssVariables,
    };
  }
  private getCssVariableValues(el: HTMLElement, variables: Set<string>): { [key: string]: string } {
    const computedStyles = window.getComputedStyle(el);
    const variableValues: { [key: string]: string } = {};

    variables.forEach(variableName => {
      const value = computedStyles.getPropertyValue(variableName);
      if (value) {
        variableValues[variableName] = value.trim(); // Adding trim() to remove any extra whitespace
      }
    });

    return variableValues;
  }

  private getCssRules(el: HTMLElement): Set<string> {
    const sheets = document.styleSheets;
    const ret = new Set<string>();
    el.matches =
      el.matches ||
      el.webkitMatchesSelector ||
      (el as any).mozMatchesSelector ||
      (el as any).msMatchesSelector ||
      (el as any).oMatchesSelector;
    for (const i in sheets) {
      if (!sheets[i].href || sheets[i].href?.includes(window.location.host)) {
        const rules = sheets[i]?.rules || sheets[i]?.cssRules;
        for (const r in rules) {
          const rule = rules[r];
          if (rule instanceof CSSStyleRule && el.matches(rule.selectorText)) {
            ret.add(rule.cssText);
          }
        }
      }
    }
    return ret;
  }

  private extractCssVariablesFromRule(rule: string): Set<string> {
    const variablePattern = /var\((--[^,)]+)/g;
    const foundVariables = new Set<string>();
    let match;

    while ((match = variablePattern.exec(rule)) !== null) {
      foundVariables.add(match[1]); // match[1] contains the --variable-name
    }

    return foundVariables;
  }

  private collectInlineCssVariables(el: HTMLElement): Set<string> {
    const inlineVariables = new Set<string>();
    if (el.style) {
      for (let i = 0; i < el.style.length; i++) {
        const propertyName = el.style[i];
        const propertyValue = el.style.getPropertyValue(propertyName);

        if (propertyValue.startsWith('var')) {
          const startIndex = propertyValue.indexOf('-');
          const endIndex = propertyValue.indexOf(')');
          inlineVariables.add(propertyValue.substring(startIndex, endIndex));
        }
      }
    }
    return inlineVariables;
  }

  private setIsExporting(isExporting: boolean) {
    this.store.dispatch(EditorActions.setIsExporting({ isExporting }));
  }

  private setViewportToDesktop() {
    this.store.dispatch(EditorActions.setViewport({ viewport: Viewport.Desktop }));
  }

  private closeSidebar() {
    this.store.dispatch(EditorActions.setSidebarOpened({ opened: false }));
  }

  private setCurrentPage(pageId: string) {
    this.store.dispatch(DesignCanvasPageActions.setCurrentPage({ pageId }));
  }

  private getFontFamilyStyles() {
    let html = '';
    let link = document.getElementById(`primary-font`) as HTMLLinkElement | null;
    if (link) {
      html += link.outerHTML;
      html += '\n';
    }
    link = document.getElementById(`secondary-font`) as HTMLLinkElement | null;
    if (link) {
      html += link.outerHTML;
    }
    return html;
  }
}
