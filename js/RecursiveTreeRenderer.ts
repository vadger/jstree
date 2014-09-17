/// <reference path="../tsd/jquery.d.ts" />
/// <reference path="TreeNode.ts" />
/// <reference path="RootTreeNodeView.ts" />
/// <reference path="TreeNodeView.ts" />
/// <reference path="TreeRenderer.ts" />

module JsTree {
  export class RecursiveTreeRenderer implements TreeRenderer {

    private container:JQuery;

    constructor(container:JQuery) {
      this.container = container;
    }

    renderTree(rootNode:JsTree.TreeNode) {
      this.renderNode(rootNode, null);
    }

    private renderNode(node: TreeNode, parentView: TreeNodeView) {
      var view:TreeNodeView = parentView == null ? new RootTreeNodeView(node, this.container) : new TreeNodeView(node, parentView);
      view.render();
      for (var i = 0; i < node.children.length; i++) {
        this.renderNode(node.children[i], view);
      }
    }
  }
}