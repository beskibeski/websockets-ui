import IWinner from '../models/winner';

let winners: IWinner[] = [];

const addWinner = (winnerName: string) => {
  if (winners.find((lastWinner) => lastWinner.name === winnerName) === undefined) {
    winners.push({ name: winnerName, wins: 0 }); 
  }
};

const addWinToWinner = (winnerName: string) => {
  winners.forEach((winner) => {
    if (winner.name === winnerName) {
      winner.wins += 1;
    }
  });
};

const getWinners = (): IWinner[] => {
  return winners;
};

export { addWinner, getWinners, addWinToWinner };