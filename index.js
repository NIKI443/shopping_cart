const products = document.querySelectorAll(".shelf_product");
const canvas = document.querySelector(".canvas");
const cart_btn = document.querySelector(".cart_btn");

const cart = [];
let currentDroppable = null;

function setMargin() {
  const margin = (window.innerWidth - 200) / 2;
  canvas.style.setProperty("--dynamic-margin", `${margin}px`);
}
window.addEventListener("load", setMargin);
window.addEventListener("resize", setMargin);

function cartPush() {
  cart.push(1);
  if (cart.length >= 3) {
    cart_btn.classList.add("active");
  }
}

products.forEach((product) => {
  product.ondragstart = function () {
    return false;
  };
  product.addEventListener("mousedown", dragMoveMouse);
  product.addEventListener("touchstart", dragMoveTouch, { passive: false });
});

function dragMoveTouch(event) {
  let touch = event.targetTouches[0];
  let clientTop = touch.clientX;
  let clientLeft = touch.clientY;
  let product = event.target;
  let shiftX = touch.clientX - product.getBoundingClientRect().left;
  let shiftY = touch.clientY - product.getBoundingClientRect().top;
  moveAt(touch.pageX, touch.pageY);
  function moveAt(pageX, pageY) {
    product.style.left = pageX - shiftX + "px";
    product.style.top = pageY - shiftY + "px";
  }

  function onTouchMove(event) {
    let touch = event.targetTouches[0];
    moveAt(touch.pageX, touch.pageY);
    product.style.zIndex = 1000;
    product.hidden = true;
    let elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    product.hidden = false;

    if (!elemBelow) return;
    let droppableBelow = elemBelow.closest(".cart_img");

    if (currentDroppable != droppableBelow) {
      if (currentDroppable) {
        leaveDroppable(currentDroppable);
        product.ontouchend = function () {
          document.removeEventListener("touchmove", onTouchMove);
          product.ontouchend = null;
          product.style.zIndex = 1;
          moveAt(clientTop, clientLeft);
        };
      }
      currentDroppable = droppableBelow;
      if (currentDroppable) {
        enterDroppable(currentDroppable);
        product.ontouchend = function () {
          document.removeEventListener("touchmove", onTouchMove);
          document.removeEventListener("touchend", onTouchMove);
          product.ontouchend = null;
          product.style.zIndex = 1;
          cartPush();
          leaveDroppable(droppableBelow);
        };
      }
    }
  }

  document.addEventListener("touchmove", onTouchMove);

  product.ontouchend = function () {
    document.removeEventListener("touchmove", onTouchMove);
    product.ontouchend = null;
    product.style.zIndex = 1;
    moveAt(clientTop, clientLeft);
  };
}

function dragMoveMouse(event) {
  let clientTop = event.clientX;
  let clientLeft = event.clientY;
  let product = event.target;
  let shiftX = event.clientX - product.getBoundingClientRect().left;
  let shiftY = event.clientY - product.getBoundingClientRect().top;

  moveAt(event.pageX, event.pageY);
  function moveAt(pageX, pageY) {
    product.style.left = pageX - shiftX + "px";
    product.style.top = pageY - shiftY + "px";
  }
  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
    product.style.zIndex = 1000;

    product.hidden = true;
    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    product.hidden = false;

    if (!elemBelow) return;
    let droppableBelow = elemBelow.closest(".cart_img");

    if (currentDroppable != droppableBelow) {
      if (currentDroppable) {
        leaveDroppable(currentDroppable);
        product.onmouseup = function () {
          document.removeEventListener("mousemove", onMouseMove);
          product.onmouseup = null;
          product.style.zIndex = 1;
          moveAt(clientTop, clientLeft);
        };
      }
      currentDroppable = droppableBelow;
      if (currentDroppable) {
        enterDroppable(currentDroppable);
        product.onmouseup = function () {
          document.removeEventListener("mousemove", onMouseMove);

          product.onmouseup = null;
          product.style.zIndex = 1;
          cartPush();
          leaveDroppable(droppableBelow);
        };
      }
    }
  }

  document.addEventListener("mousemove", onMouseMove);

  product.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    product.onmouseup = null;
    product.style.zIndex = 1;
    moveAt(clientTop, clientLeft);
  };
}

function enterDroppable(elem) {
  elem.style.background = "#e6e6e677";
}

function leaveDroppable(elem) {
  elem.style.background = "";
}
