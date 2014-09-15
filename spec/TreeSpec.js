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
        node = { name: 'nodeName', showChildren: false, children: [{ name: 'bar', showChildren: false, children: [] }] };
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

        it(' without any child does not show children toggle options', function () {
            node.children = [];
            treeNodeView.toggleChildren(true);
            expect(parentViewContainer.find('li > .toggle-children').hasClass('invisible')).toBe(true);
        });

        it(' allows to delete itself from parent model and view', function () {
            expect(parentNode.children.length).toBe(3);
            treeNodeView.deleteNode();
            expect(parentNode.children.length).toBe(2);
            expect(parentNode.children.indexOf(node)).toBe(-1);
            expect(parentViewContainer.find('.list-group-item').length).toBe(0);
        });

        it(' allows editing node name', function () {
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

        it(' allows adding child to any node', function () {
            expect(parentViewContainer.find('li > ul.children > li').length).toBe(0);
            treeNodeView.addChild();
            expect(parentViewContainer.find('li > ul.children > li').length).toBe(1);
            expect(node.showChildren).toBe(true);
            expect(parentViewContainer.find('li > ul.children > li').hasClass('edit-mode')).toBe(true);
        });
    });

    describe('Recursive tree renderer', function () {
        it('renders tree nodes recursively', function () {
            var mainContainer = $('<div id="main-container"></div>');
            var tree = {
                name: 'ROOT', showChildren: true, children: [
                    {
                        name: 'A', showChildren: false, children: [
                            { name: 'B', showChildren: false, children: [] },
                            { name: 'C', showChildren: false, children: [] }
                        ] },
                    { name: 'D', showChildren: false, children: [] }
                ] };
            var renderer = new JsTree.RecursiveTreeRenderer(mainContainer);

            renderer.renderTree(tree);
            console.log(mainContainer.html());
            expect(mainContainer.find('#root-node #add-child-to-root').length).toBe(1);
            expect(mainContainer.find('#root-node > ul.children').length).toBe(1);
            expect(mainContainer.find('#root-node > ul.children > li').length).toBe(2);

            expect(mainContainer.find('#root-node > ul.children > li').eq(0).find(' > .name').text()).toBe('A');
            expect(mainContainer.find('#root-node > ul.children > li').eq(1).find(' > .name').text()).toBe('D');

            expect(mainContainer.find('#root-node > ul.children > li').eq(0).find(' > ul.children > li').length).toBe(2);
            expect(mainContainer.find('#root-node > ul.children > li').eq(0).find(' > ul.children > li').eq(0).find('> .name').text()).toBe('B');
            expect(mainContainer.find('#root-node > ul.children > li').eq(0).find(' > ul.children > li').eq(1).find('> .name').text()).toBe('C');

            expect(mainContainer.find('#root-node > ul.children > li').eq(1).find(' > ul.children > li').length).toBe(0);
        });
    });
})(JsTree || (JsTree = {}));
