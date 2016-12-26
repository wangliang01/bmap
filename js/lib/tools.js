define([],function(){

	//判断对象是否为空
	function isEmptyObject(e) {
	    var t;
	    for (t in e)
	        return !1;
	    return !0
	}
	//从URL中取参数
	function I(name) {
	    var def;  //默认值
	    if (typeof(arguments[1]) == "undefined") {
	        def = '';
	    } else {
	        def = arguments[1];
	    }
	    var param = window.location.search;  //URL参数
	    if (param == '') {
	        return def;
	    }
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	    var r = param.substr(1).match(reg);
	    if (r == null) {
	        return def;
	    }
	    return (decodeURIComponent(r[2]));
	}
	//点击函数
    function clickedFunc(obj, fn) {
        obj.onclick = fn;
    }




	//将方法存于对象中
	var tools = {
			'isEmptyObject': isEmptyObject, //简单判断对象是否为空
			'I': I, //获取Url中?后边的参数
			'clickedFunc': clickedFunc //点击函数
		};
		// console.log(tools);
		return $$ = tools;
});
