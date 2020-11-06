const app = document.getElementById('root');

const container = document.createElement('div');
container.setAttribute('class', 'container');

app.appendChild(container);

fetch('https://gnews.io/api/v4/search?q=food&token=6e177d72311c57f9dbf9c307fe5fe8a4')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        var length = Object.keys(data.articles).length;
        for(var i = 0; i < length; i++)
        {
            var article = data.articles[i];
            
            const card = document.createElement('div');
            card.setAttribute('class', 'card');
            
            const img = document.createElement("img");
            img.src = article.image;
            card.appendChild(img);

            const h1 = document.createElement('h1');
            //console.log(article.title);
            h1.textContent = article.title;

            const p1 = document.createElement('p');
            console.log(article.description);
            p1.textContent = article.description;

            container.appendChild(card);
            card.appendChild(h1);
            card.appendChild(p1)
        }

    });


