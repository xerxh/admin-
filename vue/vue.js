class Vue {
    // 进行数据初始化操作
    constructor (options = {}) {
        this.$el = document.querySelector(options.el);
        let data = this.data = options;
        // 代理data 使其能直接使用this.xx方式访问data 正常需要this.data.xx
        Object.keys(data).forEach((key) => {
            this.$el.proxyData(key);
        });
        // 事件方法
        this.methods = obj.methods; // 事件方法
        //  需要监听的任务列表
        this.watcherTask = {};
        // 初始化劫持所有数据 
        this.observer(data);
        // 解析dom结构
        this.$el.compile(this.$el)
    }

    // 代理函数 定义上get set 方法
    peoxyData(key) {
        let that = this;
        Object.defineProperty(that, key, {
            configurable: false, // 不允许 修改
            enumerable: true,
            get() {
                return that.data[key];
            },
            set (newVal) {
                that.data[key] = newVal;
            }
        })
    }

    // 进行劫持监听
    observer (data) {
        let that = this
        Object.keys(data).forEach(key => {
            let value = data[key];
            this.watcherTask[key] = [];
            Object.defineProperty(data, key, {
                configurable: false,
                enumerable: true,
                get () {
                    return value;
                },
                set (newVal) {
                    // 如果数值发生变化
                    if(newVal !== value) {
                        value = newVal;
                        that.watcherTask[key].forEach(task => {
                            // 更新视图
                            task.updata()
                        })
                    }
                }
            })
        })
    }

    // 解析dom节点元素
    compile(el) {
        var nodes = el.childNodes;
        for(let i = 0; i < nodes.length; i++) {
            const node = modes[i];
            // nodeType 
            // 元素节点 element 1
            // 属性节点 attr    2
            // 文本节点 代表元素或属性中的文本内容。 3
            if(node.nodeType === 3) {  // 元素内文本内容
                var text = node.textContent.trim()
                if(!text) continue  // 跳过本次循环体中余下尚未执行的语句，立即进行下一次的循环条件判定
                // 进行文本编译
                this.compileText(node, 'textContent')
            }else if (node.nodeType === 1) {// 元素节点 有可能有子节点
                // 先判断是否有子节点  
                if(node.childNodes.length > 0) {
                    // 进行递归解析
                    this.compile(node)
                }
                // 只能对input表单 textarea表单 元素进行双向数据绑定
                if(node.hasAttribute('v-model') && (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA')){
                    // 给表单添加事件
                    node.addEventListener('input', (() => {
                        // 获取属性值
                        let attrVal = node.getAttribute('v-model')
                        // 添加到监听队列
                        this.watcherTask[attrVal].push(new Watcher(node, this, attrval, 'value'))
                        // 移除v-model属性
                        node.removeAttribute('v-model')
                        return () => {
                            this.data[attrVal] = node.value
                        }
                    })())
                }
                // 如果带有标记属性
                //判断node节点上是否有v-html这种指令，如果存在的话，
                // 我们就发布订阅，怎么发布订阅呢？只需要把当前需要订阅的数据push到watcherTask里面，
                // 然后到时候在设置值的时候就可以批量更新了，实现双向数据绑定
                if(node.hasAttribute('v-html')) {
                    let attrVal = node.getAttribute('v-html')
                    this.watcherTask[attrval].push(new Watcher(node, this, attrVal, 'innerHtml'))
                    node.removeAttribute('v-html')
                }
                this,compileText(node, 'innerHtml')
                // 如果是事件绑定
                if(node.hasAttribute('@click')) {
                    // 获取事件名称
                    let attrVal = node.getAttribute('@click')
                    node.removeAttribute('@click')
                    // 绑定所传的数据
                    node.addEventListener('click', e => {
                        // 找到事件并执行 并将this绑定
                        this.methods[attrVal] && this.$el.methods[attrVal].bind(this)()
                    })
                }
            }
        }
    }

    // 解析文本内容  双花括号的内容
    compileText(node, type) {
        // 正则匹配出双花括号中的内容
        let reg = /\{\{(.*)\}\}/g
        let text = node.textContent
        // 如果有双花括号传值
        if(reg.test(text)){
            node.textContent = text.replace(reg, (matched, value) => {
                let tpl = this.watcherTask[value] || []
                tpl.push(new watcher(node, this, value, type))
                return value.split('.').reduce((val, key) => {
                    return this.data[key]
                }, this.$el)
            })
        }
    }
}

// 订阅方法
class Watcher{
    constructor(el, vm, value, type) {
        this.el = el
        // 保存原来的 this
        this.vm = vm
        this.value = value 
        this.type = type
    }
    // 更新
    updata() {
        this.el[this.el.type] = this.vm.data[this.value]
    }
}