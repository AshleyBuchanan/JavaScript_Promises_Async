const output1_1 = document.querySelector('#part1_1');
const output1_2 = document.querySelector('#part1_2');
const output1_3 = document.querySelector('#part1_3');
const output2_1 = document.querySelector('#part2_1');
const output2_2 = document.querySelector('#part2_2');
const output2_3_deck = document.querySelector('#part2_3_deck');
const output2_3_pile = document.querySelector('#part2_3_pile');
const output2_3_message = document.querySelector('#part2_3_message');

const numbers_url = 'http://numbersapi.com/'; // API for retrieving number facts
const cards_url = 'https://deckofcardsapi.com/api/deck/'; // API for card deck management
const cardBack_url = '222662_playing-card-png.png'; // Image for card back from https://clipart-library.com/

const newDeck = document.querySelector('button#new');
const shuffleDeck = document.querySelector('button#shuffle');
const drawDeck = document.querySelector('button#draw');

// Fetch a single number fact and display it
const part1_1 = async (number) => {
    try {
        const response = await axios(`${numbers_url}${number}?json`);
        const data = await response.data;
        const type = String(data.type).toUpperCase();
        output1_1.innerHTML = `<strong>${type}</strong> ${data.text}`;
        return data.text;
    } catch (error) {
        console.error(`Error in part1_1 function: ${error}`);
    }
}

// Fetch multiple number facts and display them in a list
const part1_2 = async (numbers) => {
    try {
        const response = await fetch(`${numbers_url}${numbers.join(',')}?json`);
        const data = await response.json();
        for (const key in data) {
            const li = document.createElement('li');
            li.innerHTML = `${data[key]}`;
            output1_2.append(li);
        }
        return data;
    } catch (error) {
        console.error(`Error in part1_2 function: ${error}`);
    }
}

// Fetch 4 facts about a single number and display them
const part1_3 = async (number) => {
    // try {
    //     for (let i = 0; i < 4; i++) {
    //         const response = await axios(`${numbers_url}${number}?json`);
    //         const data = await response.data.text;
    //         const li = document.createElement('li');
    //         li.innerText = `${data}`;
    //         output1_3.append(li);
    //     }
    // } catch (error) {
    //     console.error(`Error in part1_3 function: ${error}`);
    // }

    try {
        let facts = await Promise.all(
            Array.from({ length: 4 }, () => axios.get(`${numbers_url}${number}?json`))
        );
        facts.forEach(fact => {
            const data = fact.data.text;
            const li = document.createElement('li');
            li.innerText = `${data}`;
            output1_3.append(li);
        });
        return facts;
    } catch (error) {
        console.error(`Error in part1_3 function: ${error}`);
    }
}

// Draw a single card from a newly shuffled deck
const part2_1 = async () => {
    let complete = false;
    while (!complete) {
        try {
            const response = await axios(`${cards_url}new/draw/?deck_count=1`);
            const data = response.data.cards[0];
            const cardImg = document.createElement('img');
            cardImg.src = data.image;
            cardImg.classList.add('card');
            output2_1.append(cardImg);
            complete = true;
        } catch (error) {
            // Fault tolerance: Retry on failure
        }
    }
}

// Draw two cards sequentially from a single shuffled deck
const part2_2 = async () => {
    let complete = false;
    while (!complete) {
        try {
            let response;
            let cards = [];
            let deck;

            response = await axios(`${cards_url}new/shuffle/?deck_count=1`);
            deck = response.data.deck_id;

            while (cards.length < 2) {
                try {
                    response = await axios(`${cards_url}${deck}/draw/?deck_count=1`);
                    cards.push(response.data.cards[0]);
                } catch (error) { }
            }
            complete = true;

            cards.forEach(card => {
                const cardImg = document.createElement('img');
                cardImg.src = card.image;
                cardImg.classList.add('card');
                output2_2.append(cardImg);
            });
        } catch (error) { }
    }
}

// Lock or unlock buttons
const lockButtons = (bool, ignored = null) => {
    if (!ignored) newDeck.disabled = bool;
    shuffleDeck.disabled = bool;
    drawDeck.disabled = bool;
}

// Place cards in the deck
const placeCards = async () => {
    for (let i = 1; i <= cards_left; i++) {
        setTimeout(() => {
            const center = () => Math.floor(Math.random() * 100);
            const backsideRotation = () => Math.floor(Math.random() * 10) - 5;
            const cardImg = document.createElement('img');
            cardImg.src = cardBack_url;
            cardImg.classList.add('card', 'backside');
            cardImg.style.transformOrigin = `${center()}% ${center()}%`;
            cardImg.style.transform = `rotate(${backsideRotation()}deg)`;
            output2_3_deck.append(cardImg);
            if (i === cards_left) {
                lockButtons(false);
                window.scrollBy({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }, i * 100);
    }
}

// Remove cards from deck or pile
const removeCards = (state) => {
    if (!state) {
        const cardsInDeck = document.querySelectorAll('.backside');
        cardsInDeck.forEach(card => card.remove());
    }
    if (state === 'all') {
        let cardsInDeck = document.querySelectorAll('.backside');
        let cardsInPile = document.querySelectorAll('.pile');
        let firstCard = document.querySelectorAll('.first');
        cardsInDeck.forEach(card => card.remove());
        cardsInPile.forEach(card => card.remove());
        firstCard.forEach(card => card.remove());
    }
    if (state === 'last') {
        const cardsInDeck = document.querySelectorAll('.backside');
        const lastCard = cardsInDeck[cardsInDeck.length - 1];
        lastCard.remove();
    }
}

// Handle deck operations: new deck, shuffle, draw
const part2_3 = async (operation, rotation) => {
    let complete = false;
    while (!complete) {
        try {
            let response;
            switch (operation) {
                case 'new deck':
                    cards_left = 52;
                    lockButtons(true);
                    removeCards('all');
                    response = await axios(`${cards_url}new/`);
                    currentDeck = response.data.deck_id;
                    output2_3_message.innerText = `Not Shuffled`;
                    placeCards();
                    break;
                case 'shuffle':
                    lockButtons(true);
                    removeCards();
                    placeCards();
                    response = await axios(`${cards_url}${currentDeck}/shuffle/?remaining=true`);
                    output2_3_message.innerText = `Shuffled`;
                    break;
                case 'draw':
                    if (cards_left > 0) {
                        response = await axios(`${cards_url}${currentDeck}/draw/?count=1`);
                        data = response.data.cards[0];
                        const cardImg = document.createElement('img');
                        cardImg.src = data.image;
                        cardImg.style.transform = `rotate(${rotation}deg)`;
                        cardImg.classList.add('card', 'shift-down');

                        cards_left < 52 ? cardImg.classList.add('pile') : cardImg.classList.add('first')

                        cards_left--;
                        output2_3_pile.append(cardImg);
                        removeCards('last');
                    }
                    if (cards_left <= 0) {
                        lockButtons(true, newDeck);
                        output2_3_message.innerText = `All Cards Drawn`;
                    }
                    break;
            }
            complete = true;
        } catch (error) { }
    }
}

// Event listeners for deck operations
newDeck.addEventListener('click', (event) => part2_3('new deck', Math.random() * 10));
shuffleDeck.addEventListener('click', (event) => part2_3('shuffle', Math.random() * 10));
drawDeck.addEventListener('click', (event) => part2_3('draw', Math.random() * 10 - 5));
//tests
const pickANumber = () => Math.floor(Math.random() * 100);
console.log('1_1', part1_1(pickANumber()));
console.log('1_2', part1_2([pickANumber(), pickANumber()]));
console.log('1_3', part1_3(pickANumber()));
part2_1();
part2_2();

let currentDeck;
let cards_left = 52;
part2_3('new deck');

// This exercise got a little out of hand. Honestly, I was just having too much fun.
// All of the requirements should be met, though. Logs and Errors are in the console.
// With the card api, I had quite a few CORS throws, so I removed error messages in 
// their catches. I felt that fault-tolerance was more important than user-awareness.
// It was intermittent, so I just created a while loop to request again and again.
// Yes. I'm aware that if CORS throws infinitely, there'll be an endless loop.
