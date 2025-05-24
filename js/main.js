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
  const audioUrl = data[0].phonetics[0].audio
  const meanings = data.flatMap(entry => entry.meanings) //combines all meanings arrays into a single array

  const wordData = {Example: []}

  meanings.map((object) => {
    const definitionsArray = object.definitions //array of definition objects
    const definitions = definitionsArray.map(obj => obj["definition"]) //array of all the definition values from the objects

    if(!wordData[object.partOfSpeech]){ //if the key doesnt exist, create it
      wordData[object.partOfSpeech] = []
    }

    for(let i=0; i < definitions.length; i++) {
      wordData[object.partOfSpeech].push(definitions[i]) //push the definitions into the array
    }
  })

  meanings.forEach((meaning) => {
    meaning.definitions.forEach((definition) => {
      if(definition.example){ //if there are examples push into the array
        wordData["Example"].push(definition.example)
      }
    })
  })

  console.log("Word data object:",wordData)
}

function displayError(message) {

}

const searchButton = document.querySelector("#button")
const input = document.querySelector("#word")
searchButton.addEventListener("click", (event) => {
  event.preventDefault();
  fetchDictionaryData(input.value)
})