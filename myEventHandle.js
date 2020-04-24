bomEventList = ['click', 'mousedown', 'mousemove', 'mouseup']
class MyEventHandle {
    constructor () {
        if (!MyEventHandle.instance) {
            MyEventHandle.instance = this
        }
        return MyEventHandle.instance
    }
    addEventListener (target, type, cb) {
        MyEventHandle.addEventListenerOnBom.call(this, target, type)
        return void this.hasOwnProperty(type) ?
            (this[type].includes(cb) ? false : this[type].push(cb))
            : this[type] = [cb]
    }
    dispatchEvent (event) {
        if (typeof event === 'string') {
            event = {
                type: event,
                target: global
            }
        }
        if (this.hasOwnProperty(event.type)) {
            for (let cb of this[event.type]) {
                cb.call(event.target, event)
            }
        }
    }
    removeEventListener (target, type, cb) {
        MyEventHandle.removeEventListenerOnBom.call(this, target, type, cb)
        if (this.hasOwnProperty(type)) {
            cb ? this[type].splice(this[type].findIndex(cb), 1) : this[type] = []
        }
    }
    static addEventListenerOnBom (target, type) {
        if (bomEventList.includes(type)) {
            target.addEventListener(type, this.dispatchEvent.bind(this))
        }
    }
    static removeEventListenerOnBom (target, type, cb) {
        if (bomEventList.includes(type)) {
            target.removeEventListener(type, cb)
        }
    }
}

var myEventHandle = new MyEventHandle()
