/// <reference path="../tsd/jquery.d.ts" />
module JsTree {

  export interface TreeNode {
    name: string;
    showChildren: boolean;
    children:Array<TreeNode>;
  }

  export class TreeNodeView {

    private viewBody:JQuery;

    private node:TreeNode;
    private parentNode:TreeNode;
    private nameElement:JQuery;
    private toggleChildrenElement:JQuery;
    private nameInput:JQuery;

    constructor(node:TreeNode, parentNode:TreeNode) {
      this.node = node;
      this.parentNode = parentNode;
    }

    render(container:JQuery):JQuery {
      var that = this;

      this.viewBody = $($(this.getTemplate()));
      this.viewBody.appendTo(container);

      this.nameElement = this.viewBody.find('.name');
      this.nameElement.text(this.node.name);
      this.toggleChildrenElement = this.viewBody.find('.toggle-children');
      this.nameInput = this.viewBody.find('.name-input');

      this.toggleChildrenElement.on('click', (e) => {that.toggleChildren()});
      this.toggleChildren(this.node.showChildren);
      this.viewBody.find('.delete-node').on('click', (e) => {that.deleteNode();});
      this.viewBody.find('.edit-name').on('click', (e) => {that.editName();});
      this.viewBody.find('.save-name').on('click', (e) => {that.saveName();});
      this.viewBody.find('.add-child').on('click', (e) => {that.addChild()});

      return this.getChildrenContainer();
    }

    private getChildrenContainer() {
      return this.viewBody.find('> ul.children');
    }

    getTemplate():string {
      return $('#node-template').contents().text();
    }

    toggleChildren(showChildren?:boolean) {
      this.node.showChildren = showChildren != null ? showChildren : !this.node.showChildren;
      this.toggleChildrenElement
        .toggleClass('glyphicon-plus', !this.node.showChildren)
        .toggleClass('glyphicon-minus', this.node.showChildren)
        .toggleClass('invisible', this.node.children.length == 0);
      this.viewBody.find('> .children').toggleClass('hidden', !this.node.showChildren);
    }

    deleteNode() {
      this.viewBody.remove();
      var index = this.parentNode.children.indexOf(this.node);
      if (index != -1) this.parentNode.children.splice(index, 1);
    }

    editName() {
      this.viewBody.addClass('edit-mode');
      this.nameInput.val(this.nameElement.text()).focus();
    }

    saveName() {
      this.viewBody.removeClass('edit-mode');
      this.nameElement.text(this.nameInput.val());
      this.node.name = this.nameInput.val();
    }

    addChild() {
      var newNode = {name: '', showChildren: false, children: []};
      this.node.children.push(newNode);
      var newView = new TreeNodeView(newNode, this.node);
      newView.render(this.getChildrenContainer());
      this.toggleChildren(true);
      newView.editName();
    }

    getViewBody() {return this.viewBody;}
  }

  export class RootTreeNodeView extends TreeNodeView {
    constructor(node:TreeNode) {
      super(node, null);
    }

    render(container:JQuery):JQuery {
      var that = this;
      var resultContainer = super.render(container);
      this.getViewBody().find('#add-child-to-root').click((e) => {that.addChild()});
      return  resultContainer;
    }

    getTemplate():string {
      return $('#root-node-template').contents().text();
    }
  }


  export interface TreeRenderer {
    renderTree(rootNode: TreeNode);
  }

  export class RecursiveTreeRenderer implements TreeRenderer {

    private container:JQuery;

    constructor(container:JQuery) {
      this.container = container;
    }

    renderTree(rootNode:JsTree.TreeNode) {
      this.renderNode(rootNode, null, this.container);
    }

    private renderNode(node: TreeNode, parent: TreeNode, parentContainer: JQuery) {
      var view:TreeNodeView = parent == null ? new RootTreeNodeView(node) : new TreeNodeView(node, parent);
      var childrenContainer = view.render(parentContainer);
      for (var i = 0; i < node.children.length; i++) {
        this.renderNode(node.children[i], node, childrenContainer);
      }
    }
  }
}
