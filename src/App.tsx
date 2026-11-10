import { useState, useEffect, useRef } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'


export type Suit = '♠' | '♥' | '♦' | '♣';
export type CardName = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
interface Card {
  name: string,
  suit: string,
  weight: number,
}

function getWeight(value: cardName): number {
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
  private cards: Card[];
  private numDecks: number;

  constructor(numDecks: number = 6) {
    this.numDecks = numDecks;
    this.resetAndShuffle();
  }

  resetAndShuffle() {
    const newCards: Card[] = [];
    const suits: Suit[] = ['♠', '♥', '♦', '♣']; 
    const cardNames: cardName[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
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

function App() {
  const [count, setCount] = useState(0)
  const shoe = useRef<Shoe>(new Shoe(6));  
  let [card, setCard] = useState<Card>(shoe.current.draw());

  useEffect(() => {
    
    const intervalId = setInterval(() => {
      const nextCard = shoe.current.draw();
      if (nextCard) {
        setCard(nextCard)
      }
    }, 1000)
    return clearInterval(intervalId)
  }, [])
  

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
          Cards are {card.name} of {card.suit}
        </button>
        <button 
          type="button"
          className="counter"
          onClick={() => setCard(() => shoe.current.draw())}
          >
            Card is {card.name} of {card.suit}
          </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
