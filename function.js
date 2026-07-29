import html2canvas from 'html2canvas';

const dragBox = document.getElementById("dragBox");
let DBstyle = getComputedStyle(dragBox);
let windowProp = getComputedStyle(document.body);
let isHolding = false;
let mouseStartPosX = 0;     
let mouseStartPosY = 0;     
let boxStartPosX = 0;
let boxStartPosY = 0;

// # --- WOBBLY UPDATE ---
let mouseNowX = 0;
let mouseNowY = 0;
let mouseDelayX = (parseInt(DBstyle.left) + (parseInt(DBstyle.width)/2));
let mouseDelayY = (parseInt(DBstyle.top) + (parseInt(DBstyle.height)/2));
const boxWidth = parseInt(DBstyle.width);
const boxHeight = parseInt(DBstyle.height);

function setBoxPos () {
    boxStartPosX = parseInt(DBstyle.left);
    boxStartPosY = parseInt(DBstyle.top);
}
function setMousePos () {
    mouseStartPosX = event.clientX;
    mouseStartPosY = event.clientY;
}

// # --- WOBBLY UPDATE ---
function setMouseNow() {
    mouseNowX = event.clientX;
    mouseNowY = event.clientY;
}
function clearTimers () {
    clearInterval(wobbleTimer);
}

dragBox.addEventListener("mousedown", event => {
    isHolding = true;
    setMousePos();
    setBoxPos();
    // console.log(mouseStartPosX, mouseStartPosY);

    // # --- WOBBLY UPDATE ---
    dragBox.style.transition = '0.1s ease';
    wobbleTimer = setInterval(() => {
        mouseDelayX = mouseNowX;
        mouseDelayY = mouseNowY;
    }, 40);
});
document.addEventListener("mouseup", event => {
    isHolding = false;
    
    // # --- WOBBLY UPDATE ---
    clearTimers();
    dragBox.style.transition = '0.5s ease-out';
    dragBox.style.padding = '0px';
});
document.addEventListener("mouseleave", event => {
    isHolding = false;

    // # --- WOBBLY UPDATE ---
    clearTimers();
    dragBox.style.transition = '0.5s ease-out';
    dragBox.style.padding = '0px';
});

document.addEventListener("mousemove", event => {
    if (!isHolding) return;
    const moveX = (boxStartPosX + (event.clientX - mouseStartPosX)) + 'px'
    const moveY = (boxStartPosY + (event.clientY - mouseStartPosY)) + 'px'
    dragBox.style.left = moveX;
    dragBox.style.top = moveY;

    // # --- WOBBLY UPDATE ---
    setMouseNow();
    dragBox.style.paddingLeft = (Math.max(0, event.clientX - mouseDelayX)) + 'px';
    dragBox.style.paddingRight = (Math.max(0, mouseDelayX - event.clientX)) + 'px';
    dragBox.style.paddingTop = (Math.max(0, event.clientY - mouseDelayY)) + 'px';
    dragBox.style.paddingBottom = (Math.max(0, mouseDelayY - event.clientY)) + 'px';
});

// # SLIDE TRANSITION CONCEPT ___
document.addEventListener("mousedown", event => {

    const container = document.createElement('div');
    container.id = "screenbutt";
    container.style.cssText = `
        position: fixed; top: 0;
        overflow: hidden;
        height: 100%; width: 100%;
        transition: 0.2s;
    `; 
    document.body.appendChild(container);

    html2canvas(document.body).then(canvas => {
        const link = document.createElement('a');

        const img = new Image();
        img.src = canvas.toDataURL("image/png");
        img.alt = "screenshot";
        img.style.cssText = `
            position: absolute; top: 0;
            height: 100vh; 
            width: 100vw;
        `;
        container.appendChild(img);
        let buttscreen = img;
        let screenbutt = container;
        
        let imgWidth = parseInt(windowProp.width);
        const slideInterval = imgWidth/10;
        const slideTran = setInterval(() => {
            imgWidth -= slideInterval;
            screenbutt.style.width = imgWidth + 'px';
            console.log("blah");
        }, 100);
        setTimeout(() => {
            buttscreen.remove();
            screenbutt.remove();
            clearInterval(slideTran);
        }, 1000);

        /* todo:  ---DOWNLOAD LINES---
        *          link.download = 'whatever.png';
        *          link.href = canvas.toDataURL("image/png");
        *          link.click();
        */ 
    });
});