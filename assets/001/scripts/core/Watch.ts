/**
 * 监听属性
 * @param target 监听对象
 * @param propertyKey 监听属性键
 * @param callback 回调
 * @param thisArg 对象
 */
function watchProperty<T = any>(target: any, propertyKey: string, callback: (newValue: T, oldValve: T) => any, thisArg?: any) {
    // 有效性检查
    if (!isObject(target) || (typeof callback !== 'function')) {
        return;
    }
    // 属性未定义
    if (!target.hasOwnProperty(propertyKey)) {
        console.log('[watch]', '属性未定义！', propertyKey);
        return;
    }
    // 创建观察者列表
    let watchers: [Function, any][] = target[`__${propertyKey}_watchers`];
    if (!watchers) {
        // 初始化观察者列表
        watchers = target[`__${propertyKey}_watchers`] = [];
        // 另存原始值
        target[`__${propertyKey}`] = target[propertyKey];
        // 转为属性
        Object.defineProperty(target, propertyKey, {
            get() {
                return target[`__${propertyKey}`];
            },
            set(value) {
                // 暂存旧值
                const oldValue = target[`__${propertyKey}`];
                // 设置新值
                target[`__${propertyKey}`] = value;
                // 遍历列表并通知观察者
                const watchers: [Function, any][] = target[`__${propertyKey}_watchers`];
                if (watchers && watchers.length > 0) {
                    for (let i = 0; i < watchers.length; i++) {
                        const [callback, thisArg] = watchers[i];
                        if (thisArg) {
                            callback.call(thisArg, value, oldValue);
                        } else {
                            callback(value, oldValue);
                        }
                    }
                }
            }
        });
    }
    // 添加到观察者列表
    watchers.push([callback, thisArg]);
    // 初始化调用
    if (thisArg) {
        callback.call(thisArg, target[`__${propertyKey}`], undefined);
    } else {
        callback(target[`__${propertyKey}`], undefined);
    }
}

/**
 * 取消监听属性
 * @param target 监听对象
 * @param propertyKey 监听属性键
 * @param callback 回调
 * @param thisArg 对象
 */
function unwatchProperty<T = any>(target: any, propertyKey: string, callback: (newValue: T, oldValve: T) => any, thisArg?: any) {
    // 有效性检查
    if (!isObject(target) || !target.hasOwnProperty(propertyKey) || (typeof callback !== 'function')) {
        return;
    }
    // 遍历观察者列表
    const watchers: [Function, any][] = target[`__${propertyKey}_watchers`];
    if (watchers && watchers.length > 0) {
        for (let i = 0; i < watchers.length; i++) {
            const [_callback, _thisArg] = watchers[i];
            if (_callback === callback && _thisArg === thisArg) {
                watchers.splice(i);
                i--;
            }
        }
    }
}

/**
 * 判断目标值是否为对象
 * @param value 值
 */
function isObject(value: any) {
    return (Object.prototype.toString.call(value) === '[object Object]');
}

export { watchProperty, unwatchProperty };
