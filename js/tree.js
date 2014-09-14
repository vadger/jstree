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
        return TreeNodeView;
    })();
    JsTree.TreeNodeView = TreeNodeView;
})(JsTree || (JsTree = {}));
