import { RED, GREEN, YELLOW, ANSI, HEAD, CODE, CYAN, MAGENTA } from "./ansi";
import { prompt, userName, mode } from "./main";

/* --- global variables --- */
let genNum = generateNumber();
let currentAttempt = 0;
let successfulAttempts = [];
let failedAttempts = [];
let attemptsNumber = 10;

export function welcomeText() {
  console.clear();
  console.log(HEAD, 'Welcome to the game "Bulls and Cows"', CODE);
  console.log(
    `

  ▒█▀▀█ █░░█ █░░ █░░ █▀▀ 　 █▀▀█ █▀▀▄ █▀▀▄ 　 ▒█▀▀█ █▀▀█ █░░░█ █▀▀ 
  ▒█▀▀▄ █░░█ █░░ █░░ ▀▀█ 　 █▄▄█ █░░█ █░░█ 　 ▒█░░░ █░░█ █▄█▄█ ▀▀█ 
  ▒█▄▄█ ░▀▀▀ ▀▀▀ ▀▀▀ ▀▀▀ 　 ▀░░▀ ▀░░▀ ▀▀▀░ 　 ▒█▄▄█ ▀▀▀▀ ░▀░▀░ ▀▀▀
  `
  );
  console.log(`${YELLOW}
GAME RULES:${ANSI}
 ⊳ I come up with a secret number, and YOU tries to guess it.
 ⊳ After each guess, I'll give you a hint to help you guess better next time.
 ⊳ The hint tells you how many bulls and how many cows there were.
 ${YELLOW} 
WHAT ARE BULLS AND COWS? ${ANSI}
 ⊳ If there are any matching digits and they are in their right positions, they are counted as "bulls".
 ⊳ If they are in different positions, they are counted as "cows".
 ${RED}
IMPORTANT:${ANSI}
 ⊳ The number must consist of 4 digits and each digit must be unique.
 ⊳ Type "exit" if you want to finish the game. 
 ${GREEN}
LET'S START PLAYING!
 ${ANSI}`);
}

export function generateNumber() {
  let str = "";
  while (str.length < 4) {
    let number = Math.floor(Math.random() * 9);

    if (str.indexOf(number) === -1) {
      str += number;
    }
  }

  console.clear();
  green(
    `The computer has already generated a secret number for you. Try to guess it!`
  );
  return str;
}

export function checkInput(input) {
  let rexExp1 = /([0-9]).*?\1/;
  let rexExp2 = /^\d+$/;

  if (input === "exit") {
    return true;
  } else if (!rexExp2.test(input)) {
    red("You did not enter a valid number, please try again.");
    return false;
  } else if (input.length !== 4) {
    red("The number must contain exactly 4 digits. Please try again.");
    return false;
  } else if (rexExp1.test(input)) {
    red(
      "The digits must be unique. Example: 1234, 7530, etc. Please try again."
    );
    return false;
  } else if (input === genNum || attemptsNumber === 1) {
    currentAttempt++;
    attemptsNumber = 10; // reset attempts for next game
    return roundComplete(input);
  } else {
    if (mode === "diff") attemptsNumber--;
    currentAttempt++;
    compare(input, genNum);
    return false;
  }
}

function compare(a, b) {
  let inputArr = a.split("");
  let genArr = b.split("");
  let bullCounter = 0;
  let cowCounter = 0;
  for (let i = 0; i < 4; i++) {
    if (inputArr[i] === genArr[i]) {
      bullCounter++;
      genArr[i] = null;
    }
    if (genArr.includes(inputArr[i])) cowCounter++;
  }

  // console.log(inputArr, genArr);
  showGuessResult(bullCounter, cowCounter);
  yellow("Next try:");
}

function showGuessResult(bullCounter, cowCounter) {
  const funMessages = [
    "No luck this time. Keep trying!",
    "Oops! Better luck next time.",
    "Don't give up! You can do it!",
    "Not quite there yet. Try a different approach.",
    "Nope, that's not it. Keep guessing!",
    "Hmm, not quite what we're looking for.",
    "Almost there! Keep going!",
    "No bulls or cows this time. Give it another shot!",
    "That guess didn't hit the mark. Try again!",
    "You're getting warmer. Keep guessing!",
  ];

  console.log(
    `\n${GREEN}Hint:${ANSI} ${YELLOW}${bullCounter}${ANSI} bull(s) and ${YELLOW}${cowCounter}${ANSI} cow(s)`
  );
  if (!bullCounter && !cowCounter) {
    const index = Math.floor(Math.random() * funMessages.length);
    magenta(funMessages[index]);
  }
  if (mode === "diff") console.log("Remaining attempts:", attemptsNumber);
}

function roundComplete(input) {
  console.clear();

  if (input !== genNum) {
    red(
      `${userName}, unfortunately, the number of attempts has expired. You didn't guess the number!`
    );
    failedAttempts.push(currentAttempt);
  } else {
    green(`Congratulations ${userName}! You guessed the secret number!`);
    successfulAttempts.push(currentAttempt);
  }
  green("Your result:");
  console.log("Current number of attempts:", currentAttempt);
  currentAttempt = 0; // reset counter

  const successfulSum = successfulAttempts.reduce((a, b) => a + b, 0);
  const failedSum = failedAttempts.reduce((a, b) => a + b, 0);

  let finalMessage = `\nSuccessful rounds: ${YELLOW}${successfulAttempts.length}${ANSI}.\n`;

  if (mode === "diff") {
    finalMessage += `Failed rounds: ${YELLOW}${failedAttempts.length}${ANSI}.\n`;
    finalMessage += `Overall attempts: ${YELLOW}${
      successfulSum + failedSum
    }${ANSI}. Rounds: ${YELLOW}${
      successfulAttempts.length + failedAttempts.length
    }${ANSI}`;
  } else {
    finalMessage += `Overall attempts: ${YELLOW}${
      successfulSum + failedSum
    }${ANSI}.`;
  }

  console.log(finalMessage);

  yellow(`${userName}, do you want to play again?`);
  const answer = prompt(
    cyan("Type 'yes', if you want to continue or press 'Enter' to exit: ")
  );
  if (answer === "yes" || answer === "y") {
    genNum = generateNumber();
    return false;
  } else {
    return true;
  }
}

/* --- additional functions --- */
function red(text) {
  console.log(`${RED}${text}${ANSI}`);
}
function magenta(text) {
  console.log(`${MAGENTA}${text}${ANSI}`);
}
export function green(text) {
  console.log(`\n${GREEN}${text}${ANSI}\n`);
}
export function yellow(text) {
  console.log(`\n${YELLOW}${text}${ANSI}\n`);
}
export function cyan(text) {
  return `${CYAN}${text}${ANSI}`;
}
