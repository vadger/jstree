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
      this.view.find('.edit-name').on('click', (e) => {self.editName();});
      this.view.find('.save-name').on('click', (e) => {self.saveName();});
      this.view.find('.add-child').on('click', (e) => {self.addChild()});

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
        .toggleClass('glyphicon-minus', this.node.showChildren)
        .toggleClass('invisible', this.node.children.length == 0);
      this.view.find('> .children').toggleClass('hidden', !this.node.showChildren);
    }

    deleteNode() {
      this.view.remove();
      var index = this.parentNode.children.indexOf(this.node);
      if (index != -1) this.parentNode.children.splice(index, 1);
    }

    editName() {
      this.view.addClass('edit-mode');
      this.nameInput.val(this.nameElement.text()).focus();
    }

    saveName() {
      this.view.removeClass('edit-mode');
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
  }
}
