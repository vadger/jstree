/// <reference path="../tsd/jquery.d.ts" />
var JsTree;
(function (JsTree) {
    var TreeNodeView = (function () {
        function TreeNodeView(node, parentNode) {
            this.node = node;
            this.parentNode = parentNode;
        }
        TreeNodeView.prototype.render = function (container) {
            var self = this;

            this.view = $($(this.getTemplate()));
            this.view.appendTo(container);

            this.nameElement = this.view.find('.name');
            this.nameElement.text(this.node.name);
            this.toggleChildrenElement = this.view.find('.toggle-children');
            this.nameInput = this.view.find('.name-input');

            this.toggleChildrenElement.on('click', function (e) {
                self.toggleChildren();
            });
            this.toggleChildren(this.node.showChildren);
            this.view.find('.delete-node').on('click', function (e) {
                self.deleteNode();
            });
            this.view.find('.edit-name').on('click', function (e) {
                self.editName();
            });
            this.view.find('.save-name').on('click', function (e) {
                self.saveName();
            });

            return this.getChildrenContainer();
        };

        TreeNodeView.prototype.getChildrenContainer = function () {
            return this.view.find('> ul.children');
        };

        TreeNodeView.prototype.getTemplate = function () {
            return $('#node-template').contents().text();
        };

        TreeNodeView.prototype.toggleChildren = function (showChildren) {
            this.node.showChildren = showChildren != null ? showChildren : !this.node.showChildren;

            this.toggleChildrenElement.toggleClass('glyphicon-plus', !this.node.showChildren).toggleClass('glyphicon-minus', this.node.showChildren);
            this.view.find('> .children').toggleClass('hidden', !this.node.showChildren);
        };

        TreeNodeView.prototype.deleteNode = function () {
            this.view.remove();
            var index = this.parentNode.children.indexOf(this.node);
            if (index != -1)
                this.parentNode.children.splice(index, 1);
        };

        TreeNodeView.prototype.editName = function () {
            this.view.addClass('edit-mode');
            this.nameInput.val(this.nameElement.text()).focus();
        };

        TreeNodeView.prototype.saveName = function () {
            this.view.removeClass('edit-mode');
            this.nameElement.text(this.nameInput.val());
            this.node.name = this.nameInput.val();
        };
        return TreeNodeView;
    })();
    JsTree.TreeNodeView = TreeNodeView;
})(JsTree || (JsTree = {}));
