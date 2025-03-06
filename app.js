let favNumber = 5;
let baseURL = "http://numbersapi.com";

// 1.
// we are grabbing just the favorite number here //
// try to pass in a string, what heppends then ? //
async function part1() {
  try {
    let response = await axios.get(`${baseURL}/${favNumber}?json`);
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching data for part1:", error);
  }
}
part1();

// 2.
// Now we will try to get miltiple responses by passing in an array //
// try switching up the numbers in the array //
const favNumbers = [7, 11, 22];
async function part2() {
  try {
    let response = await axios.get(`${baseURL}/${favNumbers}?json`);
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching data for part2:", error);
  }
}
part2();

// 3. 
// Finally we will take a look at displaying the esults 
async function part3() {
  const button = document.querySelector("button");
  button.addEventListener("click", clickAndDisplayData);

  async function clickAndDisplayData() {
    try {
      let facts = await Promise.all(
        Array.from({ length: 4 }, () => axios.get(`${baseURL}/${favNumber}?json`))
      );
      facts.forEach(response => {
        document.body.insertAdjacentHTML('beforeend', `<p>${response.data.text}</p>`);
      });
    } catch (error) {
      console.error("Error fetching data for part3:", error);
    }
  }
}
part3();