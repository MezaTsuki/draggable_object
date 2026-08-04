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
function clearTimers() {
    clearInterval(wobbleTimer);
}

let wobbleTimer = null;
dragBox.addEventListener("mousedown", event => {
    isHolding = true;
    setMousePos();
    setBoxPos();
    // console.log(mouseStartPosX, mouseStartPosY);

    // # --- WOBBLY UPDATE ---
    dragBox.style.transition = '0.1s';
    wobbleTimer = setInterval(() => {
        mouseDelayX = mouseNowX;
        mouseDelayY = mouseNowY;
    }, 80);
});
document.addEventListener("mouseup", event => {
    isHolding = false;
    
    // # --- WOBBLY UPDATE ---
    clearTimers();
    dragBox.style.transition = '0.5s ease-out';
    dragBox.style.padding = '0px';
    console.log("Mouse Up");
});
document.addEventListener("mouseleave", event => {
    isHolding = false;

    // # --- WOBBLY UPDATE ---
    clearTimers();
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

// # SLIDE TRANSITION CONCEPT_<-_<-_
const themeButton = document.getElementById("themeButton");
const lightTheme = document.getElementById("lightTheme");
const darkTheme = document.getElementById("darkTheme");
function switchTheme() {
    if (lightTheme.checked == true) {
        darkTheme.checked = true;
        document.body.style.setProperty('--color1', 'white');
        document.body.style.setProperty('--color2', 'black');
    } else {
        lightTheme.checked = true;
        document.body.style.setProperty('--color1', 'black');
        document.body.style.setProperty('--color2', 'white');
    }
}
themeButton.addEventListener("mouseup", event => {

    //? => Create Container ---
    const container = document.createElement('div');
    container.id = "screenbutt";
    container.style.cssText = `
        position: fixed; top: 0; left: 0;
        overflow: hidden;
        height: 100%; width: 100%;
        transition: 0.1s linear;
    `; 
    document.body.appendChild(container);

    //? => Take Screenshot of Body ---
    html2canvas(document.body).then(canvas => {

        //? => Create Image Element ---
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
        
        //? => Slide Animation ---
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
        }, 1100);

        /* todo:  ---DOWNLOAD LINES---
        *          link.download = 'whatever.png';
        *          link.href = canvas.toDataURL("image/png");
        *          link.click();
        */ 
    });
    setTimeout(() => {
        switchTheme();
    }, 200);
});

// # -+-+- Size Adjustment -+-+-  
const sizeUp = document.getElementById("sizeUp");
const sizeDown = document.getElementById("sizeDown");

sizeUp.onclick = function() {adjustSize(1);}
sizeDown.onclick = function() {adjustSize(-1);}
    
function adjustSize (sizeChange) {
    let boxWidth = parseInt(DBstyle.width);
    let boxHeight = parseInt(DBstyle.height);
    
    boxWidth *= (1 + (0.2 * sizeChange));
    boxHeight *= (1 + (0.2 * sizeChange));

    if (!(boxHeight < 100)) {
        dragBox.style.transition = 'height 0.15s ease, width 0.05s ease';
        dragBox.style.setProperty('--boxWidth', boxWidth + 'px');
        dragBox.style.setProperty('--boxHeight', boxHeight + 'px');
    }
}