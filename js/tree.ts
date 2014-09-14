/// <reference path="../tsd/jquery.d.ts" />
module JsTree {

  export interface TreeNode {
    name: string;
    showChildren: boolean;
    children:Array<TreeNode>;
  }

  export class TreeNodeView {

    private view:JQuery;

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
      var self = this;

      this.view = $($(this.getTemplate()));
      this.view.appendTo(container);

      this.nameElement = this.view.find('.name');
      this.nameElement.text(this.node.name);
      this.toggleChildrenElement = this.view.find('.toggle-children');
      this.nameInput = this.view.find('.name-input');

      this.toggleChildrenElement.on('click', (e) => {self.toggleChildren()});
      this.toggleChildren(this.node.showChildren);
      this.view.find('.delete-node').on('click', (e) => {self.deleteNode();});

      return this.getChildrenContainer();
    }

    private getChildrenContainer() {
      return this.view.find('> ul.children');
    }

    getTemplate():string {
      return $('#node-template').contents().text();
    }

    toggleChildren(showChildren?:boolean) {
      this.node.showChildren = showChildren != null ? showChildren : !this.node.showChildren;

      this.toggleChildrenElement
        .toggleClass('glyphicon-plus', !this.node.showChildren)
        .toggleClass('glyphicon-minus', this.node.showChildren);
      this.view.find('> .children').toggleClass('hidden', !this.node.showChildren);
    }

    deleteNode() {
      this.view.remove();
      var index = this.parentNode.children.indexOf(this.node);
      if (index != -1) this.parentNode.children.splice(index, 1);
    }
  }
}
