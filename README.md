# array-queryable #
  一个链式调用，用于处理集合的工具。并且支持插件（新的命令和功能）的注入。对于处理复杂的集合操作非常有用，大家一起来丰富它的功能吧！
本工具对于使用orm框架查询返回的实体集合，再进行特定场景下的业务处理，将非常有用。


### 以下描述的'数据'不仅仅只是简单的值类型数据, 它可以是任意数据结构的数据; ###

工具初始支持功能：

  + 数据源的合并
  + 数据筛选
  + 数据映射
 
原生插件提供了功能：

  + 数据分组 
  + 数据分组筛选 
  + 数据排序

新增原生插件提供功能：
  
  + 数据定位
  + 数据分段截取

------

#### 基本用法: ####
       //安装 npm install array-queryable --save-dev
  
       const query = require('array-queryable');
       
       //初始化一个查询活动
       query();

       //获取数据源，数据源可以是多个(原生功能)
       query().from([...sources]);

       query().from([1, 2, 3, 4, 5], [true, false])
              .execute();
       
       //筛选，可接受多个回调函数，回调函数之间等价于or，多个where串联等价于and(原生功能)
       query().from([...sources]).where([...callbacks])[.where];

       query().from([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])
              .where(cur => cur < 4, cur => cur > 7)
              .where(cur => cur % 2)
              .execute();
 
       //映射，可接受多个回调函数(原生功能)
       query().from([...sources]).select([...callbacks]);

       query().from([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])
              .select((cur, i) => i, cur => cur + 2)
              .execute();

       //分组, 可接受多个回调函数(插件提供功能)
       query().from([...sources]).groupby([...callbacks]);

       query().from([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])
              .groupby(cur => cur ? (cur % 2 ? 'odd' : 'even') : 'zero', cur => cur >= 5 ? '>=5' : '<5')
              .execute();

       //分组筛选，可接受多个回调函数，回调函数之间等价于or，多个having串联等价于and(插件提供功能)
       query().from([...sources]).groupby([...callbacks]).having([...callbacks])[.haing([...callbacks])];

       query().from([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])
              .groupby(cur => cur ? (cur % 2 ? 'odd' : 'even') : 'zero', cur => cur >= 5 ? '>=5' : '<5')
              .having(cur => cur[0] === 'odd', cur => cur[0] === 'zero')
              .execute();

       //排序，可接受多个回调函数(插件提供功能)
       query().from([...sources]).orderby([...callbacks]);
       
       query().from([1, 1, 2, 2, 3, 4, 5, 5, 5], [7, 3, 0, 4, 9, 8, 6, 6, 4])
              .orderby((prev, cur) => prev[0] < cur[0], (prev, cur) => prev[0] === cur[0] && prev[1] < cur[1])
              .execute();

       //定位，可接受多个回调函数(插件提供功能)
       query().from([...sources]).at([...callbacks]);

       query().from([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])
              .at((cur, i, ar) => i === ar.length - 1)
              .execute(); //last
       
       query().from([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])
              .at()
              .execute(); //first

       //分段截取(skip从左到右，take从右到左)，可接受多个回调函数(插件提供功能)
       query().from([...sources]).take([...callbacks]).skip([...callbacks]);

       query().from([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])
              .skip((cur, i) => i >= 1, cur => cur % 2)
              .take((cur, i) => i <= 8, cur => !(cur % 2))
              .execute();

------

#### 插件的写法： ####

工具可以随时拓展功能，只需要编写满足需求的插件，然后安装该插件就可以使用了

       //新增模块
       module.exports = function XXXXX(Queryable) {
         //第一步：注册新命令
         Queryable.prototype.[command] = function() {
         //注入外部指令
         };

         /**
         * 
         * 第二步：注入新功能代码片段到运行时中，Queryable提供了三个运行时刻可以注入。
         *
         * T_0时刻：注入该时刻的代码片段将在数据源合并完成之后，数据筛选开始之前执行。
         * T_1时刻：注入该时刻的代码片段将在数据筛选完成之后，数据映射开始之前执行。
         * T_2时刻：注入该时刻的代码片段将在数据映射完成之后，查询完成之前执行。
         *
         */
         Queryable.preset.[runtime].push((ctx, res) => {
         //新功能代码片段
         });
       };



