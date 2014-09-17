/// <reference path="../tsd/jquery.d.ts" />
/// <reference path="TreeNode.ts" />
/// <reference path="RootTreeNodeView.ts" />
/// <reference path="TreeNodeView.ts" />
/// <reference path="TreeRenderer.ts" />

module JsTree {
  export class IterativeTreeRenderer implements TreeRenderer {

    private container:JQuery;

    constructor(container:JQuery) {
      this.container = container;
    }

    renderTree(rootNode:JsTree.TreeNode) {
      var nodeStack:Array<TreeNode> = [];
      var renderedViews:Array<TreeNodeView> = [];

      nodeStack.push(rootNode);

      while(nodeStack.length) {
        var node = nodeStack.pop();
        var view:TreeNodeView = renderedViews.length ? new TreeNodeView(node, this.getParentView(node, renderedViews)) : new RootTreeNodeView(node, this.container);
        view.render();
        renderedViews.push(view);

        for (var i = node.children.length - 1; i >= 0; i--) {
          nodeStack.push(node.children[i]);
        }
      }
    }

    private getParentView(node:TreeNode, renderedViews:Array<TreeNodeView>):TreeNodeView {
      for (var i = 0; i < renderedViews.length; i++) {
        var view = renderedViews[i];
        if (view.isParentOf(node)) return view;
      }
      throw new Error('Parent view should exist for node ' + JSON.stringify(node));
    }

  }
}