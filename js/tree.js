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
        function TreeNodeView(node, parentNode) {
            this.node = node;
            this.parentNode = parentNode;
        }
        TreeNodeView.prototype.render = function (container) {
            var that = this;

            this.viewBody = $($(this.getTemplate()));
            this.viewBody.appendTo(container);

            this.nameElement = this.viewBody.find('.name');
            this.nameElement.text(this.node.name);
            this.toggleChildrenElement = this.viewBody.find('.toggle-children');
            this.nameInput = this.viewBody.find('.name-input');

            this.toggleChildrenElement.on('click', function (e) {
                that.toggleChildren();
            });
            this.toggleChildren(this.node.showChildren);
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

            return this.getChildrenContainer();
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
            var index = this.parentNode.children.indexOf(this.node);
            if (index != -1)
                this.parentNode.children.splice(index, 1);
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
            var newView = new TreeNodeView(newNode, this.node);
            newView.render(this.getChildrenContainer());
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
        function RootTreeNodeView(node) {
            _super.call(this, node, null);
        }
        RootTreeNodeView.prototype.render = function (container) {
            var that = this;
            var resultContainer = _super.prototype.render.call(this, container);
            this.getViewBody().find('#add-child-to-root').click(function (e) {
                that.addChild();
            });
            return resultContainer;
        };

        RootTreeNodeView.prototype.getTemplate = function () {
            return $('#root-node-template').contents().text();
        };
        return RootTreeNodeView;
    })(TreeNodeView);
    JsTree.RootTreeNodeView = RootTreeNodeView;

    var RecursiveTreeRenderer = (function () {
        function RecursiveTreeRenderer(container) {
            this.container = container;
        }
        RecursiveTreeRenderer.prototype.renderTree = function (rootNode) {
            this.renderNode(rootNode, null, this.container);
        };

        RecursiveTreeRenderer.prototype.renderNode = function (node, parent, parentContainer) {
            var view = parent == null ? new RootTreeNodeView(node) : new TreeNodeView(node, parent);
            var childrenContainer = view.render(parentContainer);
            for (var i = 0; i < node.children.length; i++) {
                this.renderNode(node.children[i], node, childrenContainer);
            }
        };
        return RecursiveTreeRenderer;
    })();
    JsTree.RecursiveTreeRenderer = RecursiveTreeRenderer;
})(JsTree || (JsTree = {}));
