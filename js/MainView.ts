/// <reference path="../tsd/jquery.d.ts" />
/// <reference path="TreeNode.ts" />
/// <reference path="TreeNodeView.ts" />
/// <reference path="RootTreeNodeView.ts" />
/// <reference path="TreeRenderer.ts" />
/// <reference path="RecursiveTreeRenderer.ts" />
/// <reference path="IterativeTreeRenderer.ts" />

module JsTree {

  export class MainView {
    rootNode:TreeNode = {name: '', showChildren: true, children: []};

    private container:JQuery;
    private iterativeRenderer:boolean = true;

    constructor(container:JQuery) {
      this.container = container;
      this.container.html(this.getTemplate());

      var that = this;
      this.container.find('#save-to-local-storage').on('click', (e) => {that.saveToLocalStorage()});
      this.container.find('#restore-from-local-storage').on('click', (e) => {that.renderTree()});
    }

    withIterativeRenderer():MainView {
      this.iterativeRenderer = true;
      return this;
    }

    withRecursiveRenderer():MainView {
      this.iterativeRenderer = false;
      return this;
    }

    private getTreeContainer():JQuery {
      return this.container.find('#tree-container').html('');
    }

    restoreFromLocalStorage() {
      var jsonString = localStorage.getItem('jsTree');
      if (jsonString) this.rootNode = JSON.parse(jsonString);
      else this.rootNode = {name: '', showChildren: true, children: []};
    }

    saveToLocalStorage() {
      localStorage.setItem('jsTree', JSON.stringify(this.rootNode));
    }

    getTemplate():string {
      return '<div id="tree-container"></div>' +
        '<button type="button" class="btn btn-primary btn-lg btn-block" id="save-to-local-storage">Save to local storage</button>' +
        '<button type="button" class="btn btn-primary btn-lg btn-block" id="restore-from-local-storage">Restore from local storage</button>';
    }

    private getRenderer():TreeRenderer {
      var treeContainer = this.container.find('#tree-container').html('');
      return this.iterativeRenderer ? new IterativeTreeRenderer(treeContainer) : new RecursiveTreeRenderer(treeContainer);
    }

    renderTree() {
      this.restoreFromLocalStorage();
      this.getRenderer().renderTree(this.rootNode);
    }
  }
}
