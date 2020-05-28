//给定一个字符串，验证它是否是回文串，只考虑字母和数字字符，可以忽略字母的大小写。
//
// 说明：本题中，我们将空字符串定义为有效的回文串。
//
// 示例 1:
//
// 输入: "A man, a plan, a canal: Panama"
//输出: true
//
//
// 示例 2:
//
// 输入: "race a car"
//输出: false
//
// Related Topics 双指针 字符串


//leetcode submit region begin(Prohibit modification and deletion)
/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function (s) {
  if (!s) return true;

  // 匹配合法字符
  var matchs = s.match(/[a-z0-9A-Z]+/ig);
  s = matchs ? matchs.join('') : "";

  if (!s) return true;

  var l = 0;
  var r = s.length - 1;
  while (l < r && s[l].toLowerCase() === s[r].toLowerCase()) {
    l++;
    r--;
  }

  // 奇偶数原因存在索引差异
  return l - r === 1 || l == r;
};
//leetcode submit region end(Prohibit modification and deletion)
