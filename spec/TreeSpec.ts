/// <reference path="../tsd/jasmine.d.ts" />
/// <reference path="../tsd/jquery.d.ts" />
/// <reference path="../js/tree.ts" />

module JsTree {
  var node: JsTree.TreeNode;
  var parentNode: JsTree.TreeNode;
  var treeNodeView: JsTree.TreeNodeView;
  var parentViewContainer:JQuery;


  beforeEach(() => {
    node = {name: 'nodeName', showChildren: false, children: []};
    parentNode = {name: 'parentNodeName', showChildren: false, children: [
      {name: 'foo', showChildren: false, children: []},
      node,
      {name: 'bar', showChildren: false, children: []}
    ]};
    treeNodeView = new JsTree.TreeNodeView(node, parentNode);
    parentViewContainer = $('<ul></ul>');
    treeNodeView.render(parentViewContainer);
  });

  describe('Tree node view', () => {

    it(' renders itself to parent view container', () => {
      expect(parentViewContainer.find('.list-group-item').length).toBe(1);
      expect(parentViewContainer.find('.list-group-item .name').text()).toBe('nodeName');
    });

    it(' can toggle its children', () => {
      var childrenContainer = parentViewContainer.find('li > ul.children');
      expect(childrenContainer.hasClass('hidden')).toBe(true);
      expect(parentViewContainer.find('li > .toggle-children.glyphicon-plus').length).toBe(1);

      treeNodeView.toggleChildren();
      expect(childrenContainer.hasClass('hidden')).toBe(false);
      expect(parentViewContainer.find('li > .toggle-children.glyphicon-minus').length).toBe(1);

      treeNodeView.toggleChildren(true);
      expect(childrenContainer.hasClass('hidden')).toBe(false);
      expect(parentViewContainer.find('li > .toggle-children.glyphicon-minus').length).toBe(1);

      treeNodeView.toggleChildren(false);
      expect(childrenContainer.hasClass('hidden')).toBe(true);
      expect(parentViewContainer.find('li > .toggle-children.glyphicon-plus').length).toBe(1);

      treeNodeView.toggleChildren(false);
      expect(childrenContainer.hasClass('hidden')).toBe(true);
      expect(parentViewContainer.find('li > .toggle-children.glyphicon-plus').length).toBe(1);
    });

    it(' allows to delete itself from parent model and view', () => {
      expect(parentNode.children.length).toBe(3);
      treeNodeView.deleteNode();
      expect(parentNode.children.length).toBe(2);
      expect(parentNode.children.indexOf(node)).toBe(-1);
      expect(parentViewContainer.find('.list-group-item').length).toBe(0);
    });

    it(' allows editing node name', () => {
      expect(parentViewContainer.find(' > li').hasClass('edit-mode')).toBe(false);

      treeNodeView.editName();
      expect(parentViewContainer.find(' > li').hasClass('edit-mode')).toBe(true);
      expect(parentViewContainer.find(' > li > .name-input').val()).toBe('nodeName');
      parentViewContainer.find(' > li > .name-input').val('new name');

      treeNodeView.saveName();

      expect(parentViewContainer.find(' > li').hasClass('edit-mode')).toBe(false);
      expect(parentViewContainer.find('.list-group-item .name').text()).toBe('new name');
      expect(node.name).toBe('new name');
    });

    it(' allows adding child to any node', () => {
      expect(parentViewContainer.find('li > ul.children > li').length).toBe(0);
      treeNodeView.addChild();
      expect(parentViewContainer.find('li > ul.children > li').length).toBe(1);
      expect(node.showChildren).toBe(true);
      expect(parentViewContainer.find('li > ul.children > li').hasClass('edit-mode')).toBe(true);
    });
  });
}
