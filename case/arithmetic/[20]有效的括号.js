//给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。
//
// 有效字符串需满足：
//
//
// 左括号必须用相同类型的右括号闭合。
// 左括号必须以正确的顺序闭合。
//
//
// 注意空字符串可被认为是有效字符串。
//
// 示例 1:
//
// 输入: "()"
//输出: true
//
//
// 示例 2:
//
// 输入: "()[]{}"
//输出: true
//
//
// 示例 3:
//
// 输入: "(]"
//输出: false
//
//
// 示例 4:
//
// 输入: "([)]"
//输出: false
//
//
// 示例 5:
//
// 输入: "{[]}"
//输出: true
// Related Topics 栈 字符串


//leetcode submit region begin(Prohibit modification and deletion)
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  if (s === undefined) return false;

  var len = s.length;

  if (len === 0) return true;

  // 奇数位则为 false
  if (len % 2 === 1) return false;

  var mapping = {
    '{': '}',
    '[': ']',
    '(': ')'
  };

  var buffer = [], leftKeys = Object.keys(mapping);
  for (var i = 0; i < len; i++) {
    if (leftKeys.includes(s[i])) {
      buffer.push(s[i]);
    } else {
      if (i > 0 && buffer.length > 0 && mapping[buffer[buffer.length - 1]] === s[i]) {
        buffer.pop();
      } else {
        buffer.push(s[i])
      }
    }
  }

  return buffer.length === 0;
};

// console.log(isValid(''))
//leetcode submit region end(Prohibit modification and deletion)
