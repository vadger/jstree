/// <reference path="../tsd/jasmine.d.ts" />
/// <reference path="../tsd/jquery.d.ts" />
/// <reference path="../js/tree.ts" />
var JsTree;
(function (JsTree) {
    var node;
    var parentNode;
    var treeNodeView;
    var parentViewContainer;

    beforeEach(function () {
        node = { name: 'nodeName', showChildren: false, children: [] };
        parentNode = {
            name: 'parentNodeName', showChildren: false, children: [
                { name: 'foo', showChildren: false, children: [] },
                node,
                { name: 'bar', showChildren: false, children: [] }
            ] };
        treeNodeView = new JsTree.TreeNodeView(node, parentNode);
        parentViewContainer = $('<ul></ul>');
        treeNodeView.render(parentViewContainer);
    });

    describe('Tree node view', function () {
        it(' renders itself to parent view container', function () {
            expect(parentViewContainer.find('.list-group-item').length).toBe(1);
            expect(parentViewContainer.find('.list-group-item .name').text()).toBe('nodeName');
        });

        it(' can toggle its children', function () {
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

        it(' allows to delete itself from parent model and view', function () {
            expect(parentNode.children.length).toBe(3);
            treeNodeView.deleteNode();
            expect(parentNode.children.length).toBe(2);
            expect(parentNode.children.indexOf(node)).toBe(-1);
            expect(parentViewContainer.find('.list-group-item').length).toBe(0);
        });
    });
})(JsTree || (JsTree = {}));
