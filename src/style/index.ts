import base from './base.css?style';
import unoStyle from 'unocss-inline/style';

export const attachStyle = (node: ParentNode) => {
  node.append(base.cloneNode(true), unoStyle.cloneNode(true));
};
