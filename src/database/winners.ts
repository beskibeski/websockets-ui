import IWinner from '../models/winner';

let winners: IWinner[] = [];

const addWinner = (winnerName: string) => {
  if (winners.find((lastWinner) => lastWinner.name === winnerName) === undefined) {
    winners.push({ name: winnerName, wins: 0 }); 
  }
};

const addWinToWinner = (winner: IWinner) => {
  winners.map((lastWinner) => {
    if (lastWinner.name === winner.name) {
      lastWinner.wins += 1;
    }
  })  
};

const getWinners = (): IWinner[] => {
  return winners;
}

export { addWinner, getWinners, addWinToWinner };