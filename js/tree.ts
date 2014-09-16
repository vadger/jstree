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
    private parentView:TreeNodeView;
    private nameElement:JQuery;
    private toggleChildrenElement:JQuery;
    private nameInput:JQuery;

    constructor(node:TreeNode, parentView: TreeNodeView) {
      this.node = node;
      this.parentView = parentView;
      this.viewBody = $($(this.getTemplate()));
      this.initElements()
      this.bindActionHandlers();
    }

    initElements() {
      this.nameElement = this.viewBody.find('.name');

      this.nameElement.text(this.node.name);
      this.toggleChildrenElement = this.viewBody.find('.toggle-children');
      this.nameInput = this.viewBody.find('.name-input');
      this.toggleChildren(this.node.showChildren);
    }

    bindActionHandlers() {
      var that = this;

      this.toggleChildrenElement.on('click', (e) => {that.toggleChildren()});
      this.viewBody.find('.delete-node').on('click', (e) => {that.deleteNode();});
      this.viewBody.find('.edit-name').on('click', (e) => {that.editName();});
      this.viewBody.find('.save-name').on('click', (e) => {that.saveName();});
      this.viewBody.find('.add-child').on('click', (e) => {that.addChild();});
    }

    render():JQuery {
      this.viewBody.appendTo(this.getRenderToContainer());
      return this.getChildrenContainer();
    }

    getRenderToContainer():JQuery {
      return this.parentView.getChildrenContainer();
    }

    getChildrenContainer():JQuery { return this.viewBody.find('> ul.children');}

    getTemplate():string {
      return '<li class="list-group-item">' +
                '<span class="glyphicon toggle-children"></span>' +
                '<span class="edit-mode-hidden name"></span>' +
                '<input type="text" class="edit-mode-visible name-input">' +
                '<span class="glyphicon glyphicon-trash edit-mode-hidden delete-node"></span>' +
                '<span class="glyphicon glyphicon-pencil edit-mode-hidden edit-name"></span>' +
                '<span class="glyphicon glyphicon-plus-sign edit-mode-hidden add-child"></span>' +
                '<span class="glyphicon glyphicon-ok edit-mode-visible save-name"></span>' +
                '<ul class="list-group children hidden"></ul>' +
              '</li>';
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
      this.parentView.deleteNodeFromParentModel(this.node);
    }

    deleteNodeFromParentModel(treeNode: TreeNode) {
      var index = this.node.children.indexOf(treeNode);
      if (index != -1) this.node.children.splice(index, 1);
      this.toggleChildren(true);
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
      var newView = new TreeNodeView(newNode, this);
      newView.render();
      this.toggleChildren(true);
      newView.editName();
    }

    getViewBody() {return this.viewBody;}
  }

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


  export interface TreeRenderer {
    renderTree(rootNode: TreeNode);
  }

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

  export class MainView {
    private rootNode:TreeNode = {name: '', showChildren: true, children: []};

    private container:JQuery;

    constructor(container:JQuery) {
      this.container = container;
    }

    renderTree(rootNode: TreeNode) {
      if (rootNode != null) this.rootNode = rootNode;
      new RecursiveTreeRenderer(this.container.html('')).renderTree(this.rootNode);
    }
  }
}
