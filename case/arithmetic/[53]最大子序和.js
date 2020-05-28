//给定一个整数数组 nums ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。
//
// 示例:
//
// 输入: [-2,1,-3,4,-1,2,1,-5,4],
//输出: 6
//解释: 连续子数组 [4,-1,2,1] 的和最大，为 6。
//
//
// 进阶:
//
// 如果你已经实现复杂度为 O(n) 的解法，尝试使用更为精妙的分治法求解。
// Related Topics 数组 分治算法 动态规划


//leetcode submit region begin(Prohibit modification and deletion)
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
  if (!nums || !nums.length) return 0;

  if (nums.length === 1) return nums[0];

  var max = current = nums[0];
  for (var i = 1; i < nums.length; i++) {
    // current = Math.max(nums[i], current + nums[i]);
    // max = Math.max(current, max);
    if (nums[i - 1] > 0)
      nums[i] += nums[i - 1];

    max = Math.max(nums[i], max);
  }

  return max;
};
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))
//leetcode submit region end(Prohibit modification and deletion)
