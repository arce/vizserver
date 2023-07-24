function DataTree() {
  return {
    label: new Array(),
    parent: new Array(),
    first: new Array(),
    next: new Array(),
    last: new Array(),
    count: new Array(),
    fields: new Array(),
    totalCount: 0,
    root: 0
  }
}

function newNode(self, label) {
  const n = self.totalCount;
  self.totalCount = self.totalCount + 1;
  self.label[n] = label;
  self.parent[n] = self.first[n] = -1;
  self.next[n] = self.last[n] = -1;
  self.count[n] = 0;
  //  self.root = n
  return n;
}

function addChild(self, node, label) {
  const n = newNode(self, label);
  self.parent[n] = node;
  if (self.first[node] == -1) {
    self.first[node] = n;
    self.count[node] = 1;
  } else {
    self.next[self.last[node]] = n;
    self.count[node] = self.count[node] + 1;
  }
  self.last[node] = n;
  return n;
}

function addField(self, name) {
  self[name] = new Array();
  self.fields[self.fields.length] = name;
}

function isLeaf(self, node) {
  return (self.count[node] == 0);
}

function isRoot(self, node) {
  return (self.parent[node] == -1);
}

function _createRegularTree(self, node, level, branches) {
  if (level == 0) return;
  let child = -1;
  for (var i = 0; i < branches; i++) {
    child = addChild(self, node, "" + self.totalCount);
    _createRegularTree(self, child, level - 1, branches);
  }
}

function createRegularTree(level, branches) {
  const tree = DataTree()
  const root = newNode(tree, "0");
  _createRegularTree(tree, root, level, branches)
  return tree;
}

function _printTree(self, node, level) {
  console.log(" ".repeat(level));
  console.log(self.label[node], '\n');
  let child = self.first[node];
  while (child != -1) {
    _printTree(self, child, level + 1);
    child = self.next[child];
  }
}

function printTree(self, node) {
  if (node == -1)
    node = self.root;
  _printTree(self, node, 0);
}

function _randomValue(self, node) {
  if (self.count[node] == 0) {
    self.value[node] = Math.random(100);
    return
  }

  let sum = 0;

  let child = self.first[node];
  while (child != -1) {
    _randomValue(self, child);
    sum = sum + self.value[child];
    child = self.next[child];
  }
  self.value[node] = sum;
}

function randomValue(self, node) {
  addField(self, "value");
  _randomValue(self, node);
}

function _computeLeaves(tree, node) {
  const n = tree.count[node];
  tree.leaves[node] = 0;
  if (n == 0) return;
  let child = tree.first[node];
  for (var i = 0; i < n; i++) {
    _computeLeaves(tree, child);
    if (tree.count[child] == 0)
      tree.leaves[node]++;
    child = tree.next[child];
  }
}

function computeLeaves(tree) {
  addField(tree, "leaves");
  _computeLeaves(tree, 0);
}
