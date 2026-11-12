import { useState, useEffect, useRef } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { PlayingCard, type CardName } from './components/PlayingCard'
import type { Suit } from './components/PlayingCard'


interface Card {
  name: CardName,
  suit: Suit,
  weight: number,
}

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
            weight: getWeight(cardName)
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

  draw(): Card {
    return this.cards.pop()
  }

  hasMore(): Boolean {
    return this.cards.length > 0;
  }
}

interface Trainer {
  currentCard: Card| null;
  isRunning: Boolean;
  secondsPerCard: number;
  numCards: number;
  numDecks: number;
  count: number;
  stop: () => void;
  start: () => void;
  reset: () => void;
  changeSecondsPerCard: (secondsPerCard: number) => void;
  changeNumCards: (numCards: number) => void;
  changeNumDecks: (numDecks: number) => void;
}

function useTrainer() : Trainer{
  const [numDecks, setNumDecks] = useState<number>(6);
  const shoeRef = useRef<Shoe>(new Shoe(numDecks));
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [isRunning, setIsRunning] = useState<Boolean>(false);
  const [secondsPerCard, setSecondsPerCard] = useState<number>(1);
  const [numCards, setNumCards] = useState<number>(1);
  const [count, setCount] = useState<number>(0);

  const start = () => {
    console.log("starting trainer")
    setIsRunning(true);
  }
  const stop = () => {
    console.log("stopping trainer")
    setIsRunning(false);
  }
  const reset = () => {
    shoeRef.current.resetAndShuffle();
    setCurrentCard(null);
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

  useEffect(() => {
    if (!isRunning) {
      return
    }
    const intervalId = setInterval(() => {
      const nextCard = shoeRef.current.draw();
      if (nextCard) {
        setCurrentCard(nextCard)
        setCount(getWeight(nextCard.name));
      } else {
        setIsRunning(false)
      }
    }, secondsPerCard * 1000);
    return () => clearInterval(intervalId);
    }, [isRunning, secondsPerCard]);

  return {currentCard, isRunning, secondsPerCard, numCards, numDecks, count, stop, start, reset, changeSecondsPerCard, changeNumCards, changeNumDecks}


}


function App() {
  const [count, setCount] = useState(0)
  const trainer = useTrainer();

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}

          Cards are {trainer.currentCard?.name} of {trainer.currentCard?.suit}
        </button>
        <div className="controls">
          <button onClick={trainer.start}>
            Go  
          </button>
          <button onClick={trainer.stop}>
            Stop
          </button>
          <button onClick={trainer.reset}>
            Reset
          </button>
          <input type="number" min="1" step="1" value={trainer.secondsPerCard} onChange={(e) => trainer.changeSecondsPerCard(Number(e.target.value))} />
          <input type="number" min="1" step="1" value={trainer.numCards} onChange={(e) => trainer.changeNumCards(Number(e.target.value))} />
          <input type="number" min="1" max="8" step="1" value={trainer.numDecks} onChange={(e) => trainer.changeNumDecks(Number(e.target.value))} />
        </div>um


        <div className="cards">

          current card is {trainer.currentCard?.name} of {trainer.currentCard?.suit}
          
          {trainer.currentCard ? (
            <PlayingCard name={trainer.currentCard.name} suit={trainer.currentCard.suit} />
          ) : (
            <PlayingCard name={'A'} suit={'♠'} />
          )}
        </div>

      </section>
      <section id="spacer"></section>
    </>
  )
}

export default App
