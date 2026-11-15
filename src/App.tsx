import { useState, useEffect, useRef } from 'react'
import './App.css'
import { type Card, PlayingCard, type CardName } from './components/PlayingCard'
import type { Suit } from './components/PlayingCard'
import { CardHand } from './components/CardHand';




function getWeight(value: CardName): number {
  switch (value) {
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
      return 1;
    case '10':
    case 'J':
    case 'Q':
    case 'K':
    case 'A':
      return -1;
    default:
      return 0;
  }
  
}

class Shoe {
  private cards: Card[] = [];
  private numDecks: number;

  constructor(numDecks: number = 6) {
    this.numDecks = numDecks;
    this.resetAndShuffle();
  }

  resetAndShuffle() {
    const newCards: Card[] = [];
    const suits: Suit[] = ['♠', '♥', '♦', '♣']; 
    const cardNames: CardName[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    for (let i=0; i < this.numDecks; i++) {
      for (let suit of suits) {
        for (let cardName of cardNames)
          newCards.push({
            name: cardName,
            suit: suit,
          })
      }
      this.cards = newCards;
      this.shuffle();
    }
  }

  shuffle() {
    for (let i=0; i<this.cards.length-1; i++){
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  draw(): Card | undefined{
    return this.cards.pop()
  }

  hasMore(): Boolean {
    return this.cards.length > 0;
  }
}

interface Trainer {
  currentCards: Card[];
  isRunning: Boolean;
  secondsPerCard: number;
  numCards: number;
  numDecks: number;
  count: number;
  hideCount: Boolean;
  stop: () => void;
  start: () => void;
  reset: () => void;
  changeSecondsPerCard: (secondsPerCard: number) => void;
  changeNumCards: (numCards: number) => void;
  changeNumDecks: (numDecks: number) => void;
  toggleHideCount: () => void;
}

function useTrainer() : Trainer{
  const [numDecks, setNumDecks] = useState<number>(6);
  const shoeRef = useRef<Shoe>(new Shoe(numDecks));
  const [currentCards, setCurrentCards] = useState<Card[]>([]);
  const [isRunning, setIsRunning] = useState<Boolean>(false);
  const [secondsPerCard, setSecondsPerCard] = useState<number>(1);
  const [numCards, setNumCards] = useState<number>(1);
  const [count, setCount] = useState<number>(0);
  const [hideCount, setHideCount] = useState<Boolean>(false);

  const start = () => {
    console.log("starting")
    setIsRunning(true);
  }
  const stop = () => {
    console.log("stopping")
    setIsRunning(false);
    
  }
  const reset = () => {
    console.log("resetting")
    shoeRef.current.resetAndShuffle();
    setCurrentCards([]);
    setCount(0);
  }

  const changeSecondsPerCard = (seconds: number) => {
    setSecondsPerCard(seconds);
  }

  const changeNumCards = (num: number) => {
    setNumCards(num);
  }

  const changeNumDecks = (num: number) => {
    setNumDecks(num);
  }

  const toggleHideCount = () => {
    setHideCount(!hideCount);
  }

  useEffect(() => {
    if (!isRunning) {
      return
    }
    const intervalId = setInterval(() => {
      const nextCards = [];
      for (let i = 0; i < numCards; i++) {
        const nextCard = shoeRef.current.draw();
        if (nextCard) {
          nextCards.push(nextCard);
          setCount(getWeight(nextCard.name));
        } else {
          setIsRunning(false)
        }
        setCurrentCards(nextCards);
      }
    }, secondsPerCard * 1000);
    return () => clearInterval(intervalId);
    }, [isRunning, secondsPerCard]);

  return {currentCards: currentCards, isRunning, secondsPerCard, numCards, numDecks, count, hideCount, stop, start, reset, changeSecondsPerCard, changeNumCards, changeNumDecks, toggleHideCount}


}


function App() {
  const trainer = useTrainer();
  return (
    <>
      <section id="center">

        <div className="cardViewer">
          <CardHand cards={trainer.currentCards}></CardHand>
        </div>

        <div className="countDisplay">
          <button onClick={trainer.toggleHideCount}>{trainer.hideCount ? 'Show Count' : 'Hide Count'}</button>
          <div className="countLabel" hidden={trainer.hideCount? true: false}>Count: {trainer.count}</div>
        </div>

        <div className="controls">
          <button onClick={trainer.start} disabled={trainer.isRunning? true: false}>
            Go  
          </button>
          <button onClick={trainer.stop} disabled={trainer.isRunning? false: true}>
            Stop
          </button>
          <button onClick={trainer.reset} disabled={trainer.isRunning? true: false}>
            Reset
          </button>
        </div>
        <div className="inputGroup">
          <label>Seconds per card:</label>
          <input type="number" min="1" step="1" value={trainer.secondsPerCard} onChange={(e) => trainer.changeSecondsPerCard(Number(e.target.value))} />
          <label>Number of cards:</label>
          <input type="number" min="1" max="5" step="1" value={trainer.numCards} onChange={(e) => trainer.changeNumCards(Number(e.target.value))} />
          <label>Number of decks:</label>
          <input type="number" min="1" max="8" step="1" value={trainer.numDecks} onChange={(e) => trainer.changeNumDecks(Number(e.target.value))} />
        </div>


      </section>
      <section id="spacer"></section>
    </>
  )
}

export default App
