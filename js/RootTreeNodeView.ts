/// <reference path="../tsd/jquery.d.ts" />
/// <reference path="TreeNode.ts" />
/// <reference path="TreeNodeView.ts" />

module JsTree {
  export class RootTreeNodeView extends TreeNodeView {

    private parentContainer:JQuery;

    constructor(node:TreeNode, parentContainer: JQuery) {
      this.parentContainer = parentContainer;
      super(node, null);
    }

    initElements() {}

    bindActionHandlers() {
      var that = this;
      this.getViewBody().find('#add-child-to-root').click((e) => {that.addChild()});
    }

    getRenderToContainer():JQuery {return this.parentContainer;}

    getTemplate():string {
      return '<div id="root-node">' +
        '<button type="button" class="btn btn-primary btn-lg btn-block" id="add-child-to-root">Add child to root</button>' +
        '<ul class="list-group children"></ul>' +
        '</div>';
    }

    toggleChildren(showChildren?:boolean) {
      // do nothing, in root view children are always expanded
    }
  }
}