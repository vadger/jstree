/// <reference path="../tsd/jquery.d.ts" />
/// <reference path="TreeNode.ts" />
var JsTree;
(function (JsTree) {
    var TreeNodeView = (function () {
        function TreeNodeView(node, parentView) {
            this.node = node;
            this.parentView = parentView;
            this.viewBody = $($(this.getTemplate()));
            this.initElements();
            this.bindActionHandlers();
        }
        TreeNodeView.prototype.initElements = function () {
            this.nameElement = this.viewBody.find('.name');

            this.nameElement.text(this.node.name);
            this.toggleChildrenElement = this.viewBody.find('.toggle-children');
            this.nameInput = this.viewBody.find('.name-input');
            this.toggleChildren(this.node.showChildren);
        };

        TreeNodeView.prototype.bindActionHandlers = function () {
            var that = this;

            this.toggleChildrenElement.on('click', function (e) {
                that.toggleChildren();
            });
            this.viewBody.find('.delete-node').on('click', function (e) {
                that.deleteNode();
            });
            this.viewBody.find('.edit-name').on('click', function (e) {
                that.editName();
            });
            this.viewBody.find('.save-name').on('click', function (e) {
                that.saveName();
            });
            this.viewBody.find('.add-child').on('click', function (e) {
                that.addChild();
            });
        };

        TreeNodeView.prototype.render = function () {
            this.viewBody.appendTo(this.getRenderToContainer());
            return this.getChildrenContainer();
        };

        TreeNodeView.prototype.getRenderToContainer = function () {
            return this.parentView.getChildrenContainer();
        };

        TreeNodeView.prototype.getChildrenContainer = function () {
            return this.viewBody.find('> ul.children');
        };

        TreeNodeView.prototype.getTemplate = function () {
            return '<li class="list-group-item">' + '<span class="glyphicon toggle-children"></span>' + '<span class="edit-mode-hidden name"></span>' + '<input type="text" class="edit-mode-visible name-input">' + '<span class="glyphicon glyphicon-trash edit-mode-hidden delete-node"></span>' + '<span class="glyphicon glyphicon-pencil edit-mode-hidden edit-name"></span>' + '<span class="glyphicon glyphicon-plus-sign edit-mode-hidden add-child"></span>' + '<span class="glyphicon glyphicon-ok edit-mode-visible save-name"></span>' + '<ul class="list-group children hidden"></ul>' + '</li>';
        };

        TreeNodeView.prototype.toggleChildren = function (showChildren) {
            this.node.showChildren = showChildren != null ? showChildren : !this.node.showChildren;
            this.toggleChildrenElement.toggleClass('glyphicon-plus', !this.node.showChildren).toggleClass('glyphicon-minus', this.node.showChildren).toggleClass('invisible', this.node.children.length == 0);
            this.viewBody.find('> .children').toggleClass('hidden', !this.node.showChildren);
        };

        TreeNodeView.prototype.deleteNode = function () {
            this.viewBody.remove();
            this.parentView.deleteNodeFromParentModel(this.node);
        };

        TreeNodeView.prototype.deleteNodeFromParentModel = function (treeNode) {
            var index = this.node.children.indexOf(treeNode);
            if (index != -1)
                this.node.children.splice(index, 1);
            this.toggleChildren(true);
        };

        TreeNodeView.prototype.editName = function () {
            this.viewBody.addClass('edit-mode');
            this.nameInput.val(this.nameElement.text()).focus();
        };

        TreeNodeView.prototype.saveName = function () {
            this.viewBody.removeClass('edit-mode');
            this.nameElement.text(this.nameInput.val());
            this.node.name = this.nameInput.val();
        };

        TreeNodeView.prototype.addChild = function () {
            var newNode = { name: '', showChildren: false, children: [] };
            this.node.children.push(newNode);
            var newView = new TreeNodeView(newNode, this);
            newView.render();
            this.toggleChildren(true);
            newView.editName();
        };

        TreeNodeView.prototype.getViewBody = function () {
            return this.viewBody;
        };

        TreeNodeView.prototype.isParentOf = function (node) {
            return this.node.children.indexOf(node) != -1;
        };
        return TreeNodeView;
    })();
    JsTree.TreeNodeView = TreeNodeView;
})(JsTree || (JsTree = {}));
/// <reference path="../tsd/jquery.d.ts" />
/// <reference path="TreeNode.ts" />
/// <reference path="TreeNodeView.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var JsTree;
(function (JsTree) {
    var RootTreeNodeView = (function (_super) {
        __extends(RootTreeNodeView, _super);
        function RootTreeNodeView(node, parentContainer) {
            this.parentContainer = parentContainer;
            _super.call(this, node, null);
        }
        RootTreeNodeView.prototype.initElements = function () {
        };

        RootTreeNodeView.prototype.bindActionHandlers = function () {
            var that = this;
            this.getViewBody().find('#add-child-to-root').click(function (e) {
                that.addChild();
            });
        };

        RootTreeNodeView.prototype.getRenderToContainer = function () {
            return this.parentContainer;
        };

        RootTreeNodeView.prototype.getTemplate = function () {
            return '<div id="root-node">' + '<button type="button" class="btn btn-primary btn-lg btn-block" id="add-child-to-root">Add child to root</button>' + '<ul class="list-group children"></ul>' + '</div>';
        };

        RootTreeNodeView.prototype.toggleChildren = function (showChildren) {
            // do nothing, in root view children are always expanded
        };
        return RootTreeNodeView;
    })(JsTree.TreeNodeView);
    JsTree.RootTreeNodeView = RootTreeNodeView;
})(JsTree || (JsTree = {}));
/// <reference path="../tsd/jquery.d.ts" />
/// <reference path="TreeNode.ts" />
/// <reference path="RootTreeNodeView.ts" />
/// <reference path="TreeNodeView.ts" />
/// <reference path="TreeRenderer.ts" />
var JsTree;
(function (JsTree) {
    var RecursiveTreeRenderer = (function () {
        function RecursiveTreeRenderer(container) {
            this.container = container;
        }
        RecursiveTreeRenderer.prototype.renderTree = function (rootNode) {
            this.renderNode(rootNode, null);
        };

        RecursiveTreeRenderer.prototype.renderNode = function (node, parentView) {
            var view = parentView == null ? new JsTree.RootTreeNodeView(node, this.container) : new JsTree.TreeNodeView(node, parentView);
            view.render();
            for (var i = 0; i < node.children.length; i++) {
                this.renderNode(node.children[i], view);
            }
        };
        return RecursiveTreeRenderer;
    })();
    JsTree.RecursiveTreeRenderer = RecursiveTreeRenderer;
})(JsTree || (JsTree = {}));
/// <reference path="../tsd/jquery.d.ts" />
/// <reference path="TreeNode.ts" />
/// <reference path="RootTreeNodeView.ts" />
/// <reference path="TreeNodeView.ts" />
/// <reference path="TreeRenderer.ts" />
var JsTree;
(function (JsTree) {
    var IterativeTreeRenderer = (function () {
        function IterativeTreeRenderer(container) {
            this.container = container;
        }
        IterativeTreeRenderer.prototype.renderTree = function (rootNode) {
            var nodeStack = [];
            var renderedViews = [];

            nodeStack.push(rootNode);

            while (nodeStack.length) {
                var node = nodeStack.pop();
                var view = renderedViews.length ? new JsTree.TreeNodeView(node, this.getParentView(node, renderedViews)) : new JsTree.RootTreeNodeView(node, this.container);
                view.render();
                renderedViews.push(view);

                for (var i = node.children.length - 1; i >= 0; i--) {
                    nodeStack.push(node.children[i]);
                }
            }
        };

        IterativeTreeRenderer.prototype.getParentView = function (node, renderedViews) {
            for (var i = 0; i < renderedViews.length; i++) {
                var view = renderedViews[i];
                if (view.isParentOf(node))
                    return view;
            }
            throw new Error('Parent view should exist for node ' + JSON.stringify(node));
        };
        return IterativeTreeRenderer;
    })();
    JsTree.IterativeTreeRenderer = IterativeTreeRenderer;
})(JsTree || (JsTree = {}));
/// <reference path="../tsd/jquery.d.ts" />
/// <reference path="TreeNode.ts" />
/// <reference path="TreeNodeView.ts" />
/// <reference path="RootTreeNodeView.ts" />
/// <reference path="TreeRenderer.ts" />
/// <reference path="RecursiveTreeRenderer.ts" />
/// <reference path="IterativeTreeRenderer.ts" />
var JsTree;
(function (JsTree) {
    var MainView = (function () {
        function MainView(container) {
            this.rootNode = { name: '', showChildren: true, children: [] };
            this.iterativeRenderer = true;
            this.container = container;
            this.container.html(this.getTemplate());

            var that = this;
            this.container.find('#save-to-local-storage').on('click', function (e) {
                that.saveToLocalStorage();
            });
            this.container.find('#restore-from-local-storage').on('click', function (e) {
                that.renderTree();
            });
        }
        MainView.prototype.withIterativeRenderer = function () {
            this.iterativeRenderer = true;
            return this;
        };

        MainView.prototype.withRecursiveRenderer = function () {
            this.iterativeRenderer = false;
            return this;
        };

        MainView.prototype.getTreeContainer = function () {
            return this.container.find('#tree-container').html('');
        };

        MainView.prototype.restoreFromLocalStorage = function () {
            var jsonString = localStorage.getItem('jsTree');
            if (jsonString)
                this.rootNode = JSON.parse(jsonString);
            else
                this.rootNode = { name: '', showChildren: true, children: [] };
        };

        MainView.prototype.saveToLocalStorage = function () {
            localStorage.setItem('jsTree', JSON.stringify(this.rootNode));
        };

        MainView.prototype.getTemplate = function () {
            return '<div id="tree-container"></div>' + '<button type="button" class="btn btn-primary btn-lg btn-block" id="save-to-local-storage">Save to local storage</button>' + '<button type="button" class="btn btn-primary btn-lg btn-block" id="restore-from-local-storage">Restore from local storage</button>';
        };

        MainView.prototype.getRenderer = function () {
            var treeContainer = this.container.find('#tree-container').html('');
            return this.iterativeRenderer ? new JsTree.IterativeTreeRenderer(treeContainer) : new JsTree.RecursiveTreeRenderer(treeContainer);
        };

        MainView.prototype.renderTree = function () {
            this.restoreFromLocalStorage();
            this.getRenderer().renderTree(this.rootNode);
        };
        return MainView;
    })();
    JsTree.MainView = MainView;
})(JsTree || (JsTree = {}));
/// <reference path="../tsd/jasmine.d.ts" />
/// <reference path="../tsd/jquery.d.ts" />
/// <reference path="../js/TreeNode.ts" />
/// <reference path="../js/TreeNodeView.ts" />
/// <reference path="../js/RootTreeNodeView.ts" />
/// <reference path="../js/TreeRenderer.ts" />
/// <reference path="../js/RecursiveTreeRenderer.ts" />
/// <reference path="../js/IterativeTreeRenderer.ts" />
/// <reference path="../js/MainView.ts" />
var JsTree;
(function (JsTree) {
    var node;
    var subChild;
    var parentNode;
    var treeNodeView;
    var parentViewContainer;
    var treeNodeViewChildContainer;
    var tree;

    beforeEach(function () {
        subChild = { name: 'bar', showChildren: false, children: [] };
        node = { name: 'nodeName', showChildren: false, children: [subChild] };
        parentNode = {
            name: 'parentNodeName', showChildren: false, children: [
                { name: 'foo', showChildren: false, children: [] },
                node,
                { name: 'bar', showChildren: false, children: [] }
            ] };
        parentViewContainer = $('<ul></ul>');
        var rootTreeNodeView = new JsTree.RootTreeNodeView(parentNode, parentViewContainer);
        rootTreeNodeView.getChildrenContainer = function () {
            return parentViewContainer;
        };
        treeNodeView = new JsTree.TreeNodeView(node, rootTreeNodeView);
        treeNodeViewChildContainer = treeNodeView.render();

        tree = {
            name: 'ROOT', showChildren: true, children: [
                {
                    name: 'A', showChildren: false, children: [
                        { name: 'B', showChildren: false, children: [] },
                        { name: 'C', showChildren: false, children: [] }
                    ] },
                { name: 'D', showChildren: false, children: [] }
            ] };
    });

    describe('Tree node view', function () {
        it(' renders itself to parent view container', function () {
            expect(parentViewContainer.find('.list-group-item').length).toBe(1);
            expect(parentViewContainer.find('.list-group-item .name').text()).toBe('nodeName');
        });

        it(' can toggle its children', function () {
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

        it(' hides children toggling option when last child is deleted', function () {
            var childTreeNodeView = new JsTree.TreeNodeView(subChild, treeNodeView);
            childTreeNodeView.render();
            expect(parentViewContainer.find(' > li > .toggle-children').hasClass('invisible')).toBe(false);

            childTreeNodeView.deleteNode();

            expect(parentViewContainer.find(' > li > .toggle-children').hasClass('invisible')).toBe(true);
        });

        it(' allows editing node name', function () {
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

        it(' allows adding child to any node', function () {
            expect(parentViewContainer.find('li > ul.children > li').length).toBe(0);

            parentViewContainer.find('> li > .add-child').click();

            expect(parentViewContainer.find('li > ul.children > li').length).toBe(1);
            expect(node.showChildren).toBe(true);
            expect(parentViewContainer.find('li > ul.children > li').hasClass('edit-mode')).toBe(true);
        });
    });

    function assertTree(mainContainer) {
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

    describe('Recursive tree renderer', function () {
        it('renders tree nodes recursively', function () {
            var mainContainer = $('<div id="main-container"></div>');
            var renderer = new JsTree.RecursiveTreeRenderer(mainContainer);

            renderer.renderTree(tree);

            assertTree(mainContainer);
        });
    });

    describe('Iterative tree renderer', function () {
        it('renders tree nodes using own stack', function () {
            var mainContainer = $('<div id="main-container"></div>');
            var renderer = new JsTree.IterativeTreeRenderer(mainContainer);

            renderer.renderTree(tree);
            assertTree(mainContainer);
        });
    });

    describe('Main view', function () {
        var mainContainer;
        beforeEach(function () {
            mainContainer = $('<div id="main-container"></div>');
            localStorage.removeItem('jsTree');
        });

        it('reads tree structure from local storage', function () {
            localStorage.setItem('jsTree', JSON.stringify(tree));

            new JsTree.MainView(mainContainer).renderTree();

            assertTree(mainContainer);
        });

        it('by clicking button "Save to local storage" save current tree state to local storage', function () {
            localStorage.setItem('jsTree', JSON.stringify(tree));

            var mainView = new JsTree.MainView(mainContainer);
            mainView.renderTree();

            mainView.rootNode = { name: 'NEWROOT', showChildren: true, children: [] };

            mainContainer.find('#save-to-local-storage').trigger('click');

            expect(localStorage.getItem('jsTree')).toBe('{"name":"NEWROOT","showChildren":true,"children":[]}');
        });
    });
})(JsTree || (JsTree = {}));
