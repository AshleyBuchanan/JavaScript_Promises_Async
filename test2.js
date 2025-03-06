const output1_1 = document.querySelector('#part1_1');
const output1_2 = document.querySelector('#part1_2');
const output1_3 = document.querySelector('#part1_3');
const url = 'http://numbersapi.com/';


//part 1_1 : get number data
const part1_1 = async (number) => {
    try {
        const response = await axios(`${url}${number}?json`);           //demonstrating axios implementation.
        const data = await response.data;
        const type = String(data.type).toLocaleUpperCase();

        output1_1.innerHTML = `<strong>${type}</strong> ${data.text}`;

        return data.text;

    } catch (error) {
        console.error(`error in part1 function ${error}`);
    }
}


//part 1_2 : get multiple number's data
const part1_2 = async (numbers) => {
    try {
        const response = await fetch(`${url}${numbers.join(',')}?json`);    //demonstrating fetch usage.
        const data = await response.json();

        for (const key in data) {
            const li = document.createElement('li');
            li.innerHTML = `${data[key]}`;
            output1_2.append(li);
        }

        return data;
    } catch (error) {
        console.error(`error in part2 function ${error}`);
    }
}


//part 1_3 : get 4 facts from a number
const part1_3 = async (number) => {
    const returnableArray = [];
    try {
        for (i = 0; i < 4; i++) {
            const response = await axios(`${url}${number}?json`);           //demonstrating axios implementation.
            const data = await response.data.text;
            const li = document.createElement('li');
            li.innerHTML = `${data}`;
            output1_3.append(li);

            returnableArray.push(data);
        }

        return returnableArray;

    } catch (error) {
        console.error(`error in part1 function ${error}`);
    }
}


//tests
const pickANumber = () => Math.floor(Math.random() * 100);

console.log(part1_1(pickANumber()));
console.log(part1_2([pickANumber(), pickANumber()]));
console.log(part1_3(pickANumber()));
