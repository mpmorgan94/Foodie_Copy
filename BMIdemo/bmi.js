
const app = document.getElementById('root');

const container = document.createElement('div');
container.setAttribute('class', 'container');

app.appendChild(container);

var weight = 85.00;
var wunit = "kg";
var height = 170.00;
var hunit = "cm";
var sex = "m";
var age = 24.00;
var waist = 34.00;
var hip = 40.00;


const params = JSON.stringify({
    "weight": {
        "value": weight.toString(),
        "unit": wunit
    },
    "height": {
        "value": height.toString(),
        "unit": hunit
    },
    "sex": sex,
    "age": age.toString(),
    "waist": waist.toString(),
    "hip": hip.toString()
});

console.log(params);

const xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
        console.log(this.responseText);
    }
});

xhr.open("POST", "https://rapidapi.p.rapidapi.com/");
xhr.setRequestHeader("content-type", "application/json");
xhr.setRequestHeader("x-rapidapi-key", "98419d9ab3msh3e8c10a2a9f298bp15e0e8jsn0d572e2a6994");
xhr.setRequestHeader("x-rapidapi-host", "bmi.p.rapidapi.com");

xhr.send(params);

xhr.onload = function() {
    var data = JSON.parse(this.response);
    if(xhr.status >= 200 && xhr.status < 400)
    {
        const card = document.createElement('div');
        card.setAttribute('class', 'card');

        const h1 = document.createElement('h1');
        h1.textContent = "Here are your Results!";

        const p1 = document.createElement('p1');
        p1.textContent =    "Ideal weight: " + data.ideal_weight + "\n"
                            + "Surface Area: " + data.surface_area + "\n"
                            + "BMR: " + data.bmr.value + "\n"
                            + "WHR: " + data.whr.value + " " + data.whr.status + "\n"
                            + "WHTR: " + data.whtr.value + " " + data.whtr.status + "\n";
        console.log(p1);

        container.appendChild(card);
        card.appendChild(h1);
        card.appendChild(p1);
    }

    console.log(data);
}


