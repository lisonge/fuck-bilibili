import tailwind from './tailwind.css?style';
import base from './base.css?style';

export const attachStyle = (node: ParentNode) => {
  node.append(base, tailwind);
};
