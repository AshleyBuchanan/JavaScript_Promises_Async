const pokeURL = 'https://pokeapi.co/api/v2/pokemon';
const pokidexBar = document.querySelector('#pokidex-bar');
const pokidex = () => {
    pokidexBar.style.width = `50%`
}
pokidex();
const random = (value) => Math.floor(Math.random() * value);

const library = async () => {
    try {
        let { data } = await axios(`${pokeURL}?offset=0&limit=1500`);
        const count = data.count;
        let pokemons = await Promise.all(
            Array.from({ length: 3 }, (index = random(count)) => axios.get(data.results[index].url))
        );
        pokemons.forEach(pokemon => {
            console.log(pokemon.data);
        });
    } catch (error) { }

}