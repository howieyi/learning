//给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。
//
// 你可以假设每种输入只会对应一个答案。但是，你不能重复利用这个数组中同样的元素。
//
// 示例:
//
// 给定 nums = [2, 7, 11, 15], target = 9
//
//因为 nums[0] + nums[1] = 2 + 7 = 9
//所以返回 [0, 1]
//
// Related Topics 数组 哈希表


//leetcode submit region begin(Prohibit modification and deletion)
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
  // tip1: target 可能为0
  if (!nums.length) return [];

  var _resultIdx;
  for (var i = 0; i < nums.length; i++) {
    // tip2: 两个数字可能相同，需要从后进行索引，并且需要索引比较异同
    _resultIdx = nums.lastIndexOf(target - nums[i]);
    if (_resultIdx > -1 && _resultIdx !== i) {
      return [i, _resultIdx];
    }
  }

  return [];
};
//leetcode submit region end(Prohibit modification and deletion)
