//给定两个大小为 m 和 n 的有序数组 nums1 和 nums2。
//
// 请你找出这两个有序数组的中位数，并且要求算法的时间复杂度为 O(log(m + n))。
//
// 你可以假设 nums1 和 nums2 不会同时为空。
//
// 示例 1:
//
// nums1 = [1, 3]
//nums2 = [2]
//
//则中位数是 2.0
//
//
// 示例 2:
//
// nums1 = [1, 2,3,4,5,6]
//nums2 = [3, 4,5,6,7,8]
//
//则中位数是 (2 + 3)/2 = 2.5
//
// Related Topics 数组 二分查找 分治算法


//leetcode submit region begin(Prohibit modification and deletion)
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function (nums1, nums2) {
  if (!nums1 || !nums2) return 0;

  var len1 = nums1.length, len2 = nums2.length;

  // 确保方向
  if (len1 > len2) {
    var temp;
    temp = nums1;
    nums1 = nums2;
    nums2 = temp;
    temp = len1;
    len1 = len2;
    len2 = temp;
  }

  if (len1 === 0) {
    if (len2 === 1) {
      return nums2[0];
    }

    var halfIdx = Math.floor(len2 / 2);
    return len2 % 2 == 1 ? nums2[halfIdx] : (nums2[halfIdx] + nums2[halfIdx - 1]) / 2;
  }

  var iMin = 0, iMax = len2, halfLen = Math.floor((len1 + len2) / 2);
  while (iMin <= iMax) {
    var i = Math.floor((iMin + iMax) / 2);
    var j = halfLen - i;

    console.log(i, j, len1, len2)
    if (i < iMax && nums2[j - 1] > nums1[i]) {
      iMin = i + 1;
    } else if (i > iMin && nums1[i - 1] > nums2[j]) {
      iMax = i - 1;
    } else {
      var maxLeft = i === 0 ? nums2[j - 1] : j === 0 ? nums1[i - 1] : Math.max(nums1[i - 1], nums2[j - 1]);

      // 奇数位
      if ((len1 + len2) % 2 === 1) {
        return maxLeft;
      }

      var minRight = i === len1 ? nums2[j] : j === len2 ? nums1[i] : Math.min(nums2[j], nums1[i]);

      return (maxLeft + minRight) / 2;
    }
  }

  return 0;
}

console.log(222, findMedianSortedArrays([1], [2, 3, 4, 5]));
//leetcode submit region end(Prohibit modification and deletion)
