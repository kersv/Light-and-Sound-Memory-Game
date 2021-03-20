// Global Constants
const clueHoldTime = 1000;  // how long to hold each clue's light/sound
const cluePauseTime = 333;  // how long to pause in between clues
const nextClueWaitTime = 1000;  // how long to wait before starting playback of the clue sequence

// Global Variables
var pattern = [2, 2, 4, 3, 2, 1, 2, 4];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; // must be between 0.0 and 1.0
var guessCounter = 0;

function startGame()
{
  // initialize game variables
  progress = 0;
  gamePlaying = true;
  
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame()
{
  // initialize game variables
  gamePlaying = false;
  
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}

function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}

function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}

function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function lightButton(btn)
{
  document.getElementById("button"+btn).classList.add("lit")
}

function clearButton(btn)
{
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn)
{
  if(gamePlaying)
    {
      lightButton(btn);
      playTone(btn, clueHoldTime);
      setTimeout(clearButton, clueHoldTime, btn);      // setTimeout built-in JavaScript function
    }
}


function playClueSequence()
{
  guessCounter = 0;
  let delay = nextClueWaitTime;  // set delay to inital wait time
  for(let i = 0; i <= progress; i++)  // for each clue that is reveal so far
    {
      console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
      setTimeout(playSingleClue, delay, pattern[i])  // set a timeout to play that clue
      delay += clueHoldTime
      delay += cluePauseTime;
    }  
}

function loseGame()
{
  stopGame();
  alert("Game Over. You lost.");
}

function winGame()
{
  stopGame();
  alert("Game Over. You win!");
}

function guess(btn)
{
  console.log("user guessed: " + btn);
  if(!gamePlaying)
    {
      return;
    }
  
  // add game logic here
  
  if(pattern[guessCounter] == btn)  // if guessed button was correct
    {
      if(guessCounter == progress)  // if guess is equal to the current progress of the clue sequence
        {
        if(progress == pattern.length -1 ) // if progress is equal to the length in array to be quessed 
          {
            winGame();                    // prompt win ending
          }
        else                              // guess correct, next clue
          {
            progress++;                   // increment progress for each correct guess
            playClueSequence();           
          }
        }
      else                          // get next clue
        {
          guessCounter++;
        }
    }
  else                              // guess was incorrect
  {
    loseGame();                     // prompt lose ending
  }
}



