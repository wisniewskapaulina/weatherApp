const wrapper = document.querySelector(".wrapper");
const inputPart = wrapper.querySelector(".input-part");
const infoTxt = inputPart.querySelector(".info-text");
const inputField = inputPart.querySelector("input");
const locationBtn = inputPart.querySelector("button")
const weatherPart = wrapper.querySelector(".weather-part");
const backButton = wrapper.querySelector("i");
const weatherImg = wrapper.querySelector(".weather-part img");
const api_key = "0e5d4b1e94ea8803c0f9110ed6e77284";
let api;


inputField.addEventListener("keyup", (e) => {
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

//cofanie
backButton.addEventListener("click", () => {
    wrapper.classList.remove("active");
    weatherPart.classList.remove("active");
    infoTxt.innerText = "";
    inputField.value = "";   
})


//geolokacja
locationBtn.addEventListener("click", () => {
    if(navigator.geolocation) { //jeśli przeglądarka wspiera geolokacje api
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your brwoser not suppoer geolocation api");
    }
})

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`;
    fetchData();
}

function onSuccess (position) {
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${api_key}`;
    fetchData();
}

function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}





function fetchData() {
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(infos) {
    infoTxt.classList.replace("pending", "error");
    if(infos.cod =="404") {
        infoTxt.innerText = `${inputField.value } isn't a valid city name`;
       
    } else {
        infoTxt.classList.remove("pending", "error");
        wrapper.classList.add("active");
        weatherPart.classList.add("active");


        const city = infos.name;
        const country = infos.sys.country;
        const {description, id} = infos.weather[0];
        const temp = infos.main.temp;
        const feels_like = infos.main.feels_like;
        const humidity = infos.main.humidity;
               
        console.log(infos);

        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".numb-top").innerText = temp.toFixed(1);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".numb-bottom").innerText = feels_like.toFixed(1);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;
     
        if (id>=801 && id<=804) {
            weatherImg.src = "./icons/cloud.svg"
        } else if (id == 800) {
            weatherImg.src = "./icons/clear.svg"
        } else if (id>=700 && id<=781) {
            weatherImg.src= "./icons/haze.svg"
        }else if (id>=600 && id<=622) {
            weatherImg.src = "./icons/snow.svg"
        } else if (id>=300 && id<=531) {
            weatherImg.src= "./icons/rain.svg"
        } else if (id>=200 && id<=232) {
            weatherImg.src= "./icons/storm.svg"
        }

    }
}