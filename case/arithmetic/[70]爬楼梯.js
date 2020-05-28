//假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
//
// 每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
//
// 注意：给定 n 是一个正整数。
//
// 示例 1：
//
// 输入： 2
//输出： 2
//解释： 有两种方法可以爬到楼顶。
//1.  1 阶 + 1 阶
//2.  2 阶
//
// 示例 2：
//
// 输入： 3
//输出： 3
//解释： 有三种方法可以爬到楼顶。
//1.  1 阶 + 1 阶 + 1 阶
//2.  1 阶 + 2 阶
//3.  2 阶 + 1 阶
//
// Related Topics 动态规划


//leetcode submit region begin(Prohibit modification and deletion)
/**
 * @param {number} n
 * @return {number}
 */
// var climbStairs = function (n) {
//   var buffer = {};
//
//   // 方法1 递归法
//   function calcute(i, n) {
//     if (i > n) return 0;
//     if (i == n) return 1;
//
//     // 校验缓存
//     if (buffer[i] > 0) return buffer[i];
//     // 缓存
//     buffer[i] = calcute(i + 1, n) + calcute(i + 2, n);
//     return buffer[i];
//   }
//
//   return calcute(0, n);
// };

// var climbStairs = function (n) {
//   // 第 ii 阶可以由以下两种方法得到：
//   //
//   // 在第 (i-1)(i−1) 阶后向上爬一阶。
//   //
//   // 在第 (i-2)(i−2) 阶后向上爬 22 阶。
//   //
//   // 所以到达第 ii 阶的方法总数就是到第 (i-1)(i−1) 阶和第 (i-2)(i−2) 阶的方法数之和。
//
//   // dp[i]=dp[i−1]+dp[i−2]
//
//   if (n == 0) return 0;
//
//   var dp = [], i = 0;
//
//   // i = 1、2
//   dp[1] = 1;
//   dp[2] = 2;
//   for (var i = 3; i <= n; i++) {
//     dp[i] = dp[i - 1] + dp[i - 2];
//     console.log(i, dp[i])
//   }
//
//   return dp[n];
// };

var climbStairs = function (n) {
//   在上述方法中，我们使用 dp 数组，其中 dp[i]=dp[i-1]+dp[i-2]。可以很容易通过分析得出 dp[i] 其实就是第 i 个斐波那契数。
//
// Fib(n)=Fib(n-1)+Fib(n-2)
//
//   现在我们必须找出以 1 和 2 作为第一项和第二项的斐波那契数列中的第 n 个数，也就是说 Fib(1)=1 且 Fib(2)=2

  if (n <= 2) return n;

  var first = 1, second = 2;
  for (var i = 3; i <= n; i++) {
    var third = first + second;
    first = second;
    second = third;
  }

  return second
}

// console.log(climbStairs(13))
//eetcode submit region end(Prohibit modification and deletion)
