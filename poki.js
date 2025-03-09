const pokeURL = 'https://pokeapi.co/api/v2/pokemon';
const pokedexBar = document.querySelector('#pokedex-bar');
const catchButton = document.querySelector('#draw');
const cardHolder = document.querySelector('#card-holder');

const pokedex = () => {
    pokedexBar.style.width = `50%`
}
pokedex();
const random = (value) => Math.floor(Math.random() * value);


class Selected {
    constructor(name, species, url, sprite) {
        this.name = name;
        this.species = species;
        this.speciesURL = url;
        this.flavor_text_entries = new Set();
        this.spritesURL = sprite;
    }
}

const makePokemonCard = async (pokemon, flavor_text) => {
    const rotation = () => Math.floor(Math.random() * 10) - 5;

    const card = document.createElement('div');
    card.classList.add('card');

    const name = document.createElement('p');
    name.classList.add('card-name');
    name.innerText = String(pokemon.name);
    card.append(name);

    const line = document.createElement('hr');
    card.append(line);

    const image = document.createElement('img');
    image.src = pokemon.spritesURL;
    image.classList.add('card-image')
    card.append(image);

    const flavor = document.createElement('p');
    flavor.innerText = flavor_text;
    flavor.classList.add('card-flavor');
    card.append(flavor);

    card.style.transform = `rotate(${rotation()}deg)`;
    cardHolder.append(card);
}

const library = async () => {
    const selectedList = [];
    try {
        //get entire db of names with urls
        let { data } = await axios(`${pokeURL}?offset=0&limit=1500`);
        console.log('-', data);

        //retrieve an accurate/up-to-date count of pokemon
        const count = data.count;

        //get 3 random pokemons' data
        let pokemons = await Promise.all(
            Array.from({ length: 3 }, (index = random(count)) => axios.get(data.results[index].url))
        );
        console.log(pokemons);

        //retrieve species name and species url
        //retrieve sprites info for lazy-caching (later)
        pokemons.forEach(element => {
            const { name, species, sprites } = element.data;
            console.log(name, species, sprites);
            selectedList.push(new Selected(name, species.name, species.url, sprites.front_default))
        });

        //get species info from url
        selectedList.forEach(async element => {
            let info = await axios(element.speciesURL);
            const { flavor_text_entries } = info.data;

            //find english entries that are unique - and remove invisible and escape characters
            flavor_text_entries.forEach(entry => {
                if (entry.language.name === 'en') element.flavor_text_entries.add(entry.flavor_text.replace(/\n/g, " ").trim());
            });
            const size = element.flavor_text_entries.size;

            //pick one to log:
            const flavor_text = Array.from(element.flavor_text_entries)[random(size)];
            console.log(`${element.name}: ${flavor_text}`)

            //make cards for each with chosen flavor_text
            makePokemonCard(element, flavor_text);
        });
    } catch (error) { console.error(error) }
}

catchButton.addEventListener('click', (event) => {
    event.preventDefault();
    let oldCards = document.querySelectorAll('.card');
    oldCards.forEach((card) => {
        card.remove();
    })
    library();

});

