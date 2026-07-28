
const dragBox = document.getElementById("dragBox");
let DBstyle = getComputedStyle(dragBox);
let isHolding = false;
let mouseStartPosX = 0;
let mouseStartPosY = 0;
let boxStartPosX = 0;
let boxStartPosY = 0;

function setBoxPos () {
    boxStartPosX = parseInt(DBstyle.left);
    boxStartPosY = parseInt(DBstyle.top);
    // console.log(`Left: ${boxStartPosX}, Top: ${boxStartPosY}`);
}
function setMousePos () {
    mouseStartPosX = event.clientX;
    mouseStartPosY = event.clientY;
    // console.log(`Left: ${mouseStartPosX}, Top: ${mouseStartPosY}`);
}

dragBox.addEventListener("mousedown", event => {
    isHolding = true;
    setMousePos();
    setBoxPos();
    console.log(mouseStartPosX, mouseStartPosY);
});
document.addEventListener("mouseup", event => {
    isHolding = false;
    setMousePos();
});
document.addEventListener("mouseleave", event => {
    isHolding = false;
    setMousePos();
});

document.addEventListener("mousemove", event => {
    if (!isHolding) return;
    const moveX = (boxStartPosX + (event.clientX - mouseStartPosX)) + 'px'
    const moveY = (boxStartPosY + (event.clientY - mouseStartPosY)) + 'px'
    dragBox.style.left = moveX;
    dragBox.style.top = moveY;
});