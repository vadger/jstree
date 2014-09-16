var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../tsd/jquery.d.ts" />
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
            return $('#node-template').contents().text();
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
        return TreeNodeView;
    })();
    JsTree.TreeNodeView = TreeNodeView;

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
            return $('#root-node-template').contents().text();
        };

        RootTreeNodeView.prototype.toggleChildren = function (showChildren) {
            // do nothing, in root view children are always expanded
        };
        return RootTreeNodeView;
    })(TreeNodeView);
    JsTree.RootTreeNodeView = RootTreeNodeView;

    var RecursiveTreeRenderer = (function () {
        function RecursiveTreeRenderer(container) {
            this.container = container;
        }
        RecursiveTreeRenderer.prototype.renderTree = function (rootNode) {
            this.renderNode(rootNode, null);
        };

        RecursiveTreeRenderer.prototype.renderNode = function (node, parentView) {
            var view = parentView == null ? new RootTreeNodeView(node, this.container) : new TreeNodeView(node, parentView);
            var childrenContainer = view.render();
            for (var i = 0; i < node.children.length; i++) {
                this.renderNode(node.children[i], view);
            }
        };
        return RecursiveTreeRenderer;
    })();
    JsTree.RecursiveTreeRenderer = RecursiveTreeRenderer;

    var MainView = (function () {
        function MainView(container) {
            this.rootNode = { name: '', showChildren: true, children: [] };
            this.container = container;
        }
        MainView.prototype.renderTree = function (rootNode) {
            if (rootNode != null)
                this.rootNode = rootNode;
            new RecursiveTreeRenderer(this.container.html('')).renderTree(this.rootNode);
        };
        return MainView;
    })();
    JsTree.MainView = MainView;
})(JsTree || (JsTree = {}));
