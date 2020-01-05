import { cloneElement, createElement, isValidElement, ReactElement } from 'react';

export function renderTree(root: IGrag.INode): ReactElement {
  const { component, children } = root;
  if (isValidElement(component)) {
    return cloneElement(component, {}, children.map((node) => renderTree(node)));
  } else {
    return createElement(component, {}, children.map((node) => renderTree(node)));
  }
}
