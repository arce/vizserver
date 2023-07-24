const VERTICAL = 0;
const HORIZONTAL = 1;
const ASCENDING = 0;
const DESCENDING = 1;

function totalSize(tree, start, last) {
  let sum = 0;
  let child = start;
  while (child != last) {
    sum += tree.value[child];
    child = tree.next[child];
  }
  sum += tree.value[child];
  return sum;
}

function sliceLayout(tree, start, last, x, y, w, h, orientation, order) {
  const total = totalSize(tree, start, last);
  let a = 0;
  let vertical = orientation == VERTICAL;
  for (var i = start; i <= last; i = tree.next[i]) {
    const b = tree.value[i] / total;
    if (vertical) {
      tree.x[i] = x;
      tree.w[i] = w;
      if (order == ASCENDING)
        tree.y[i] = y + h * a;
      else
        tree.y[i] = y + h * (1 - a - b);
      tree.h[i] = h * b;
    } else {
      if (order == ASCENDING)
        tree.x[i] = x + w * a;
      else
        tree.x[i] = x + w * (1 - a - b);
      tree.w[i] = w * b;
      tree.y[i] = y;
      tree.h[i] = h;
    }
    a += b;
  }
}

function layoutBest(tree, start, last, x, y, w, h) {
  sliceLayout(tree, start, last, x, y, w, h,
    w > h ? HORIZONTAL : VERTICAL, ASCENDING);
}

function aspect(big, small, a, b) {
  return (big * b) / (small * a / b);
}

function normAspect(big, small, a, b) {
  const x = aspect(big, small, a, b);
  if (x < 1) return 1 / x;
  return x;
}

function layout(tree, start, last, x, y, w, h) {
  if (start == -1) return;

  if ((tree.next[start] == -1) ||
    (tree.next[start] == last)) {
    layoutBest(tree, start, last, x, y, w, h);
    return;
  }

  let total = totalSize(tree, start, last);
  let mid = start;
  let a = tree.value[start] / total;
  let b = a;

  if (w < h) {
    while (mid != last) {
      var aspect = normAspect(h, w, a, b);
      var q = tree.value[mid] / total;
      if (normAspect(h, w, a, b + q) > aspect) break;
      b += q;
      mid = tree.next[mid];
    }
    layoutBest(tree, start, mid, x, y, w, h * b);
    layout(tree, tree.next[mid], last, x, y + h * b, w, h * (1 - b));
  } else {
    while (mid != last) {
      var aspect = normAspect(w, h, a, b);
      var q = tree.value[mid] / total;
      if (normAspect(w, h, a, b + q) > aspect) break;
      b += q;
      mid = tree.next[mid];
    }
    layoutBest(tree, start, mid, x, y, w * b, h);
    layout(tree, tree.next[mid], last, x + w * b, y, w * (1 - b), h);
  }
}

let stack = [];

function _squaredTreeMap(self) {
  while (stack.length!=0) {
    const node = stack.pop()
    const start = self.first[node];
    const last = self.last[node];
    layout(self, start, last,
      self.x[node], self.y[node], self.w[node], self.h[node];
    let i = start;
    while (i != -1) {
      stack.push(i);
      i = self.next[i];
    }
  }
}

function squaredTreeMap(self, x, y, w, h) {
  const root = self.root;
  addField(self, 'x');
  addField(self, 'y');
  addField(self, 'w');
  addField(self, 'h');
  self.x[root] = x;
  self.y[root] = y;
  self.w[root] = w;
  self.h[root] = h;
  stack.push(root);
  _squaredTreeMap(self);
}
