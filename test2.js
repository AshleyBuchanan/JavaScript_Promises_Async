const output1_1 = document.querySelector('#part1_1');
const output1_2 = document.querySelector('#part1_2');
const output1_3 = document.querySelector('#part1_3');
const output2_1 = document.querySelector('#part2_1');
const output2_2 = document.querySelector('#part2_2');
const output2_3 = document.querySelector('#part2_3');
const numbers_url = 'http://numbersapi.com/';
const cards_url = 'https://deckofcardsapi.com/api/deck/';


//part 1_1 : get number data
const part1_1 = async (number) => {
    try {
        const response = await axios(`${numbers_url}${number}?json`);           //demonstrating axios implementation.
        const data = await response.data;
        const type = String(data.type).toLocaleUpperCase();

        output1_1.innerHTML = `<strong>${type}</strong> ${data.text}`;

        return data.text;

    } catch (error) {
        console.error(`error in part1_1 function ${error}`);
    }
}


//part 1_2 : get multiple number's data
const part1_2 = async (numbers) => {
    try {
        const response = await fetch(`${numbers_url}${numbers.join(',')}?json`);    //demonstrating fetch usage.
        const data = await response.json();

        for (const key in data) {
            const li = document.createElement('li');
            li.innerHTML = `${data[key]}`;
            output1_2.append(li);
        }

        return data;
    } catch (error) {
        console.error(`error in part1_2 function ${error}`);
    }
}


//part 1_3 : get 4 facts from a number
const part1_3 = async (number) => {
    const returnableArray = [];
    try {
        for (i = 0; i < 4; i++) {
            const response = await axios(`${numbers_url}${number}?json`);           //demonstrating axios implementation.
            const data = await response.data.text;
            const li = document.createElement('li');
            li.innerHTML = `${data}`;
            output1_3.append(li);

            returnableArray.push(data);
        }

        return returnableArray;

    } catch (error) {
        console.error(`error in part1_3 function ${error}`);
    }
}


//part 2_1 : request a single card from a newly shuffled deck
const part2_1 = async () => {
    // I've found intermittent CORS errors, so I used catch without throwing.
    let complete = false;
    while (!complete) {
        try {
            const response = await axios(`${cards_url}new/draw/?deck_count=1`);
            const data = response.data.cards[0];
            console.log(data);
            console.log(`${data.value} of ${data.suit}`);

            const cardImg = document.createElement('img');
            cardImg.src = data.image;
            cardImg.classList.add('card');
            output2_1.append(cardImg);
            complete = true

        } catch (error) {
            // I am attempting to add fault tolerance
        }
    }
}


//part 2_2 : request a single card from a newly shuffled deck, then one more from the same deck
const part2_2 = async () => {
    // I've found intermittent CORS errors, so I used catch without throwing.
    let complete = false;
    while (!complete) {
        try {
            let response;
            let cards = [];
            let deck;

            // get the new shuffled deck
            response = await axios(`${cards_url}new/shuffle/?deck_count=1`);
            deck = response.data.deck_id;
            console.log(`new deck ${deck}`);

            // get two cards in sequence ONLY AFTER first card is retrieved
            while (cards.length < 2) {
                try {
                    response = await axios(`${cards_url}${deck}/draw/?deck_count=1`);
                    cards.push(response.data.cards[0]);
                } catch (error) {
                    // I am attempting to add fault tolerance
                }
            }
            console.log(cards);
            complete = true;

            cards.forEach(card => {
                const cardImg = document.createElement('img');
                cardImg.src = card.image;
                cardImg.classList.add('card');
                output2_2.append(cardImg);
            });

        } catch (error) {
            // I am attempting to add fault tolerance
        }
    }
}

const part2_3 = async (operation, rotation) => {
    // I've found intermittent CORS errors, so I used catch without throwing.
    let complete = false;
    while (!complete) {
        try {
            let response;

            switch (operation) {
                case 'new deck':
                    response = await axios(`${cards_url}new/shuffle/?deck_count=1`);
                    currentDeck = response.data.deck_id;
                    console.log(`#new deck: ${currentDeck}`);
                    break;

                case 'shuffle':
                    response = await axios(`${cards_url}${currentDeck}/shuffle/?deck_count=1`)
                    currentDeck = response.data.deck_id;   // just to validate same deck
                    console.log(`shuffled deck: ${currentDeck}`);
                    break;

                case 'draw':
                    response = await axios(`${cards_url}${currentDeck}/draw/?count=1`);
                    data = response.data.cards[0];
                    console.log(data);
                    console.log(`${data.value} of ${data.suit}`);

                    const cardImg = document.createElement('img');
                    cardImg.src = data.image;
                    cardImg.classList.add('card');
                    cardImg.style.transform = `rotate(${rotation}deg)`;
                    output2_3.append(cardImg);
                    break;
            }

            complete = true;

        } catch (error) {
            // I am attempting to add fault tolerance
        }
    }
}





//tests
const pickANumber = () => Math.floor(Math.random() * 100);
console.log(part1_1(pickANumber()));
console.log(part1_2([pickANumber(), pickANumber()]));
console.log(part1_3(pickANumber()));
part2_1();
part2_2();
part2_3('new deck');
let currentDeck;
const newDeck = document.querySelector('button#new');
const shuffleDeck = document.querySelector('button#shuffle');
const drawDeck = document.querySelector('button#draw');
newDeck.addEventListener('click', (event) => {
    event.preventDefault();
    console.log('new deck')
    part2_3('new deck', pickANumber() * .1);
});

shuffleDeck.addEventListener('click', (event) => {
    event.preventDefault();
    console.log('shuffled')
    part2_3('shuffle', pickANumber() * .1);
});

drawDeck.addEventListener('click', (event) => {
    event.preventDefault();
    console.log('draw a card')
    part2_3('draw', (pickANumber() * .1) - 5);
});
