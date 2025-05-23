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
  const audioUrl = data[0].phonetics[0].audio
  console.log(audioUrl)
 
  const meanings = data.filter(entry => entry.word === input.value).flatMap(entry => entry.meanings)
  console.log(meanings) //array of objects, each object having part of speach and definitions
}

function displayError(message) {

}

const searchButton = document.querySelector("#button")
const input = document.querySelector("#word")
searchButton.addEventListener("click", (event) => {
  event.preventDefault();
  fetchDictionaryData(input.value)
})