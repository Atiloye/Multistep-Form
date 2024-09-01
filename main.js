// Declaring consts and vars
const steps = document.querySelectorAll(".stp");
const circleSteps = document.querySelectorAll(".step");
const formInputs = document.querySelectorAll(".step-1 form input");
const plans = document.querySelectorAll(".plan-card");
const switcher = document.querySelector(".switch");
const addons = document.querySelectorAll(".box");
const total = document.querySelector(".total b");
const planPrice = document.querySelector(".plan-price");
let time;
let currentStep = 1;
let currentCircle = 0;
const obj = {
    plan: null,
    kind: null,
    price: null,
};

// navigation and updating the display of the steps
steps.forEach((step) => {
    const nextBtn = step.querySelector(".next-step");
    const prevBtn = step.querySelector(".prev-step");
    if (prevBtn) {
    prevBtn.addEventListener("click", () => {
        document.querySelector(`.step-${currentStep}`).style.display = "none";
        currentStep--;
        document.querySelector(`.step-${currentStep}`).style.display = "flex";
        circleSteps[currentCircle].classList.remove("active");
        currentCircle--;
    });
    }
    nextBtn.addEventListener("click", () => {
    document.querySelector(`.step-${currentStep}`).style.display = "none";
    if (currentStep < 5 && validateForm()) {
        currentStep++;
        currentCircle++;
        setTotal();
    }
    document.querySelector(`.step-${currentStep}`).style.display = "flex";
    circleSteps[currentCircle].classList.add("active");
    summary(obj);
    });
});

// update the content of two HTML elements
function summary(obj) {
    const planName = document.querySelector(".plan-name");
    const planPrice = document.querySelector(".plan-price");
    planPrice.innerHTML = `${obj.price.innerText}`;
    planName.innerHTML = `${obj.plan.innerText} (${
    obj.kind ? "annually" : "monthly"
    })`;
}

// validate and check if all inputs have a value
function validateForm() {
    let valid = true;
    for (let i = 0; i < formInputs.length; i++) {
    if (!formInputs[i].value) {
        valid = false;
        formInputs[i].classList.add("err");
        findLabel(formInputs[i]).nextElementSibling.style.display = "flex";
    } else {
        valid = true;
        formInputs[i].classList.remove("err");
        findLabel(formInputs[i]).nextElementSibling.style.display = "none";
    }
    }
    return valid;
}


function findLabel(el) {
    const idVal = el.id;
    const labels = document.getElementsByTagName("label");
    for (let i = 0; i < labels.length; i++) {
    if (labels[i].htmlFor == idVal) return labels[i];
    }
}

// Events for the 'plans'
plans.forEach((plan) => {
    plan.addEventListener("click", () => {
    document.querySelector(".selected").classList.remove("selected");
    plan.classList.add("selected");
    const planName = plan.querySelector("b");
    const planPrice = plan.querySelector(".plan-price");
    obj.plan = planName;
    obj.price = planPrice;
    });
});


// Toggle btw monthly and annually
switcher.addEventListener("click", () => {
    const val = switcher.querySelector("input").checked;
    if (val) {
    document.querySelector(".monthly").classList.remove("sw-active");
    document.querySelector(".annually").classList.add("sw-active");
    } else {
    document.querySelector(".monthly").classList.add("sw-active");
    document.querySelector(".annually").classList.remove("sw-active");
    }
    switchPrice(val);
    obj.kind = val;
});


addons.forEach((addon) => {
    addon.addEventListener("click", (e) => {
    const addonSelect = addon.querySelector("input");
    const ID = addon.getAttribute("data-id");
    if (addonSelect.checked) {
        addonSelect.checked = false;
        addon.classList.remove("ad-selected");
        showAddon(ID, false);
    } else {
        addonSelect.checked = true;
        addon.classList.add("ad-selected");
        showAddon(addon, true);
        e.preventDefault();
        }
    });
});

// toggle btw displaying annual and monthly prices for the three plans
function switchPrice(checked) {
    const annuallyPrice = [40000, 65000, 150000];
    const monthlyPrice = [4000, 6500, 15000];
    const prices = document.querySelectorAll(".plan-price");
    if (checked) {
    prices[0].innerHTML = `₦${annuallyPrice[0]}/yr`;
    prices[1].innerHTML = `₦${annuallyPrice[1]}/yr`;
    prices[2].innerHTML = `₦${annuallyPrice[2]}/yr`;
    setTime(true)
    } else {
    prices[0].innerHTML = `₦${monthlyPrice[0]}/mo`;
    prices[1].innerHTML = `₦${monthlyPrice[1]}/mo`;
    prices[2].innerHTML = `₦${monthlyPrice[2]}/mo`;
    setTime(false)
    }
}

// add or remove an add-on
function showAddon(ad, val) {
    const temp = document.getElementsByTagName("template")[0];
    const clone = temp.content.cloneNode(true);
    const serviceName = clone.querySelector(".service-name");
    const servicePrice = clone.querySelector(".service-price");
    const serviceID = clone.querySelector(".selected-addon");
    if (ad && val) {
    serviceName.innerText = ad.querySelector("label").innerText;
    servicePrice.innerText = ad.querySelector(".price").innerText;
    serviceID.setAttribute("data-id", ad.dataset.id);
    document.querySelector(".addons").appendChild(clone);
    } else {
    const addons = document.querySelectorAll(".selected-addon");
    addons.forEach((addon) => {
        const attr = addon.getAttribute("data-id");
        if (attr == ad) {
        addon.remove();
        }
    });
    }
}

// Setting total 
function setTotal() {
    const str = planPrice.innerHTML;
    const res = str.replace(/\D/g, "");
    const addonPrices = document.querySelectorAll(
    ".selected-addon .service-price"
    );

    let val = 0;
    for (let i = 0; i < addonPrices.length; i++) {
    const str = addonPrices[i].innerHTML;
    const res = str.replace(/\D/g, "");

    val += Number(res);
    }
    total.innerHTML = `$${val + Number(res)}/${time?"yr":"mo"}`;
}
function setTime(t) {
    return time = t;
}