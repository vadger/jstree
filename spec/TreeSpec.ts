/// <reference path="../tsd/jasmine.d.ts" />
/// <reference path="../tsd/jquery.d.ts" />
/// <reference path="../js/TreeNode.ts" />
/// <reference path="../js/TreeNodeView.ts" />
/// <reference path="../js/RootTreeNodeView.ts" />
/// <reference path="../js/TreeRenderer.ts" />
/// <reference path="../js/RecursiveTreeRenderer.ts" />
/// <reference path="../js/IterativeTreeRenderer.ts" />
/// <reference path="../js/MainView.ts" />

module JsTree {
  var node: TreeNode;
  var subChild:TreeNode;
  var parentNode: TreeNode;
  var treeNodeView: TreeNodeView;
  var parentViewContainer:JQuery;
  var treeNodeViewChildContainer:JQuery;
  var tree: TreeNode;


  beforeEach(() => {
    subChild = {name: 'bar', showChildren: false, children: []};
    node = {name: 'nodeName', showChildren: false, children: [subChild]};
    parentNode = {name: 'parentNodeName', showChildren: false, children: [
      {name: 'foo', showChildren: false, children: []},
      node,
      {name: 'bar', showChildren: false, children: []}
    ]};
    parentViewContainer = $('<ul></ul>');
    var rootTreeNodeView = new RootTreeNodeView(parentNode, parentViewContainer);
    rootTreeNodeView.getChildrenContainer = function() {return parentViewContainer};
    treeNodeView = new TreeNodeView(node, rootTreeNodeView);
    treeNodeViewChildContainer = treeNodeView.render();

    tree = {name: 'ROOT', showChildren: true, children: [
      {name: 'A', showChildren: false, children: [
        {name: 'B', showChildren: false, children:[]},
        {name: 'C', showChildren: false, children:[]}
      ]},
      {name: 'D', showChildren: false, children:[]}
    ]};
  });

  describe('Tree node view', () => {

    it(' renders itself to parent view container', () => {
      expect(parentViewContainer.find('.list-group-item').length).toBe(1);
      expect(parentViewContainer.find('.list-group-item .name').text()).toBe('nodeName');
    });

    it(' can toggle its children', () => {
      var childrenContainer = parentViewContainer.find('li > ul.children');
      expect(childrenContainer.hasClass('hidden')).toBe(true);
      var toggleChildrenControl = parentViewContainer.find('li > .toggle-children');
      expect(toggleChildrenControl.hasClass('glyphicon-plus')).toBe(true);

      toggleChildrenControl.click();

      expect(childrenContainer.hasClass('hidden')).toBe(false);
      expect(toggleChildrenControl.hasClass('glyphicon-minus')).toBe(true);

      treeNodeView.toggleChildren(true);
      expect(childrenContainer.hasClass('hidden')).toBe(false);
      expect(toggleChildrenControl.hasClass('glyphicon-minus')).toBe(true);

      treeNodeView.toggleChildren(false);
      expect(childrenContainer.hasClass('hidden')).toBe(true);
      expect(toggleChildrenControl.hasClass('glyphicon-plus')).toBe(true);

      treeNodeView.toggleChildren(false);
      expect(childrenContainer.hasClass('hidden')).toBe(true);
      expect(toggleChildrenControl.hasClass('glyphicon-plus')).toBe(true);
    });

    it(' without any child does not show children toggle options', () => {
      node.children = [];
      treeNodeView.toggleChildren(true);
      expect(parentViewContainer.find('li > .toggle-children').hasClass('invisible')).toBe(true);
    });

    it(' allows to delete itself from parent model and view', () => {
      expect(parentNode.children.length).toBe(3);
      treeNodeView.deleteNode();
      expect(parentNode.children.length).toBe(2);
      expect(parentNode.children.indexOf(node)).toBe(-1);
      expect(parentViewContainer.find('.list-group-item').length).toBe(0);
    });

    it(' hides children toggling option when last child is deleted', () => {
      var childTreeNodeView = new TreeNodeView(subChild, treeNodeView);
      childTreeNodeView.render();
      expect(parentViewContainer.find(' > li > .toggle-children').hasClass('invisible')).toBe(false);

      childTreeNodeView.deleteNode();

      expect(parentViewContainer.find(' > li > .toggle-children').hasClass('invisible')).toBe(true);
    });

    it(' allows editing node name', () => {
      expect(parentViewContainer.find(' > li').hasClass('edit-mode')).toBe(false);

      parentViewContainer.find('> li > .edit-name').click();

      expect(parentViewContainer.find(' > li').hasClass('edit-mode')).toBe(true);
      expect(parentViewContainer.find(' > li > .name-input').val()).toBe('nodeName');
      parentViewContainer.find(' > li > .name-input').val('new name');

      parentViewContainer.find('> li > .save-name').click();

      expect(parentViewContainer.find(' > li').hasClass('edit-mode')).toBe(false);
      expect(parentViewContainer.find('.list-group-item .name').text()).toBe('new name');
      expect(node.name).toBe('new name');
    });

    it(' allows adding child to any node', () => {
      expect(parentViewContainer.find('li > ul.children > li').length).toBe(0);

      parentViewContainer.find('> li > .add-child').click();

      expect(parentViewContainer.find('li > ul.children > li').length).toBe(1);
      expect(node.showChildren).toBe(true);
      expect(parentViewContainer.find('li > ul.children > li').hasClass('edit-mode')).toBe(true);
    });
  });

  function assertTree(mainContainer:JQuery) {
    expect(mainContainer.find('#root-node #add-child-to-root').length).toBe(1);
    expect(mainContainer.find('#root-node > ul.children').length).toBe(1);
    expect(mainContainer.find('#root-node > ul.children > li').length).toBe(2);

    expect(mainContainer.find('#root-node > ul.children > li').eq(0).find(' > .name').text()).toBe('A');
    expect(mainContainer.find('#root-node > ul.children > li').eq(1).find(' > .name').text()).toBe('D');

    expect(mainContainer.find('#root-node > ul.children > li').eq(0).find(' > ul.children > li').length).toBe(2);
    expect(mainContainer.find('#root-node > ul.children > li').eq(0).find(' > ul.children > li').eq(0).find('> .name').text()).toBe('B');
    expect(mainContainer.find('#root-node > ul.children > li').eq(0).find(' > ul.children > li').eq(1).find('> .name').text()).toBe('C');

    expect(mainContainer.find('#root-node > ul.children > li').eq(1).find(' > ul.children > li').length).toBe(0);
  }

  describe('Recursive tree renderer', () => {
    it('renders tree nodes recursively', () => {
      var mainContainer = $('<div id="main-container"></div>');
      var renderer = new RecursiveTreeRenderer(mainContainer);

      renderer.renderTree(tree);

      assertTree(mainContainer);
    });
  });

  describe('Iterative tree renderer', () => {
    it('renders tree nodes using own stack', () => {
      var mainContainer = $('<div id="main-container"></div>');
      var renderer = new IterativeTreeRenderer(mainContainer);

      renderer.renderTree(tree);
      assertTree(mainContainer);
    });
  });

  describe('Main view', () => {
    var mainContainer:JQuery;
    beforeEach(function() {
      mainContainer = $('<div id="main-container"></div>');
      localStorage.removeItem('jsTree');
    });

    it('reads tree structure from local storage', () => {
      localStorage.setItem('jsTree', JSON.stringify(tree));

      new MainView(mainContainer).renderTree();

      assertTree(mainContainer);
    });

    it('by clicking button "Save to local storage" save current tree state to local storage', function() {
      localStorage.setItem('jsTree', JSON.stringify(tree));

      var mainView = new MainView(mainContainer);
      mainView.renderTree();

      mainView.rootNode = {name: 'NEWROOT', showChildren: true, children: []};

      mainContainer.find('#save-to-local-storage').trigger('click');

      expect(localStorage.getItem('jsTree')).toBe('{"name":"NEWROOT","showChildren":true,"children":[]}');
    });
  });
}
