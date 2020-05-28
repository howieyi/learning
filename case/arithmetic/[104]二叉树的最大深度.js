//给定一个二叉树，找出其最大深度。
//
// 二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。
//
// 说明: 叶子节点是指没有子节点的节点。
//
// 示例：
//给定二叉树 [3,9,20,null,null,15,7]，
//
//     3
//   / \
//  9  20
//    /  \
//   15   7
//
// 返回它的最大深度 3 。
// Related Topics 树 深度优先搜索


//leetcode submit region begin(Prohibit modification and deletion)
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function (root) {
  if (!root) return 0;
  else {
    var leftMax = maxDepth(root.left);
    var rightMax = maxDepth(root.right);
    return (leftMax > rightMax ? leftMax : rightMax) + 1;
  }
};

// var t1 = {val: 3, left: {val: 9}, right: {val: 20, left: {val: 15}, right: {val: 7}}};
// var t2 = {val: 5, left: {val: 0, left: {val: 1}, right: {val: 2}}, right: {val: 9, left: {val: 3}, right: {val: 4}}};
// var t1 = {val: 1};
// var t2 = {val: 1, right: {val: 2}};

// console.log(maxDepth(t1));
//leetcode submit region end(Prohibit modification and deletion)
