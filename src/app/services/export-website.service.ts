/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { ELEMENTS_TO_REMOVE_BY_CLASS, REMOVE_AND_REPLACE_ELEMENTS_BY_TAG } from '../constants/constants';
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

  setIsExporting(isExporting: boolean) {
    this.store.dispatch(EditorActions.setIsExporting({ isExporting }));
  }

  exportWebsite() {
    this.setIsExporting(true);
    this.triggerChangeDetectSubject$.next();

    Promise.resolve()
      .then(() => {
        this.store.select(selectPages).subscribe(pages => {
          pages.forEach((page, index) => {
            const fileName = index === 0 ? 'index' : page.title.toLocaleLowerCase().replace(' ', '-');
            return this.pagesNames.set(page.title, fileName);
          });
        });

        const canvas = (document.getElementById('canvas') as HTMLElement).cloneNode(true) as HTMLElement;
        REMOVE_AND_REPLACE_ELEMENTS_BY_TAG.forEach(tagName => this.removeAndReplaceElement(canvas, tagName));
        ELEMENTS_TO_REMOVE_BY_CLASS.forEach(className => this.removeElement(canvas, className));
        this.replaceNavigationLinks(canvas);

        const { rules, variables } = this.traverseAndCollectCssRulesAndVars(canvas);
        const variableValues = this.getCssVariableValues(document.documentElement, variables);

        const canvasHtml = this.removeHtmlComments(canvas.outerHTML);
        const css = [...rules].join('\n');

        console.log('variableValues', `:root {\n${variableValues.join('\n')}\n}`);
        console.log('html', canvasHtml);
        console.log('css', css);
        this.setIsExporting(false);
      })
      .catch(e => console.log('Got ' + e));
  }

  replaceNavigationLinks(el: HTMLElement): void {
    const navLink = [...(el.getElementsByClassName('nav-links') as HTMLCollectionOf<HTMLAnchorElement>)];

    navLink.forEach(link => {
      const href = this.pagesNames.get(link.innerText);
      link.href = `/${href}.html`;
    });
  }

  removeAndReplaceElement(rootEl: HTMLElement, tagNameToRemove: string): void {
    const elements = rootEl.getElementsByTagName(tagNameToRemove);

    [...elements].forEach(el => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      el?.replaceWith(...el.childNodes);
    });
  }

  removeElement(rootEl: HTMLElement, classNameToRemove: string): void {
    const elements = rootEl.getElementsByClassName(classNameToRemove);

    [...elements].forEach(el => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      el.remove();
    });
  }

  removeHtmlComments(html: string): string {
    // eslint-disable-next-line no-useless-escape
    return html.replace(/<!--[\s\S]*?-->/g, '');
  }

  traverseAndCollectCssRulesAndVars(el: HTMLElement): { rules: Set<string>; variables: Set<string> } {
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

  getCssVariableValues(el: HTMLElement, variables: Set<string>): string[] {
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

  getCssRules(el: HTMLElement): Set<string> {
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

  extractCssVariablesFromRule(rule: string): Set<string> {
    const variablePattern = /var\((--[^,)]+)/g;
    const foundVariables = new Set<string>();
    let match;

    while ((match = variablePattern.exec(rule)) !== null) {
      foundVariables.add(match[1]); // match[1] contains the --variable-name
    }

    return foundVariables;
  }

  collectInlineCssVariables(el: HTMLElement): Set<string> {
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
}
