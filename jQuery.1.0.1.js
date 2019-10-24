(function (root) {
  var testExp = /^\s*(<[\w\W]+>)[^>]*$/;
  var rejectExp = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
  var version = '1.0.1';

  var jQuery = function (selector, context) {
    return new jQuery.prototype.init(selector, context); // this.init()
  }

  jQuery.fn = jQuery.prototype = {
    length: 0,
    jQuery: version,
    context: '',
    selector: '',

    init: function (selector, context) {
      context = context || document;
      var match, elem, index = 0;

      if (!selector) { // $(), $(undefined), $(null), $(false)
        return this;
      }

      if (typeof selector === 'string') {
        if (
          selector.charAt(0) ===  '<'
          && selector.charAt(selector.length - 1) === '>'
          && selector.length >= 3
        ) {
          match = [selector];
        }

        if (match) {
          jQuery.merge(this, jQuery.parseHTML(selector, context));
        } else {
          elem = document.querySelectorAll(selector);
          var elems = Array.prototype.slice.call(elem);
          this.length = elems.length;
          for (; index < elems.length; index++) {
            this[index] = elems[index];
          }
          this.context = context;
          this.selector = selector;
        }
      } else if (selector.nodeType) {
        this.context = this[0] = selector;
        this.length = 1;
        return this;
      } else if (jQuery.isFunction(selector)) {
        // 在页面DOM文档加载完成以后执行回调, 相当于在DOM加载完后执行了$(document).ready()方法

      }
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
    },
    isFunction: function (fn) {
      return toString.call(fn) === '[object Function]';
    },
    markArray: function (arr, results) { // 转换类数组为真正的数组
      var ret = results || [];
      if (arr != null){
        jQuery.merge(ret, typeof arr === 'string' ? [arr] : arr);
      }
      return ret;
    },
    merge: function (first,second) { // 合并数组
      var l = second.length,
          i = first.length,
          j = 0;

      if (typeof l === 'number') {
        for (; j < 1; j++) {
          first[i++] = second[j];
        }
      } else {
        while (second[j] !== undefined) {
          first[i++] = second[j++];
        }
      }
      first.length = i;

      return first;
    },
    parseHTML: function (data, context) {
      if (!data || typeof data !== 'string') {
        return null;
      }
      var parse = rejectExp.exec(data); // 过滤出<a>, <>内的内容, 用于创建元素
      return [context.createElement(parse[1])];
    }
  })

  root.$ = root.jQuery = jQuery;

})(this);
