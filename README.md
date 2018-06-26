# Vue2 脚手架

在 [Vue Demo](https://github.com/kenberkeley/vue-demo) 的 [issues](https://github.com/kenberkeley/vue-demo/issues) 中，最常问的就是有没有升级 Vue 2.x 的计划   
说实话，一直以来我都对 Vue 2.x “跪舔” React 嗤之以鼻，因此之前我并没有打算折腾

Vue 2.x 阉割掉了很多相当有用的特性，还动不动就扯“状态管理”  
的确是让我大失所望，因此这几个月以来我都是坚守 Vue 1.x

> 有关这个问题，不妨看看 Vue.js 官方示例：  
> **Markdown Editor Example** [1.x 版本](http://v1.vuejs.org/examples/) | [2.x 版本](https://cn.vuejs.org/v2/examples/)  
> 相信您会更加直观地体会到 Vue 1.x 的魅力所在

各大论坛上看到很多刚入门的新童鞋在人云亦云的情况下捣弄 [Flux](https://github.com/facebook/flux) / [Redux](https://github.com/reactjs/redux) / [Vuex](https://github.com/vuejs/vuex)  
就像是拿着屠龙刀切水果，这在一定程度上，是使用者比较累，且水果也未必切得好看

当然，比起 React 社区，Vue 的全家桶已经是相当轻量  
尤其是看到了 [MobX](https://github.com/mobxjs/mobx) 的盛行，更让我意识到**组件化状态自包含**才是正道  
谈及**全局**状态管理，在实际项目中我更倾向于使用 **根组件** 或者 **URL**

> URL 本身就是一个全局的状态容器，详见 Vue Demo 文档：[URL 是单页应用的精华](https://kenberkeley.github.io/vue-demo/dist/docs/zh-cn/development/URL-is-soul-of-SPA.html)

让我着手折腾 Vue2 脚手架的，是最近的一次独立组件重构经历

***

在重构 [DataTable](https://github.com/kenberkeley/vue-datatable-component) 组件的过程中，我守旧的观念开始发生转变  
尤其是通过 `.sync` 传递的 `props` 层数越深，就觉得越发**不可控**  
当然，如果是按照之前的思路，使用**根组件**来存储共用的状态  
子孙组件直接使用 ~~`$root`~~ `$parent` 获取与**修改**数据，也是完全可行的，但这并非最佳实践  
而在独立封装的组件中引入 Vuex 又并不合适（详见 [滴滴 webapp 5.0 Vue 2.0 重构经验分享](https://github.com/DDFE/DDFE-blog/issues/13) 第 2 点）  
因此只能另辟蹊径...

经过一番查阅，我了解到一种另类的状态管理思路，并整理到了[这里](https://github.com/kenberkeley/vue-state-management-alternative)  
原理很简单，就是通过 **“闭包 + 共享 `data`”** 的方式实现阉割版的 Vuex  
这让我初步尝到了统一状态管理的甜头，也理解究竟什么时候才该用统一的状态管理

虽然我写出了 [Redux 简明教程](https://github.com/kenberkeley/redux-simple-tutorial)，但我从未在实际项目中用过  
皆因我不见得究竟是多大的项目才需要用到这种繁冗的状态管理  
（除非您需要如 *[You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)* 文中提到的使用 Redux 的优势）  
我更倾向于后端流行的微服务模式，一个大的项目可以拆分成若干个子项目  
而对于前端而言也该是如此：各组件内部状态自维护，使用与卸载无副作用，不掺杂全局，分而治之  
（上面的 滴滴 webapp 5.0 Vue 2.0 重构经验分享 第 1 点也有相关的拆分讨论）

既然已经折腾出另类的组件内部的状态管理方式，而且 Vue 2.x 又已大势所趋，那就折腾吧！

***

扯了那么多，该说说这个 Vue2 脚手架和之前 Vue Demo 的差别了  
总体而言，差异很小，基本上就是把 Vue 1.x 的语法换成 Vue 2.x  
因此升级的代价相当小，文档完全照搬 Vue Demo 的[文档](https://kenberkeley.github.io/vue-demo/dist/docs/)  
**对于新用户，强烈建议先通览文档后，再使用该脚手架进行开发**

> 开发前请通读 [Vue 2.x 文档](https://cn.vuejs.org/v2/guide) 与 [vue-router 2.x 文档](https://router.vuejs.org/zh-cn/index.html)，尤其是 [从 Vue 1.x 迁移](https://cn.vuejs.org/v2/guide/migration.html) 一章

***

最后说说为什么不使用官方的 [`vue-cli`](https://github.com/vuejs/vue-cli)，而自己折腾一套脚手架  
首先不得不承认，这是参考自官方的 [vuejs-templates/webpack](https://github.com/vuejs-templates/webpack) 模板  
改造初衷是这套官方模板与 Vue.js 的**优雅哲学**格格不入，一看它的 [`build/`](https://github.com/vuejs-templates/webpack/tree/master/template/build) 目录基本上就不想用了    
官方意欲极力避免用户折腾配置（开箱即用），特意另开了 [`config/`](https://github.com/vuejs-templates/webpack/tree/master/template/config)，但这就使得配置项变得更加不直观

但无论如何，**用户得学会自己走路，自己踩坑，自己折腾**，你只需要提供一个**直观的高可拓展性**的脚手架即可  
我所能做的，就是极力提供一目了然的 Webpack 配置目录与常规的 `package.json`  
之后就让用户**按需折腾**，而不是一上来就把一条龙的测试框架都堆上来

当然，`vue-cli` 并不是一无是处，使用它的 [`vue build`](https://github.com/vuejs/vue-cli/blob/master/docs/build.md) 来快速开发独立组件还是相当爽快的  
（上面提到的 [Vue 另类状态管理](https://github.com/kenberkeley/vue-state-management-alternative) 就用到了 `vue build`）

***

最后的最后，祝您玩得愉快吧！
