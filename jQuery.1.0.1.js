(function (root) {
  var jQuery = function () {
    return new jQuery.prototype.init(); // this.init()
  }

  jQuery.fn = jQuery.prototype = {
    init: function () {

    }
  }

  jQuery.fn.extend = jQuery.extend = function () {
    var target = arguments[0] || {}; // 第一个参数是被扩展的对象, 因此一定要是一个对象, 如果不是的话就创建一个对象
    var length = arguments.length;
    var deep = false;
    var i = 1; // i 表示的是arguments的下标, 那为什么初始值设置为1呢? 因为第0参数是被扩展的对象, 我们不需要遍历, 如果直接写0的话, 下面处理的时候还要每次把第0个参数忽略掉
    var option, name, copy, src, copyIsArray, clone;

    if (typeof target === 'boolean') { // 如果第0个参数为true(只有为true时这里才会成立, 为false的话target直接为{}, 然后走后面的逻辑), 那么第1个参数才是要被扩展的对象, 且遍历是从i+1开始的
      deep = target;
      target = arguments[1];
      i = 2;
    }
    if (typeof target !== 'object') { // 不能百分百保证第一个参数一定是一个对象, 因此需要再次判断
      target = {};
    }
    if (length === i) { // 如果参数个数为1, 可以判定是要扩展jQuery(插件)或扩展jQuery实例对象, 也就是当前的this(jQuery或jQuery.fn), 那么需要遍历的就是第0个参数, 也就是将第0个对象扩展到jQuery或jQuery.fn上
      target = this;
      i--;
    }

    // 深,浅拷贝
    for (; i < length; i++) {
      if (option = arguments[i]) { // 获取参数对象
        for (name in option) {
          copy = option[name];
          src = target[name];

          if (deep && (jQuery.isObject(copy) || (copyIsArray = jQuery.isArray(copy)))) { // 深拷贝, 有疑问, 为什么不直接使用this?
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && jQuery.isArray(src) ? src : [];
            } else {
              clone = src && jQuery.isObject(src) ? src : {};
            }
            target[name] = jQuery.extend(deep, clone, copy);
          } else if (copy) { // 浅拷贝, 直接赋值即可
            target[name] = copy;
          }
        }
      }
    }

    return target;
  }

  // 实现共享原型
  jQuery.fn.init.prototype = jQuery.fn;

  jQuery.extend({
    isObject: function (obj) {
      return toString.call(obj) === '[object Object]';
    },
    isArray: function (obj) {
      return toString.call(obj) === '[object Array]';
    }
  })

  root.$ = root.jQuery = jQuery;

})(this);
