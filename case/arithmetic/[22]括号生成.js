//数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。
//
//
//
// 示例：
//
// 输入：n = 3
//输出：[
//       "((()))",
//       "(()())",
//       "(())()",
//       "()(())",
//       "()()()"
//     ]
//
// Related Topics 字符串 回溯算法


//leetcode submit region begin(Prohibit modification and deletion)
/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function (n) {
  if (!n) return [];
  if (n === 1) return ['()'];

  var mapping = {1: ['()']};

  // 计算下一阶括号组合
  var getNextMappings = function (buffer) {
    var nextBuffer = [];
    var currMap = {}; // map 缓存
    for (var j = 0; j < buffer.length; j++) {
      var cur = buffer[j];

      for (var i = 0; i < cur.length; i++) {
        var temp = [cur.slice(0, i), '()', cur.slice(i)].join('');

        !currMap[temp] && nextBuffer.push(temp);

        // 缓存map 用来匹配重复子串
        currMap[temp] = true;
      }
    }

    currMap = null;
    return nextBuffer;
  };

  for (var i = 2; i <= n; i++) {
    var temp = getNextMappings(mapping[i - 1], i);
    // 缓存每阶括号集合
    mapping[i] = temp;
  }

  return mapping[n];
};

// console.log(generateParenthesis(3))
//leetcode submit region end(Prohibit modification and deletion)
