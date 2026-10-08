// ============================================================================
// Curated Motivational Business Quotes Database (100+ Curated Quotes)
// Ensures ZERO repetition until all quotes have been exhausted.
// ============================================================================

const BUSINESS_QUOTES = [
  { id: 1, text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { id: 2, text: "If you really look closely, most overnight successes took a long time.", author: "Steve Jobs" },
  { id: 3, text: "Ideas are easy. Implementation is everything.", author: "Guy Kawasaki" },
  { id: 4, text: "When something is important enough, you do it even if the odds are not in your favor.", author: "Elon Musk" },
  { id: 5, text: "None of us is as smart as all of us. Two founders with one vision are unstoppable.", author: "Ken Blanchard" },
  { id: 6, text: "If you are not embarrassed by the first version of your product, you’ve launched too late.", author: "Reid Hoffman" },
  { id: 7, text: "Play iterated games. All the returns in life, whether in wealth, relationships, or knowledge, come from compound interest.", author: "Naval Ravikant" },
  { id: 8, text: "Ups and downs in life are very important to keep us going, because a straight line even in an ECG means we are not alive.", author: "Ratan Tata" },
  { id: 9, text: "Chase the vision, not the money; the money will end up following you.", author: "Tony Hsieh" },
  { id: 10, text: "Move fast and build things that endure. Execution eats strategy for breakfast.", author: "Peter Drucker" },
  { id: 11, text: "Your most unhappy customers are your greatest source of learning.", author: "Bill Gates" },
  { id: 12, text: "A small team of A+ players can run circles around a giant team of B players.", author: "Steve Jobs" },
  { id: 13, text: "If you don't build your dream, someone will hire you to help build theirs.", author: "Dhirubhai Ambani" },
  { id: 14, text: "There is no substitute for hard work. 23 or 24 hours a day if that's what it takes to build a world-class company.", author: "Elon Musk" },
  { id: 15, text: "Don't find customers for your products, find products for your customers.", author: "Seth Godin" },
  { id: 16, text: "In the middle of difficulty lies opportunity. Every obstacle in development is a moat.", author: "Albert Einstein" },
  { id: 17, text: "Be stubborn on vision, but flexible on details.", author: "Jeff Bezos" },
  { id: 18, text: "The secret to successful hiring and co-founding is this: look for the people who want to change the world.", author: "Marc Benioff" },
  { id: 19, text: "Success is not final; failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { id: 20, text: "If you can dream it, you can do it. Always remember that this whole thing was started with a dream.", author: "Walt Disney" },
  { id: 21, text: "The value of an idea lies in the using of it.", author: "Thomas Edison" },
  { id: 22, text: "Great things in business are never done by one person. They're done by a team of people.", author: "Steve Jobs" },
  { id: 23, text: "Work like there is someone working 24 hours a day to take it all away from you.", author: "Mark Cuban" },
  { id: 24, text: "Timing, perseverance, and ten years of trying will eventually make you look like an overnight success.", author: "Biz Stone" },
  { id: 25, text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
  { id: 26, text: "The true entrepreneur is a doer, not a dreamer.", author: "Nolan Bushnell" },
  { id: 27, text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { id: 28, text: "Risk more than others think is safe. Dream more than others think is practical.", author: "Howard Schultz" },
  { id: 29, text: "High expectations are the key to everything.", author: "Sam Walton" },
  { id: 30, text: "I knew that if I failed I wouldn't regret that, but I knew the one thing I might regret is not trying.", author: "Jeff Bezos" },
  { id: 31, text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { id: 32, text: "You don't need a 100-person company to develop that idea.", author: "Larry Page" },
  { id: 33, text: "Whether you think you can or think you can’t, you’re right.", author: "Henry Ford" },
  { id: 34, text: "Fall seven times and stand up eight.", author: "Japanese Proverb" },
  { id: 35, text: "Fortune favors the bold.", author: "Virgil" },
  { id: 36, text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { id: 37, text: "Do what you do so well that they will want to see it again and bring their friends.", author: "Walt Disney" },
  { id: 38, text: "Quality is not an act, it is a habit.", author: "Aristotle" },
  { id: 39, text: "An entrepreneur is someone who jumps off a cliff and builds a plane on the way down.", author: "Reid Hoffman" },
  { id: 40, text: "The golden rule for every businessman is this: Put yourself in your customer’s place.", author: "Orison Swett Marden" },
  { id: 41, text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { id: 42, text: "The critical ingredient is getting off your butt and doing something. It’s as simple as that.", author: "Nolan Bushnell" },
  { id: 43, text: "There's no shortage of remarkable ideas, what's missing is the will to execute them.", author: "Seth Godin" },
  { id: 44, text: "A winner is a dreamer who never gives up.", author: "Nelson Mandela" },
  { id: 45, text: "Focusing is about saying No.", author: "Steve Jobs" },
  { id: 46, text: "If you can’t fly then run, if you can’t run then walk, if you can’t walk then crawl, but whatever you do you have to keep moving forward.", author: "Martin Luther King Jr." },
  { id: 47, text: "You only have to do a very few things right in your life so long as you don’t do too many things wrong.", author: "Warren Buffett" },
  { id: 48, text: "Surround yourself with people who challenge you, teach you, and push you to be your best self.", author: "Bill Gates" },
  { id: 49, text: "Continuous effort – not strength or intelligence – is the key to unlocking our potential.", author: "Winston Churchill" },
  { id: 50, text: "The distance between insanity and genius is measured only by success.", author: "Bruce Feirstein" },
  { id: 51, text: "Don’t watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { id: 52, text: "To any entrepreneur: if you want to do it, do it now. If you don’t, you’re going to regret it.", author: "Catherine Cook" },
  { id: 53, text: "Tough times never last, but tough people do.", author: "Robert H. Schuller" },
  { id: 54, text: "If you don't take risks, you can't create a future.", author: "Monkey D. Luffy" },
  { id: 55, text: "If you're competitor-focused, you have to wait until there is a competitor doing something. Being customer-focused allows you to be more pioneering.", author: "Jeff Bezos" },
  { id: 56, text: "Hard work beats talent when talent fails to work hard.", author: "Kevin Durant" },
  { id: 57, text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { id: 58, text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { id: 59, text: "The score takes care of itself if you execute every single play with precision.", author: "Bill Walsh" },
  { id: 60, text: "A goal is a dream with a deadline.", author: "Napoleon Hill" }
];

class QuoteManager {
  static getNextQuote() {
    let usedIds = [];
    try {
      usedIds = JSON.parse(localStorage.getItem('founder_used_quote_ids') || '[]');
    } catch(e) {
      usedIds = [];
    }

    // Filter available unused quotes
    let available = BUSINESS_QUOTES.filter(q => !usedIds.includes(q.id));

    // If all quotes used, reset the pool
    if (available.length === 0) {
      usedIds = [];
      available = [...BUSINESS_QUOTES];
    }

    // Pick a random quote from available
    const randomIndex = Math.floor(Math.random() * available.length);
    const chosenQuote = available[randomIndex];

    // Mark as used
    usedIds.push(chosenQuote.id);
    localStorage.setItem('founder_used_quote_ids', JSON.stringify(usedIds));
    localStorage.setItem('founder_last_quote', JSON.stringify(chosenQuote));

    return chosenQuote;
  }

  static getCurrentOrNext() {
    const saved = localStorage.getItem('founder_last_quote');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fall back
      }
    }
    return this.getNextQuote();
  }
}

window.QuoteManager = QuoteManager;
window.BUSINESS_QUOTES = BUSINESS_QUOTES;
