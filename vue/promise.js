function Promise(callback) {
    var that = this
    // pending/reslove/reject 
    // pending就是初始状态，resolve可以理解为成功fulfilled，reject可以理解为拒绝rejected
    that.status = 'pending' // promise当前的状态
    that.data =undefined // Promise的值
    that.onResolvedCallback = [] // Promise resolve时的回调函数集合
    that.onRejectedCallback = [] // Promise reject 时的回调函数集合
    callback(resolve, reject)

    function reslove(value) {
        if(that.status == 'pending') {
            that.status = 'fulfilled'
            that.data = value
            for(var i = 0; i < that.onResolvedCallback.length; i++) {
                that.onRejectedCallback[i](value)
            }
        }
    }

    function reject(error) {
      
        if(that.status == 'pending') {
            that.status = 'rejected'
            that.data = console.error;
            for(var i = 0; i < that.onRejectedCallback.length; i++) {
                that.onRejectedCallback[i](error)
            } 
        }
    }
}

// 添加then方法
Promise.prototype.then = function(onResolved, onRejected) {
    var self = this
    var promise2
    // 根据promise标准，如果then的参数不是function，我们需要进行省略
    onResolved = typeof onResolved === 'function' ? onResolved : function(value){}
    onRejected = typeof onRejected === 'function' ? onRejected : function(reason){}

    if(self.status === 'resolved'){
        // 如果promise1此时的状态已经确定为resolved
        // 因为考虑到有可能throw，所以将其包在try/catch块里
        return promise2 = new Promise((resolve, reject) => {
            try {
                var x = onResolved(self.data)
                if(x instanceof Promise){ 
                // 如果onResolved的返回值是一个Promise对象，直接取它的结果作为promise结果
                    x.then(resolve, reject)
                }else{// 否则将它的结果作为promise2的结果
                    resolve(x)
                }
            } catch (e) {
                // 如果出错，以获到的错误做为promise2的结果
                reject(e)
            }
        })
    }

    if(self.status === 'rejected'){
        // 如果promise1此时的状态已经确定为resolved
        // 因为考虑到有可能throw，所以将其包在try/catch块里
        return promise2 = new Promise((resolve, reject) => {
            try {
                var x = onRejected(self.data)
                if(x instanceof Promise){ 
                // 如果onResolved的返回值是一个Promise对象，直接取它的结果作为promise结果
                    x.then(resolve, reject)
                }else{// 否则将它的结果作为promise2的结果
                    reject(x)
                }
            } catch (e) {
                // 如果出错，以获到的错误做为promise2的结果
                reject(e)
            }
        }) 
    }

    if(self.status == 'pending'){
        // 如果当前的promise还处于pending的状态，我们此时并不能确定调用onResolve还是onRejected
        // 只有等到Promise的状态确定后，才能确定后续处理
        // 所以把需要我们处理的两种情况的处理逻辑作为callback放入promise1的回调数组中
        return Promise2 = new Promise((resolve, reject) => {
            self.onResolvedCallback.push(function(value){
                try {
                    var x = onResolved(self.data)
                    if(x instanceof Promise){
                        x.then(resolve, reject)
                    }
                } catch (e) {
                    reject(e)
                }
            })

            self.onResolvedCallback.push(function(reason){
                try {
                    var x = onRejected(self.data)
                    if(x instanceof Promise){
                        x.then(resolve, reject)
                    }
                } catch (e) {
                    reject(e)
                }
            })
        })
    }
}

// 实现catch方法
Promise.prototype.catch = function(onRejected){
    return this.then(null, onRejected)
}




function isFunction(handle){
    return handle instanceof Function
}
// Class Promise
class myPromise {
    constructor(handle){
        if(!isFunction(handle)){
            throw new Error('myPromise must accept a function as a parameter')
        }
        // 添加状态
        this._status = 'pending'
        // 添加值
        this._value = undefined
        // 添加成功回调函数队列
        this._fulfilledQueues = []
        // 添加失败回调函数队列
        this._rejectedQueues = []
        // 执行传入的回调函数
        try {
            handle(this._resolve.bind(this), this._reject.bind(this))
        } catch (error) {
            this._reject(error)
        }
    }
    // 添加then方法
    then(onFulfilled, onRejected){
        const {_value, _status} = this
        // 返回一个新的promise对象
        return new myPromise((onFulfilledNext, onRejectedNext) => {
            // 封装一个成功时执行的函数
            let fulfilled = value => {
                try {
                    if(!isFunction(onFulfilled)){
                        onFulfilledNext(value)
                    }else{
                        let res = onFulfilled(value)
                        // 如果返回的是promise对象 必须等其状态改变后才执行回调
                        if(res instanceof myPromise){
                            res.then(onFulfilledNext, onRejectedNext)
                        }else{
                        // 否则直接将结果作为参数传入下一个then的回调函数中
                            onFulfilledNext(res)
                        }
                    }
                } catch (error) {
                    // 如果出错将新的promise对象的状态改为失败
                    onRejectedNext(err)
                }
            }

            // 封装一个失败时执行函数
            let rejected = value => {
                try {
                    if(!isFunction(onRejected)){
                        onRejectedNext(value)
                    }else{
                        let res = onRejected(value)
                        // 如果返回的是promise对象 必须等其状态改变后才执行回调
                        if(res instanceof myPromise){
                            res.then(onFulfilledNext, onRejectedNext)
                        }else{
                        // 否则将会返回结果作为直接参数传入下一个then的回调函数中，并执行下一个then的回调函数
                            onFulfilledNext(res)    
                        }
                    }
                } catch (error) {
                    // 如果函数出错新的promise对象的状态为失败
                    onRejectedNext(error)
                }
            }
            switch (_status) {
                // 当状态为pending时，将then方法回调函数加入执行队列等待执行
                case 'pending':
                  this._fulfilledQueues.push(fulfilled)
                  this._rejectedQueues.push(rejected)
                  break
                // 当状态已经改变时，立即执行对应的回调函数
                case 'fulfilled':
                  fulfilled(_value)
                  break
                case 'rejected':
                  rejected(_value)
                  break
              }
        })
    }
    // 添加resolve执行函数
    _resolve(val) {
        // 依次执行成功队列中的函数，并清空队列
        const run = () => {
            if(this._status == 'pending'){
                // this._status = 'fulfilled'
                // this._value = val
                const runFulfilled = (value) => {
                    let cb
                    while (cb = this._fulfilledQueues.shift()) {
                        cb(value)
                    }
                }
                const runRejected = (error) => {
                    let cb
                    while(cb = this._rejectedQueues.shift()){
                        cb(error)
                    }
                }
                /* 如果resolve的参数为Promise对象，则必须等待该Promise对象状态改变后,
                    当前Promsie的状态才会改变，且状态取决于参数Promsie对象的状态
                */
               if(val instanceof myPromise){
                   val.then(value => {
                       this._value = value
                       this._status = 'fulfilled'
                       runFulfilled(value)
                   },err => {
                       this._value = err
                       this._status = 'rejected'
                       runRejected(err)
                   })
               }else{
                   this._value = val
                   this._status = 'fulfilled'
                   runFulfilled(val)
               }
            } 
            // 为了支持同步的promise，这里采用异步调用
            setTimeout(() => run(), 0)
        }

    }
    // 添加reject时执行的函数
    _reject(err){
        if(this._status == 'pending'){
            const run = () => {
                this._status = 'rejected'
                this._value = err
                let cb
                while(cb = this._rejectedQueues.shift()){
                    cb(err)
                }
            }
            setTimeout(run,0)
        }
    }
    // catch方法
    catch(onRejected){
        return this.then(undefined, onRejected)
    }

    // 添加静态方法
    static reslove(value){
        // 如果参数是myPromise实例，直接返回这个实例
        if(value instanceof myPromise) return value
        return new myPromise(resolve => resolve(value))
    }
    // 添加静态reject方法
    static reject(value){
        return new myPromise((resolve, reject) => reject(value))
    }
    // 静态all方法
    static all(list){
        return new myPromise((resolve, reject) => {
            // 返回值的集合
            let values = []
            let count = 0
            for(let [i, p] of list.entries()){
                // 数组参数如果不是myPromise实例，先调用myPromise。resolve
                this.reslove(p)
                    .then(res => {
                        values[i] = res
                        count++
                        // 所有状态都变成fulfilled时返回myPromise的状态便变成fulfilled
                        if(count === list.length) resolve(values)
                    }, err => {
                        // 有一个被rejected时返回的myPromise状态变成rejected
                        reject(err)
                    })
            }
        })
    }
    // 静态race方法
    static race(list){
        return new myPromise((resolve, reject) => {
            for(let p of list){
                // 只要有一个实例先改变状态,新的myPromise状态就改变
                this.reslove(p)
                    .then(res => {
                        resolve(res)
                    }, err => {
                        reject(err)
                    })
            }
        })
    }
    // finally方法 用于指定不管Promise对象最后的状态如何，都会执行的操作
    finally(cb){
        return this.then(
            value => myPromise.reslove(cb()).then(() => value),
            reason => myPromise.reslove(cb()).then(() => {throw reason})
        )
    }

}
// 示例Promise规则
// 1、如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行下面的 Promise 解决过程：[[Resolve]](promise2, x)

// 若 x 不为 Promise ，则使 x 直接作为新返回的 Promise 对象的值， 即新的onFulfilled 或者 onRejected 函数的参数.
// 若 x 为 Promise ，这时后一个回调函数，就会等待该 Promise 对象(即 x )的状态发生变化，才会被调用，并且新的 Promise 状态和 x 的状态相同。

let promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve()
  }, 1000)
})
promise2 = promise1.then(res => {
  // 返回一个普通值
  return '这里返回一个普通值'
})
promise2.then(res => {
  console.log(res) //1秒后打印出：这里返回一个普通值
})
let promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve()
  }, 1000)
})
promise2 = promise1.then(res => {
  // 返回一个Promise对象
  return new Promise((resolve, reject) => {
    setTimeout(() => {
     resolve('这里返回一个Promise')
    }, 2000)
  })
})
promise2.then(res => {
  console.log(res) //3秒后打印出：这里返回一个Promise
})
// 2、如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须变为失败（Rejected），并返回失败的值 e

let promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 1000)
})
promise2 = promise1.then(res => {
  throw new Error('这里抛出一个异常e')
})
promise2.then(res => {
  console.log(res)
}, err => {
  console.log(err) //1秒后打印出：这里抛出一个异常e
})
// 3、如果 onFulfilled 不是函数且 promise1 状态为成功（Fulfilled）， promise2 必须变为成功（Fulfilled）并返回 promise1 成功的值。

let promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 1000)
})
promise2 = promise1.then('这里的onFulfilled本来是一个函数，但现在不是')
promise2.then(res => {
  console.log(res) // 1秒后打印出：success
}, err => {
  console.log(err)
})
// 4、如果 onRejected 不是函数且 promise1 状态为失败（Rejected），promise2 必须变为失败（Rejected） 并返回 promise1 失败的值

let promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('fail')
  }, 1000)
})
promise2 = promise1.then(res => res, '这里的onRejected本来是一个函数，但现在不是')
promise2.then(res => {
  console.log(res)
}, err => {
  console.log(err)  // 1秒后打印出：fail
})
