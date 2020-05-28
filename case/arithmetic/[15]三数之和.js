//给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有满足条件且不重复
//的三元组。
//
// 注意：答案中不可以包含重复的三元组。
//
//
//
// 示例：
//
// 给定数组 nums = [-1, 0, 1, 2, -1, -4]，
//
//满足要求的三元组集合为：
//[
//  [-1, 0, 1],
//  [-1, -1, 2]
//]
//
// Related Topics 数组 双指针


//leetcode submit region begin(Prohibit modification and deletion)
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  if (!nums || nums.length < 3) return [];

  // 从小到大排序
  // 这里有一个坑，sort 默认排序不是按照数值比较
  nums.sort((a, b) => a - b);

  // 判断当前数组是否同符号
  if (nums[0] > 0 || nums[nums.length - 1] < 0) return [];

  // 傻瓜循环，结论不通过
  // for (var i = 0; i < nums.length - 2; i++) {
  //   for (var j = i + 1; j < nums.length - 1; j++) {
  //     result = 0 - nums[i] - nums[j];
  //
  //     var idx = nums.lastIndexOf(result);
  //     if (idx > j) {
  //       var arr = [nums[i], nums[j], result];
  //       var str = arr.toString();
  //
  //       !mapping[str] && buffer.push(arr);
  //       mapping[str] = true;
  //     }
  //   }
  // }

  var len = nums.length, buffer = [], mapping = {}, l, r, result, arr, str;
  for (var i = 0; i < len; i++) {
    // // 判断后续数值是否同符号
    if (nums[i] > 0) return buffer;

    // 左探针
    l = i + 1;
    // 右探针
    r = len - 1;

    while (l < r) {
      result = nums[i] + nums[l] + nums[r];

      if (result === 0) {
        arr = [nums[i], nums[l], nums[r]];
        str = arr.toString();

        if (!mapping[str]) {
          mapping[str] = true;
          buffer.push(arr);
        }

        l++;
        r--;
      } else if (result > 0) {
        // 结果集大于0则向小的值方向移动
        r--;
      } else {
        // 结果集小于0则向大的值方向移动
        l++;
      }
    }
  }

  return buffer;
};

// console.log(threeSum([-1, -2, -3, 4, 1, 3, 0, 3, -2, 1, -2, 2, -1, 1, -5, 4, -3]))
//leetcode submit region end(Prohibit modification and deletion)
