//给定三个字符串 s1, s2, s3, 验证 s3 是否是由 s1 和 s2 交错组成的。
//
// 示例 1:
//
// 输入: s1 = "''aabcc''", s2 = "dbbca", s3 = "aadbbcbcac"
//输出: true
//
//
// 示例 2:
//
// 输入: s1 = "aabcc", s2 = "dbbca", s3 = "aadbbbaccc"
//输出: false
// Related Topics 字符串 动态规划


//leetcode submit region begin(Prohibit modification and deletion)
/**
 * @param {string} s1
 * @param {string} s2
 * @param {string} s3
 * @return {boolean}
 */
var isInterleave = function (s1, s2, s3) {
  if (s1.length + s2.length !== s3.length) return false;

  var dp = [];
  for (var i = 0; i <= s1.length; i++) {
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0 && j == 0) {
        dp[j] = true;
      } else if (i == 0) {
        dp[j] = dp[j - 1] && s2.charAt(j - 1) == s3.charAt(i + j - 1);
      } else if (j == 0) {
        dp[j] = dp[j] && s1.charAt(i - 1) == s3.charAt(i + j - 1);
      } else {
        dp[j] = (dp[j] && s1.charAt(i - 1) == s3.charAt(i + j - 1)) || (dp[j - 1] && s2.charAt(j - 1) == s3.charAt(i + j - 1));
      }
    }
  }

  return dp[s2.length];

  // var compareInterLeave = function (i, j, res) {
  //   console.log(i, j, res);
  //   if (res === s3 && i === s1.length && j === s2.length) {
  //     return true;
  //   }
  //
  //   var isInter = false;
  //   if (i < s1.length) {
  //     isInter |= compareInterLeave(i + 1, j, res + s1.charAt(i));
  //   }
  //
  //   if (j < s2.length) {
  //     isInter |= compareInterLeave(i, j + 1, res + s2.charAt(j));
  //   }
  //
  //   return isInter;
  // };
  //
  // let memo = [];
  // return !!compareInterLeave(0, 0, '');
};

// console.log(isInterleave('aabcc', 'dbbca', 'aadbbcbcac'));
//leetcode submit region end(Prohibit modification and deletion)
