/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

import {
  ATTRIBUTES_STARTING_WITH_TO_REMOVE,
  ATTRIBUTES_STARTING_WITH_TO_REMOVE_DEV,
  ATTRIBUTES_TO_REMOVE,
  CLASSES_TO_REMOVE,
  ELEMENTS_TO_REMOVE_BY_CLASS,
  REMOVE_AND_REPLACE_ELEMENTS_BY_CLASS,
  REMOVE_AND_REPLACE_ELEMENTS_BY_TAG,
} from '../constants/constants';
import { Viewport } from '../models/viewport.enum';
import { AppState } from '../state/app.reducer';
import { selectPages } from '../state/design-canvas/design-canvas.reducer';
import { EditorActions } from '../state/editor/editor.actions';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class ExportWebsiteService {
  pagesNames: Map<string, string> = new Map<string, string>();
  pagesExported = 0;

  private triggerChangeDetectSubject$ = new Subject<void>();
  triggerChangeDetect$ = this.triggerChangeDetectSubject$.asObservable();

  constructor(
    private store: Store<AppState>,
    private utilsService: UtilsService
  ) {}

  exportWebsite() {
    this.setIsExporting(true);
    this.setViewportToDesktop();
    this.triggerChangeDetectSubject$.next();

    this.store.select(selectPages).subscribe(pages => {
      pages.forEach((page, index) => {
        const fileName = index === 0 ? 'index' : page.title.toLocaleLowerCase().replace(' ', '-');
        return this.pagesNames.set(page.title, fileName);
      });
    });

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

    const { rules, variables } = this.traverseAndCollectCssRulesAndVars(canvas);
    const variableValues = this.getCssVariableValues(document.documentElement, variables);

    const canvasHtml = this.removeHtmlComments(canvas.outerHTML);
    const css = [...rules].join('\n\n');

    console.log('variableValues', `:root {\n${variableValues.join('\n')}\n}`);
    console.log('html', canvasHtml);
    console.log('css', css);
    this.setIsExporting(false);
  }

  private replaceNavigationLinks(el: HTMLElement): void {
    const navLink = [...(el.getElementsByClassName('nav-links') as HTMLCollectionOf<HTMLAnchorElement>)];

    navLink.forEach(link => {
      const href = this.pagesNames.get(link.innerText);
      link.href = `/${href}.html`;
    });
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

  private getCssVariableValues(el: HTMLElement, variables: Set<string>): string[] {
    const computedStyles = window.getComputedStyle(el);
    const variableValues: string[] = [];

    variables.forEach(variableName => {
      const value = computedStyles.getPropertyValue(variableName);
      if (value) {
        variableValues.push(`${variableName}: ${value};`);
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
}
