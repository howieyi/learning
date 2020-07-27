### 定义

> 回溯算法实际上一个类似枚举的搜索尝试过程，主要是在搜索尝试过程中寻找问题的解，当发现已不满足求解条件时，就“回溯”返回，尝试别的路径。回溯法是一种选优搜索法，按选优条件向前搜索，以达到目标。但当探索到某一步时，发现原先选择并不优或达不到目标，就退回一步重新选择，这种走不通就退回再走的技术为回溯法，而满足回溯条件的某个状态的点称为“回溯点”。许多复杂的，规模较大的问题都可以使用回溯法，有“通用解题方法”的美称。

- 回溯法：一种通过探索所有可能的候选解来找出所有的解的算法。如果候选解被确认不是一个解的话（或者至少不是最后一个解），回溯算法会通过在上一步进行一些变化抛弃该解，即回溯并且再次尝试。
- 回溯问题，实际上就是决策树的遍历过程。

  > 需要思考 3 个问题：
  >
  > 1. 路径：也就是已经做出的选择。
  > 2. 选择列表：也就是你当前可以做的选择。
  > 3. 结束条件：也就是到达决策树底层，无法再做选择的条件。

- 回溯算法的框架

```
result = []
function backtrack(选择列表, 路径){
    if 满足结束条件 {
        result.add(路径)
        return
    }

    for 选择 of 选择列表 {
        做选择入栈
        backtrack(选择列表, 路径)
        撤销选择出栈，继续下一轮
    }
}
```

> 其核心就是 for 循环里面的递归，在递归调用之前「做选择」，在递归调用之后「撤销选择」。

#### 【46】全排列

##### 思路

1. 全排列穷举，以开头为索引起点，递归列举每个起点开始的所有排列情况，遇到自己则忽略，按照以上的技巧来答题；\
2. 具体来说就是执行一次深度优先遍历，从树的根结点到叶子结点形成的路径就是一个全排列。

![全排列](./全排列.png)

##### 题解

```javascript
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

  // 路径：记录在 track 中
  var backtrack = function (nums, track = [], result) {
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
      backtrack(nums, track);
      // 尾数出栈，继续当前遍历
      track.pop();
    }
  };

  var result = [],
    track = [];
  backtrack(nums, track, result);
  return result;
};
```

##### 复杂度分析

1. 时间复杂度：`O(n * n!)`，其中 `n` 为序列的长度。
2. 空间复杂度：`O(n)`，其中 `n` 为序列的长度。除答案数组以外，递归函数在递归过程中需要为每一层递归函数分配栈空间，所以这里需要额外的空间且该空间取决于递归的深度，这里可知递归调用深度为 `O(n)`。

#### 【47】全排列 II

##### 思路

1. 这道题是上题的变体，增加了可重复数字的排列，因此再全排列过程中需要进行剪枝去重；
2. 剪枝的前提条件便是：当前索引的值是否已经入栈；当前索引值与前一个索引值相等并且已经使用过则跳过，此条件需要序列进行前置排序，不然就无法匹配到相邻的重复值了；

![](./全排列2.png)

##### 题解

```javascript
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

  var result = [],
    track = [],
    used = {};

  // 排序是剪枝的必要操作
  // 为了判断相邻的重复数据是否达到剪枝条件
  nums.sort();

  var backtrack = function (nums, track, used, depth) {
    if (depth === nums.length) {
      // 符合规则的数组入栈
      result.push(track.slice(0));
      return;
    }

    for (var i = 0; i < nums.length; i++) {
      // 使用过则跳出
      if (used[i]) continue;

      // 剪枝 保证 nums[i - 1] 有意义
      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue;

      track.push(nums[i]);
      // 标记索引 i 使用过
      used[i] = true;
      // 递归排列
      backtrack(nums, track, used, depth + 1);
      // 标记使用完毕
      used[i] = false;
      // 出栈，继续循环排列
      track.pop();
    }
  };

  backtrack(nums, track, used, 0);
  return result;
};
//leetcode submit region end(Prohibit modification and deletion)
```

##### 复杂度

1. 时间复杂度：`O(n * n!)`，这里 `n` 为数组的长度。
2. 空间复杂度：`O(n * n!)`。
