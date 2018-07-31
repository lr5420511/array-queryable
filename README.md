# array-queryable
一个链式调用，用于处理集合的工具。并且支持插件（新的命令和功能）的注入。对于处理复杂的集合操作非常有用，大家一起来丰富它的功能吧！
本工具对于使用orm框架查询返回的实体集合，再进行特定场景下的业务处理，将非常有用。


**以下描述的'数据'不仅仅只是简单的值类型数据, 它可以是任意数据结构的数据;**

   

> 工具初始支持功能：1,数据源的合并; 2,数据筛选; 3,数据映射;
> 
> 原生插件提供了功能：1,数据分组; 2,数据分组筛选; 3,数据排序;


**Usage:**
  
 1. 将会查询第三组数据源中值为true;
 2. 根据第一组数据源和第二组数据源的值分组;
 3. 并把结果映射为[groupName, groups.length]结构;
 4. 然后对groupName和groups.length降序的结果;
 5. 最终输出 [[5,5], [4,5], [3,5], [2,5], [1,5]]。
 
 > query()
 > .from([1,2,3,4,5],['a','b','c','d','e'],[true,false])
 > .where(cur => cur[2])
 > .groupby(cur => cur[0], cur => cur[1])
 > .select(cur => [cur[0], cur[1].length])
 > .orderby((prev, cur) => cur[0] > prev[0] || cur[1] > prev[1])
 > .execute();
          

传统做法对比：


