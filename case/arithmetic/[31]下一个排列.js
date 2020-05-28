//实现获取下一个排列的函数，算法需要将给定数字序列重新排列成字典序中下一个更大的排列。
//
// 如果不存在下一个更大的排列，则将数字重新排列成最小的排列（即升序排列）。
//
// 必须原地修改，只允许使用额外常数空间。
//
// 以下是一些例子，输入位于左侧列，其相应输出位于右侧列。
//1,2,3 → 1,3,2
//3,2,1 → 1,2,3
//1,1,5 → 1,5,1
//1,3,2 → 2,1,3
//2,3,1 → 3,1,2
//5,4,7,5,3,2 → 5,5,2,3,4,7
// Related Topics 数组


//leetcode submit region begin(Prohibit modification and deletion)
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var nextPermutation = function (nums) {
  if (!nums || !nums.length) return [];

  var temp, isValid = false, len = nums.length;

  const swap = (i, j, nums) => {
    temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
  }

  var i = len - 1, j;
  // 寻找特征索引，即存在 nums[i-1] > nums[i]，即索引为 i-1
  while (i > 0 && nums[i - 1] >= nums[i]) {
    i--;
  }

  if (i > 0) {
    j = len - 1;

    // 检索 i-1 之后的最后一位符合特征值
    while (j >= 0 && nums[i - 1] >= nums[j]) {
      j--;
    }

    // 定位到索引，即交换标记值
    swap(i - 1, j, nums);
  }

  // 从索引处开始从小到大排序
  j = len - 1;
  // 从索引处向后的数据正好是从大向小的顺序，故这里只需逆序即可
  while (i < j) {
    swap(i, j, nums);
    i++;
    j--;
  }

  return nums;
};

// console.log(nextPermutation([1, 2, 3]));
// console.log(nextPermutation([3, 2, 1]));
// console.log(nextPermutation([1, 1, 5]));
// console.log(nextPermutation([1, 5, 1]));
// console.log(nextPermutation([1, 3, 2]));
// console.log(nextPermutation([2, 3, 1]));
// console.log(nextPermutation([5, 4, 7, 5, 3, 2]));
//leetcode submit region end(Prohibit modification and deletion)
