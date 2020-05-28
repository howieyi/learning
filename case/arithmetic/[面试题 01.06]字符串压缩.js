//字符串压缩。利用字符重复出现的次数，编写一种方法，实现基本的字符串压缩功能。比如，字符串aabcccccaaa会变为a2b1c5a3。若“压缩”后的字符串没
//有变短，则返回原先的字符串。你可以假设字符串中只包含大小写英文字母（a至z）。
//
// 示例1:
//
//
// 输入："aabcccccaaa"
// 输出："a2b1c5a3"
//
//
// 示例2:
//
//
// 输入："abbccd"
// 输出："abbccd"
// 解释："abbccd"压缩后为"a1b2c2d1"，比原字符串长度更长。
//
//
// 提示：
//
//
// 字符串长度在[0, 50000]范围内。
//
// Related Topics 字符串


//leetcode submit region begin(Prohibit modification and deletion)
/**
 * @param {string} S
 * @return {string}
 */
var compressString = function (S) {
  if (!S) return '';
  var len = S.length;

  if (len === 1) return S;

  var result = '', count = 1;
  for (var i = 1; i < len; i++) {
    var prev = S[i - 1];
    var cur = S[i];

    if (cur === prev) {
      count++;
    } else {
      // 与前一个字符不相同
      result += prev + count;
      count = 1;
    }

    // 最后一位
    i === len - 1 && (result += cur + count);
  }

  return result.length < len ? result : S;
};

// console.log(compressString('a'))
//leetcode submit region end(Prohibit modification and deletion)
