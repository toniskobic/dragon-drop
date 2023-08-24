/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../state/app.reducer';

@Injectable({
  providedIn: 'root',
})
export class ExportWebsiteService {
  constructor(private store: Store<AppState>) {}

  exportWebsite() {
    const canvas = document.getElementById('canvas') as HTMLDivElement;
    const { rules, variables } = this.traverseAndCollectCssRulesAndVars(canvas);
    const variableValues = this.getCssVariableValues(document.documentElement, variables);

    const canvasHtml = canvas.outerHTML;
    const css = [...rules].join('\n');

    console.log('variableValues', `:root {\n${variableValues.join('\n')}\n}`);
    console.log('html', canvasHtml);
    console.log('css', css);
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
