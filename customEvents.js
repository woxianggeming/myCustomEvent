const dragObjHandler = {
    dragElementList: [],
    startX: null,
    startY: null,
    zIndex: null,
    mousedown (event){
        dragObjHandler.startX = event.clientX - this.offsetLeft
        dragObjHandler.startY = event.clientY - this.offsetTop
        dragObjHandler.zIndex = document.defaultView.getComputedStyle(this, null).zIndex
        this.style.zIndex = '999999'
    },
    mousemove (event){
        if (dragObjHandler.startX !== null && dragObjHandler.startY !== null) {
            this.style.left = event.clientX - dragObjHandler.startX + 'px'
            this.style.top = event.clientY - dragObjHandler.startY + 'px'
        }
    },
    mouseup (){
        dragObjHandler.startY = null
        dragObjHandler.startX = null
        this.style.zIndex = dragObjHandler.zIndex
    }
}
function addDragEvent(target) {
    const dragElement = {
        target,
        mousedown: dragObjHandler.mousedown.bind(target),
        mousemove: dragObjHandler.mousemove.bind(target),
        mouseup: dragObjHandler.mouseup.bind(target)
    }
    dragObjHandler.dragElementList.push(dragElement)
    myEventHandle.addEventListener(target, 'mousedown', dragElement.mousedown)
    myEventHandle.addEventListener(document, 'mousemove', dragElement.mousemove)
    myEventHandle.addEventListener(document, 'mouseup', dragElement.mouseup)
}

function removeDragEvent(target) {
    const dragElement = dragObjHandler.dragElementList.find(dragElement => dragElement.target === target)
    myEventHandle.removeEventListener(target, 'mousedown', dragElement.mousedown)
    myEventHandle.removeEventListener(document, 'mousemove', dragElement.mousemove)
    myEventHandle.removeEventListener(document, 'mouseup', dragElement.mouseup)
}
