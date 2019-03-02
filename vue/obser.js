// 最近开发一个微信小程序，在小程序启动时和我方的服务端建立wss长连接，并监听推送到小程序里的消息。
// 有些消息是A页面关心的，有些消息是B页面关心的，将来可能会有C页面只关心少量消息类型。wx.onSocketMessage()方法该如何写呢？
// 自然而然地想到发布/订阅模式。
var publishSubscribeEvent = {
 
    /* 
     * 缓存列表
     * clientList: {
     *    key: [
     *        id: <int>,        // 唯一标识
     *        fn: null          // 存放回调函数
     *    ]
     * }
     * 
     */
    clientList: {
		
	},
    
    /* 
     * 添加订阅者(订阅函数)，将订阅的类型与回调函数加入缓存列表
     * key: 消息的类型
     * id: 订阅的唯一标识
     * fn: 订阅的回调函数
     */
    listen: function(key, id, fn) {
        if(!this.clientList[key]) {            
            this.clientList[key] = []
        }
       
        this.clientList[key].push({            
            id: id,                         
            fn: fn                          
        })
    },
    
    // 发布消息（发布函数）, 依次通知订阅者
    trigger: function () {
        var key = Array.prototype.shift.call(arguments),
            fns = this.clientList[key];
        
        if(!fns || fns.length == 0) {
            return false;                                   
        }
        
        for(var i = 0; i< fns.length; i++) {
             fns[i].fn.apply(this, arguments);
        }
    },
	
	remove: function(key, id) {
		var fns = this.clientList[key];
		
		if(!fns) {                // 如果key对应的消息没人订阅，直接返回
			return false;
		}
		
		if(!id) {                // 如果没传具体的唯一标识，则取消key的所有对应消息
			fns && (fns.length = 0);
		} else {
			for(var l = fns.length - 1; l >=0; l--) {
				var _id = fns[l].id;
				if(_id == id) {
					fns.splice(l, 1);    // 删除订阅者的回调函数
				}
			}
		}
    }
}
 
var installPublishSubscribeEvent = function(obj) {
	// 把publishSubscribeEvent的十八般武艺都传给obj
    for(var i in publishSubscribeEvent) {
        obj[i] = publishSubscribeEvent[i];
    }
}
 
// 测试代码
var sgArticleSystem = {};
 
installPublishSubscribeEvent(sgArticleSystem ); 
 
// 张三的订阅
sgArticleSystem.listen('articleA', 3, function(articleTitle, content) { 
    console.log('张三您在早前订阅了文章：articleA');
    console.log('现《' + articleTitle+ '》有了新动态');
    console.log('内容为：' + content);
});
 
sgArticleSystem.listen('articleB', 3, function(articleTitle, content) { 
    console.log('张三您在早前订阅了文章：articleB');
    console.log('现《' + articleTitle+ '》有了新动态');
    console.log('内容为：' + content);
});
 
// 李四的订阅
sgArticleSystem.listen('articleA', 4, function(articleTitle, content) { 
    console.log('李四您在早前订阅了文章：articleA');
    console.log('现《' + articleTitle+ '》有了新动态');
    console.log('内容为：' + content);
});
sgArticleSystem.listen('articleB', 4, function(articleTitle, content) { 
    console.log('李四您在早前订阅了文章：articleB');
    console.log('现《' + articleTitle+ '》有了新动态');
    console.log('内容为：' + content);
});
 
// 文章系统发布消息
sgArticleSystem.trigger('articleA', '肖申克的救赎', '梦想是关不住的');
sgArticleSystem.trigger('articleB', '勇敢的心', 'Freedom');
 
sgArticleSystem.remove('articleA', 3);    // 删除张三的订阅
console.log('###### 删除张三articleA对的订阅');
 
sgArticleSystem.trigger('articleA', '肖申克的救赎', '梦想是关不住的');


// 观察者模式
