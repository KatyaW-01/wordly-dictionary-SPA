function initialize() {
  const searchButton = document.querySelector("#button")
  const input = document.querySelector("#word")

  searchButton.addEventListener("click", (event) => {
    event.preventDefault(); 
    fetchDictionaryData(input.value)
  })
}

async function fetchDictionaryData(word) {
  if(typeof word !== "string" || word.trim() === "") { //if invalid input
    resetWebpage()
    displayError('Error: Please enter a valid word')
    return; 
  }
  const trimmedWord = word.trim() //accounts for if user puts extra spaces at beginning or end of the word
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${trimmedWord}`)
    if (!response.ok) {
      resetWebpage()
      displayError('Error: Word not found')
      return; //stop rest of function from running if api request doesnt go through
    }
    const data = await response.json()
    displayDictionaryData(data)
  } catch (error) {
    resetWebpage()
    displayError('Failed to load word data. Please try again.')
    console.error('Error fetching word data:', error)
  }
}

const wordResults = document.querySelector("#definition-columns")
const audioDiv = document.querySelector("#audio")
const wordDataSection = document.querySelector(".word-data")
const wordName = document.querySelector("#word-name")


function displayDictionaryData(data) {
  removeErrorMessages()

  resetWebpage()

  dataToObject(data) //returns an object with the dictionary data

  //display name of word entered
  const exampleDiv = document.createElement('div')
  exampleDiv.id = "example-box"
  const word = data[0].word
  capitalWord = word.charAt(0).toUpperCase() + word.slice(1)
  
  wordName.textContent = capitalWord 
  
  //display data for word entered
  for(const [key,value] of Object.entries(dataToObject(data))){
    if(key === "example" && value.length === 0) continue; //skips examples if there are none
    const header = document.createElement('h2')

    if(key !== "example") { //create div elements for parts of speech
      header.textContent = key.charAt(0).toUpperCase() + key.slice(1) 
      const section = document.createElement('div') 
      section.className = 'part-of-speech'
      section.id = key
      const list = document.createElement('ul')

      for(const definition of value) {
        const li = document.createElement('li')
        li.textContent = definition
        list.append(li)
      }

      section.append(header) 
      section.append(list) 
      wordResults.append(section) 
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

  displayPronunciation(data)
}

//helper functions

function resetWebpage() {
  audioDiv.innerHTML = "" //reset page if then display error message
  wordResults.innerHTML = ""
  wordName.textContent = ""
  const oldExampleDiv = document.getElementById('example-box')
  if(oldExampleDiv) {
    oldExampleDiv.remove()
  }
}

function dataToObject(data){
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

  return wordData
}

function displayPronunciation(data) {
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

function removeErrorMessages() {
  const errorMessage = document.querySelector("#error-message") 
  errorMessage.classList.add('hidden')
  errorMessage.textContent = ""
}

initialize() 