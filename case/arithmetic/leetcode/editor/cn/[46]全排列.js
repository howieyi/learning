//给定一个 没有重复 数字的序列，返回其所有可能的全排列。
//
// 示例:
//
// 输入: [1,2,3]
//输出:
//[
//  [1,2,3],
//  [1,3,2],
//  [2,1,3],
//  [2,3,1],
//  [3,1,2],
//  [3,2,1]
//]
// Related Topics 回溯算法


//leetcode submit region begin(Prohibit modification and deletion)
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function (nums) {
  if (!nums || nums.length === 0) return [];

  if (nums.length <= 1) return [nums];

  var result = [], track = [];

  // 路径：记录在 track 中
  var backTrack = function (nums, track = []) {
    // 结束条件：nums 中的元素全都在 track 中出现
    if (track.length === nums.length) {
      // 推入结果集，复制当前数组并跳出
      result.push(track.slice(0));
      return;
    }

    for (var i = 0; i < nums.length; i++) {
      // 排除不合法的选择
      if (track.includes(nums[i])) continue;

      track.push(nums[i]);
      // 进入下一层决策树
      backTrack(nums, track);
      // 尾数出栈，继续当前遍历
      track.pop();
    }
  };

  backTrack(nums, track);
  return result;
};

// console.log(permute([1, 2, 3, 4]));
//leetcode submit region end(Prohibit modification and deletion)
