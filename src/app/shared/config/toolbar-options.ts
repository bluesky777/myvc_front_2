import { Toolbar } from 'ngx-editor';

export const toolbarDefaultOptions: Toolbar = [
  ['bold', 'italic', 'underline'],
  ['ordered_list', 'bullet_list'],
  [{ heading: ['h1', 'h2', 'h3'] }, 'link', 'horizontal_rule'],
  ['text_color', 'background_color'],
  ['align_left', 'align_center', 'align_right', 'align_justify'],
];
