//给定一个可包含重复数字的序列，返回所有不重复的全排列。
//
// 示例:
//
// 输入: [1,1,2]
//输出:
//[
//  [1,1,2],
//  [1,2,1],
//  [2,1,1]
//]
// Related Topics 回溯算法


//leetcode submit region begin(Prohibit modification and deletion)
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permuteUnique = function (nums) {
  if (!nums || nums.length === 0) return [];

  if (nums.length <= 1) return [nums];

  var result = [], track = [], used = {};

  // 排序是剪枝的必要操作
  nums.sort();

  var backtrack = function (nums, track, used, depth) {
    if (depth === nums.length) {
      result.push(track.slice(0));
      return;
    }

    for (var i = 0; i < nums.length; i++) {
      // 使用过则跳出
      if (used[i]) continue;

      // 剪枝 保证 nums[i - 1] 有意义
      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue;

      track.push(nums[i]);
      used[i] = true;
      backtrack(nums, track, used, depth + 1);
      used[i] = false;
      track.pop();
    }
  };

  backtrack(nums, track, used, 0);
  return result;
};
//leetcode submit region end(Prohibit modification and deletion)
