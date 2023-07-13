import promptSync from "prompt-sync";
import { welcomeText, checkInput, green, cyan, yellow } from "./functions";

welcomeText();

export const prompt = promptSync();
prompt.hide(cyan("Press Enter to continue... "));
console.clear();

export const userName = prompt(cyan("What is your name?: "), "Player");
yellow(`${userName}, do you want to play easy or difficult mode?`);
export const mode = prompt(
  cyan(
    "Type 'diff' to select difficult mode or press 'Enter' to play in easy mode): "
  ),
  "easy"
);

green(
  `${userName}, the computer has already generated a secret number for you. Try to guess it!`
);

let inputNum;

do {
  inputNum = prompt(cyan("You think this is a number: "));
} while (checkInput(inputNum) === false);

green(`Thanks for game, ${userName}! See you next time!`);
