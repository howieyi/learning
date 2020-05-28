//给定一个字符串 s1，我们可以把它递归地分割成两个非空子字符串，从而将其表示为二叉树。
//
// 下图是字符串 s1 = "great" 的一种可能的表示形式。
//
//     great
//   /    \
//  gr    eat
// / \    /  \
//g   r  e   at
//           / \
//          a   t
//
//
// 在扰乱这个字符串的过程中，我们可以挑选任何一个非叶节点，然后交换它的两个子节点。
//
// 例如，如果我们挑选非叶节点 "gr" ，交换它的两个子节点，将会产生扰乱字符串 "rgeat" 。
//
//     rgeat
//   /    \
//  rg    eat
// / \    /  \
//r   g  e   at
//           / \
//          a   t
//
//
// 我们将 "rgeat” 称作 "great" 的一个扰乱字符串。
//
// 同样地，如果我们继续交换节点 "eat" 和 "at" 的子节点，将会产生另一个新的扰乱字符串 "rgtae" 。
//
//     rgtae
//   /    \
//  rg    tae
// / \    /  \
//r   g  ta  e
//       / \
//      t   a
//
//
// 我们将 "rgtae” 称作 "great" 的一个扰乱字符串。
//
// 给出两个长度相等的字符串 s1 和 s2，判断 s2 是否是 s1 的扰乱字符串。
//
// 示例 1:
//
// 输入: s1 = "great", s2 = "rgeat"
//输出: true
//
//
// 示例 2:
//
// 输入: s1 = "abcde", s2 = "caebd"
//输出: false
// Related Topics 字符串 动态规划


//leetcode submit region begin(Prohibit modification and deletion)
/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
var isScramble = function (s1, s2) {
  if (s1.length !== s2.length) return false;

  return compare(s1, s2);
};


var compare = function (a, b) {
  if (a === b) return true;

  if (a.length === 1) return false;

  // 比较所有字符串组合是否都一致
  var buffer = [], len = a.length;
  // for (var i = 0; i < len; ++i) {
  //   buffer[a[i]] = (buffer[a[i]] || 0) + 1;
  //   buffer[b[i]] = (buffer[b[i]] || 0) - 1;
  // }
  //
  // // 字符串归属比较
  // for (var i = 0; i < buffer.length; i++) {
  //   if (buffer[i] !== 0) return false;
  // }

  for (var i = 1; i < len; i++) {
    // 拆分段
    var al = a.substr(0, i), ar = a.substr(i, len - i);
    // 前后拆分
    var bl1 = b.substr(0, i), br1 = b.substr(i, len - i);
    // 后前拆分
    var bl2 = b.substr(len - i, i), br2 = b.substr(0, len - i);

    // 前后分别比较
    if ((compare(al, bl1) && compare(ar, br1)) || (compare(al, bl2) && compare(ar, br2))) {
      return true;
    }
  }

  return false;
}
// console.log(isScramble('great', 'rgeat'));

//leetcode submit region end(Prohibit modification and deletion)
