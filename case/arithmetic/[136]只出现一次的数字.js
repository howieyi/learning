//给定一个非空整数数组，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。
//
// 说明：
//
// 你的算法应该具有线性时间复杂度。 你可以不使用额外空间来实现吗？
//
// 示例 1:
//
// 输入: [2,2,1]
//输出: 1
//
//
// 示例 2:
//
// 输入: [4,1,2,1,2]
//输出: 4
// Related Topics 位运算 哈希表


//leetcode submit region begin(Prohibit modification and deletion)
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function (nums) {
  if (!nums || !nums.length) return null;

  var buffer = {}, result;
  for (var i = 0; i < nums.length; i++) {
    var it = nums[i];
    buffer[it] = ++buffer[it] || 1;
  }

  for(var it in buffer){
    if(buffer[it] === 1) {
      result = it;
    }
  }

  return result;
};

// console.log(singleNumber([4,1,2,1,2]))
//leetcode submit region end(Prohibit modification and deletion)
