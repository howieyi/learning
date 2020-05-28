//给定一个字符串 s，找到 s 中最长的回文子串。你可以假设 s 的最大长度为 1000。
//
// 示例 1：
//
// 输入: "babad"
//输出: "bab"
//注意: "aba" 也是一个有效答案。
//
//
// 示例 2：
//
// 输入: "cbbd"
//输出: "bb"
//
// Related Topics 字符串 动态规划


//leetcode submit region begin(Prohibit modification and deletion)
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
  if (!s || !s.length) return '';

  // // 1位
  // if (s.length === 1) return s;
  // // 2位
  // if (s.length === 2) return s[0] == s[1] ? s : s[0];
  //
  // // 粗暴解法, 确定复杂度太高，耗时，Time Limit Exceeded
  // var tempStr, maxStr = s[0];
  // for (var i = 0; i < s.length - 1; i++) {
  //   for (var j = s.length - 1; j > i; j--) {
  //     if (isLoopString(s, i, j)) {
  //       maxStr = !maxStr || maxStr.length < j - i + 1 ? s.substring(i, j + 1) : maxStr;
  //       continue;
  //     }
  //   }
  // }

  var pos = 0, // 起始指针索引
    end = s.length - 1, // 终点指针索引
    maxStr = s[0];

  // 双指针移动
  while (pos <= end) {
    // 从后向前进行移动，最长的如果
    if (isLoopString(s, pos, end)) {
      // 找到当前索引最长子串
      maxStr = maxStr.length < end - pos + 1 ? s.substring(pos, end + 1) : maxStr;

      // 当前串为回文串即结束循环
      if (maxStr.length === s.length) return maxStr;

      // 当前索引最长串已找到，向后移动指针索引
      pos++;
      end = s.length - 1;

      // 当前最长串长度比后面索引起始区长度长，则当前回文串为最长，跳出循环
      if (maxStr.length >= end - pos + 1) return maxStr;
    } else {
      end--;
    }
  }

  return maxStr;
};

// 校验是否回文
function isLoopString(a, start, end) {
  var i = start, j = end;
  while (i >= 0 && j < a.length && i < j && a[i] === a[j]) {
    i++;
    j--;
  }

  // 偶数位索引为 0；奇数位索引差为1
  return (end - start + 1) % 2 !== 0 ? i - j === 0 : i - j === 1;
};

// console.log(longestPalindrome('ccccc'))
//leetcode submit region end(Prohibit modification and deletion)
