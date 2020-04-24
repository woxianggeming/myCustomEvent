const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

function isFunction(fn) {
    return typeof fn === 'function'
}

class MyPromise {
    constructor(handle) {
        if (!isFunction(handle)) {
            throw new Error('parameter error')
        }
        this._status = PENDING
        this._value = undefined

        this._fulfilledQueues = []
        this._rejectedQueues = []

        try {
            handle(this._resolve.bind(this), this._reject.bind(this))
        } catch (err) {
            this._reject(err)
        }
    }

    _resolve(val) {
        const run = () => {
            if (this._status !== PENDING) return
            this._status = FULFILLED

            const runFulfilled = (value) => {
                let cb
                while (cb = this._fulfilledQueues.shift()) {
                    cb(value)
                }
            }

            const runRejected = (err) => {
                let cb
                while (cb = this._rejectedQueues.shift()) {
                    cb(err)
                }
            }

            if (val instanceof MyPromise) {
                val.then(value => {
                    this._value = value
                    runFulfilled(value)
                }, err => {
                    this._value = err
                    runRejected(err)
                })
            } else {
                this._value = val
                runFulfilled(val)
            }
        }
        setTimeout(run, 0)
    }

    _reject(err) {
        const run = () => {
            if (this._status !== PENDING) return
            this._status = REJECTED
            this._value = err
            let cb
            while (cb = this._rejectedQueues.shift()) {
                cb(err)
            }
        }
        setTimeout(() => run(), 0)
    }

    then(onFulfilled, onRejected) {
        const {_value, _status} = this
        return new MyPromise((onFulfilledNext, onRejectedNext) => {
            let fulfilled = value => {
                try {
                    if (!isFunction(onFulfilled)) {
                        onFulfilledNext(value)
                    } else {
                        let res = onFulfilled(value)
                        if (res instanceof MyPromise) {
                            res.then(onFulfilledNext, onRejectedNext)
                        } else {
                            onFulfilledNext(res)
                        }
                    }
                } catch (err) {
                    onRejectedNext(err)
                }
            }
            let rejected = err => {
                try {
                    if (!isFunction(onRejected)) {
                        onRejectedNext(err)
                    } else {
                        let res = onRejected(err)
                        if (res instanceof MyPromise) {
                            res.then(onFulfilledNext, onRejectedNext)
                        } else {
                            onFulfilledNext(res)
                        }
                    }
                } catch (err) {
                    onRejectedNext(err)
                }
            }
            switch (_status) {
                case PENDING:
                    this._fulfilledQueues.push(fulfilled)
                    this._rejectedQueues.push(rejected)
                    break
                case FULFILLED:
                    fulfilled(_value)
                    break
                case REJECTED:
                    rejected(_value)
                    break
            }
        })
    }

    catch(onRejected) {
        return this.then(undefined, onRejected)
    }

    static resolve(value) {
        if (value instanceof MyPromise) return value
        return new MyPromise(resolve => resolve(value))
    }

    static reject(value) {
        return new MyPromise((resolve, reject) => reject(value))
    }

    static all(promises) {
        return new MyPromise((resolve, reject) => {
            let count = 0, res = []
            for (let [index, promise] of promises.entries()) {
                this.resolve(promise).then(val => {
                    res[index] = val
                    count ++
                    if (count === promises.length) resolve(res)
                }, err => reject(err))
            }
        })
    }

    static race(promises) {
        return new MyPromise((resolve, reject) => {
            for (let promise of promises) {
                this.resolve(promise).then(value => resolve(value), err => reject(err))
            }
        })
    }
}


