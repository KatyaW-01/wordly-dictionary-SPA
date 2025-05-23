async function fetchDictionaryData(word) {
  if(typeof word !== "string" || word.trim() === "") { //if invalid input
    displayError('Error: Please enter a valid word')
    return; //try block wont run if there is an error
  }
  const trimmedWord = word.trim() //accounts for if user puts extra spaces at beginning or end of the word
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${trimmedWord}`)
    if (!response.ok) {
      displayError('Error: Word not found')
      return; //stop rest of function from running if api request doesnt go through
    }
    const data = await response.json()
    displayDictionaryData(data)
  } catch (error) {
    displayError('Failed to load word data. Please try again.')
    console.error('Error fetching word data:', error)
  }
}

function displayDictionaryData(data) {
  let partOfSpeech;
  let definition;
  let exampleUsage;
  const meanings = data[0].meanings //array of objects, each object being a part of speech with definition
  
}

function displayError(message) {

}

const searchButton = document.querySelector("#button")
const input = document.querySelector("#word")
searchButton.addEventListener("click", (event) => {
  event.preventDefault();
  fetchDictionaryData(input.value)
})