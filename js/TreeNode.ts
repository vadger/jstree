module JsTree {
  export interface TreeNode {
    name: string;
    showChildren: boolean;
    children:Array<TreeNode>;
  }
}