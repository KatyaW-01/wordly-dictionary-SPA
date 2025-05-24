function initialize() {
  const searchButton = document.querySelector("#button")
  const input = document.querySelector("#word")

  searchButton.addEventListener("click", (event) => {
    event.preventDefault(); //stops page from reloading on submit
    fetchDictionaryData(input.value)
  })
}

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

const wordResults = document.querySelector("#definition-columns")
const audioDiv = document.querySelector("#audio")
const wordDataSection = document.querySelector(".word-data")


function displayDictionaryData(data) {
  //get the data from the api
  const phonetics = data[0].phonetics
  const audioObj = phonetics.find(obj => obj.audio)
  let audioUrl;
  if(audioObj) {
    audioUrl = audioObj.audio
  }
  const text = phonetics.find(obj => obj.text)
  let phoneticsText;
  if(text) {
    phoneticsText = text.text
  }
  const meanings = data.flatMap(entry => entry.meanings) //combines all meanings arrays into a single array
  const wordData = {example: []}

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
        wordData["example"].push(definition.example)
      }
    })
  })

  //Display the Data
  audioDiv.innerHTML = "" //reset html with every search
  wordResults.innerHTML = ""
  const oldExampleDiv = document.getElementById('example-box')
  if(oldExampleDiv) {
    oldExampleDiv.remove()
  }

  const exampleDiv = document.createElement('div')
  exampleDiv.id = "example-box"
  

  for(const [key,value] of Object.entries(wordData)){
    if(key === "example" && value.length === 0) continue; //skips examples if there are none
    const header = document.createElement('h2')

    if(key !== "example") { //create div elements for parts of speech
      header.textContent = key.charAt(0).toUpperCase() + key.slice(1) //capitalize first letter of the key
      const section = document.createElement('div') 
      section.className = 'part-of-speech'
      section.id = key
      const list = document.createElement('ul')

      for(const definition of value) {
        const li = document.createElement('li')
        li.textContent = definition
        list.append(li)
      }

      section.append(header) //attach header to the div
      section.append(list) //attach list to div
      wordResults.append(section) //attach div to the main div of definition columns in the html
    }

    if(key === "example" && value.length > 0) { //create list of examples
      const exampleList = document.createElement('ul')
      header.textContent = "Example Sentences"

      for(const example of value) {
        const listElement = document.createElement('li')
        listElement.textContent = example
        exampleDiv.append(header)
        exampleList.append(listElement)
        exampleDiv.append(exampleList)
        wordDataSection.append(exampleDiv)
      }
    }
  }

  //display word pronunciation
  if(phoneticsText){
    const span = document.createElement('span')
    span.id = 'phonetics'
    span.textContent = phoneticsText
    audioDiv.append(span)
  }

  if(audioUrl){ //checks if the url exists
    const audio = document.createElement('audio')
    audio.src = audioUrl
    audio.controls = true
    audioDiv.append(audio)
  }

}

function displayError(message) {
  const error = document.querySelector("#error-message")
  error.classList.remove('hidden')
  error.textContent = message
}

initialize()