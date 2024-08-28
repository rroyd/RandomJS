//buttons
const start = document.getElementById("start");
const stop = document.getElementById("stop");
const reset = document.getElementById("reset");
const main = document.getElementsByTagName("main");

//time
const seconds = document.getElementById("seconds");
const minutes = document.getElementById("minutes");
const hours = document.getElementById("hours");
//digits
const zeros = document.querySelectorAll(".zero");
const digits = document.querySelectorAll(".digit");

let intervalId, precentage = 0;

const startFunction = function() {
    intervalId = setInterval(() => {
        parseInt(digits[2].innerText) > 8 && (zeros[2].classList.add("hide"));
        parseInt(digits[1].innerText) > 8 && (zeros[1].classList.add("hide"));
        parseInt(digits[0].innerText) > 8 && (zeros[0].classList.add("hide"));
        precentage > 99 && (precentage = 0);


        main[0].style.background = `conic-gradient(rgb(0, 0, 0), rgb(226, 226, 226) 0% ${precentage}%, rgb(205, 205, 205) 0% 96%)`;
        main[0].style.transition = `0.5s`;
        precentage += 100/60;

        digits[2].innerText++;
        if (digits[2].innerText == "60") {
            digits[2].innerText %= 60;
            digits[1].innerText++;
            zeros[2].classList.remove("hide");
        }
        if(digits[1].innerText == "60") {
            digits[1].innerText %= 60;
            digits[2].innerText %= 60;
            digits[0].innerText++;
            zeros[2].classList.remove("hide");
            zeros[1].classList.remove("hide");
        }
    }, 1000)
    return intervalId;
}

const resetFunction = function() {
    for (let zero of zeros) {
        zero.classList.remove("hide");
    }
    for (let digit of digits) {
        digit.innerText = "0";
    }
    clearInterval(intervalId);
    precentage = 0;
    main[0].style.background = `conic-gradient(rgb(0, 0, 0), rgb(226, 226, 226) 0% ${precentage}%, rgb(205, 205, 205) 0% 96%)`;
    main[0].style.transition = `0.5s`;
}   

const stopFunction = function() {
    clearInterval(intervalId);
}

start.addEventListener("click", startFunction);
stop.addEventListener("click", stopFunction);
reset.addEventListener("click", resetFunction);