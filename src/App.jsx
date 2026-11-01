import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Volume2,
  VolumeX,
  Music2,
  RotateCcw,
} from "lucide-react";

const TOTAL = 7;
const messages = [
  "Wrong button, madam! 😂",
  "Are you trying to escape?",
  "I know you're curious!",
  "Okay, I'll wait... not really 😂",
];
const loadSave = () => {
  try {
    return JSON.parse(localStorage.getItem("little-love-story") || "{}");
  } catch {
    return {};
  }
};

function FloatingHearts() {
  return (
    <div className="hearts" aria-hidden="true">
      {Array.from({ length: 13 }, (_, i) => (
        <span
          key={i}
          style={{
            "--i": i,
            "--x": `${(i * 37) % 100}%`,
            "--d": `${11 + (i % 7) * 2}s`,
            "--s": `${12 + (i % 4) * 7}px`,
          }}
        >
          {["♡", "♥", "✦"][i % 3]}
        </span>
      ))}
    </div>
  );
}
function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <button
      className={`button ${variant} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
function Topbar({ step, onBack, sound, setSound, music, setMusic, restart }) {
  return (
    <header className="topbar">
      <div className="brand-group">
        {step > 0 && (
          <button
            className="icon-btn back-btn"
            onClick={onBack}
            aria-label="Go to previous page"
          >
            <ArrowLeft size={16} />
          </button>
        )}
        <button className="brand" onClick={restart} aria-label="Restart">
          <span className="brand-mark">♡</span> little things
        </button>
      </div>
      <div className="top-actions">
        <button
          className="icon-btn"
          onClick={() => setSound(!sound)}
          aria-label={sound ? "Mute sound" : "Enable sound"}
        >
          {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </button>
        <button
          className="icon-btn"
          onClick={() => setMusic(!music)}
          aria-label="Toggle music"
        >
          <Music2 size={17} />
          <span className={`music-dot ${music ? "on" : ""}`} />
        </button>
        <button
          className="icon-btn restart"
          onClick={restart}
          aria-label="Restart experience"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </header>
  );
}
function Progress({ step, go }) {
  return (
    <div className="progress-wrap">
      <div className="progress-label">
        <span>YOUR LITTLE JOURNEY</span>
        <span>
          {String(step + 1).padStart(2, "0")} <i>/ 07</i>
        </span>
      </div>
      <div className="progress-track">
        {Array.from({ length: TOTAL }, (_, i) => (
          <button
            key={i}
            aria-label={`Go to chapter ${i + 1}`}
            onClick={() => go(i)}
            className={`progress-segment ${i <= step ? "filled" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
function PageTransition({ children, step }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      key={step}
      className="page"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
      transition={{ duration: 0.38, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
function Intro({ next }) {
  const [opened, setOpened] = useState(false);
  return (
    <section className="hero intro">
      <div className="eyebrow">
        <span className="eyebrow-star">✦</span> A tiny note for you{" "}
        <span className="eyebrow-star">✦</span>
      </div>
      <h1>
        Hey You! <span className="pink">💗</span>
      </h1>
      <p className="subtitle">
        I have something special
        <br className="mobile-only" /> to tell you...
      </p>
      <div
        className={`envelope ${opened ? "open" : ""}`}
        onClick={() => setOpened(true)}
        role="button"
        tabIndex="0"
        aria-label="Open the envelope"
        onKeyDown={(e) => e.key === "Enter" && setOpened(true)}
      >
        <div className="envelope-glow" />
        <div className="letter">
          <span>for you</span>
          <Heart size={24} fill="currentColor" />
        </div>
        <div className="envelope-back" />
        <div className="envelope-flap" />
        <div className="envelope-front" />
        <span className="seal">♥</span>
      </div>
      <div className="character">
        ૮ ˶ᵔ ᵕ ᵔ˶ ა <span>♡</span>
      </div>
      <Button
        onClick={() => {
          setOpened(true);
          setTimeout(next, 500);
        }}
      >
        START <ArrowRight size={16} />
      </Button>
      <small className="hint">psst... tap the envelope too</small>
    </section>
  );
}
function Funny({ next }) {
  const [noCount, setNoCount] = useState(0);
  const [pos, setPos] = useState({});
  const dodge = () => {
    if (noCount >= 1) next();
    setNoCount((c) => c + 1);
    setPos({
      left: `${12 + Math.random() * 48}%`,
      top: `${15 + Math.random() * 60}%`,
    });
  };
  return (
    <section className="hero funny">
      <div className="sticker">🙈</div>
      <div className="eyebrow">CHAPTER 01 · THE VERY SERIOUS CHECK</div>
      <h2>
        Before we continue...
        <br />
        <span className="serif">are you ready for some nonsense?</span> 😂
      </h2>
      <p className="subtitle">
        There may be absolutely no useful information ahead.
      </p>
      <div className="choice-area">
        <Button onClick={next}>
          YES, LET'S GO <Heart size={16} fill="currentColor" />
        </Button>
        <Button
          variant="soft"
          className="no-button"
          style={noCount ? { position: "absolute", ...pos } : {}}
          onMouseEnter={() => {
            if (window.matchMedia("(hover: hover)").matches) dodge();
          }}
          onClick={dodge}
        >
          NO, I'M TOO CUTE 😎
        </Button>
      </div>
      <div className="reaction" key={noCount}>
        {noCount
          ? messages[(noCount - 1) % messages.length]
          : "Choose wisely. Or don’t. I’m not your boss."}
      </div>
      <div className="tiny-note">
        (you can say no — this button is just dramatically shy)
      </div>
    </section>
  );
}
function HeartGame({ next, score, setScore, done, setDone, sound, setSound }) {
  const [time, setTime] = useState(20);
  const [active, setActive] = useState(false);
  const timer = useRef(null);
  useEffect(() => {
    if (!active || done) return;
    timer.current = setInterval(
      () =>
        setTime((t) => {
          if (t <= 1) {
            clearInterval(timer.current);
            setDone(true);
            return 0;
          }
          return t - 1;
        }),
      1000,
    );
    return () => clearInterval(timer.current);
  }, [active, done, setDone]);
  const collect = (e) => {
    if (e.currentTarget.classList.contains("caught")) return;
    e.currentTarget.classList.add("caught");
    setScore((s) => s + 1);
    if (sound) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator(),
          g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = 660 + Math.random() * 330;
        g.gain.setValueAtTime(0.04, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        o.start();
        o.stop(ctx.currentTime + 0.12);
      } catch {}
    }
    if (score + 1 >= 10) {
      setDone(true);
      clearInterval(timer.current);
    }
  };
  return (
    <section className="hero game-page">
      <div className="eyebrow">CHAPTER 02 · A SMALL TEST OF REFLEXES</div>
      <h2>
        Catch my heart <span className="pink">♡</span>
      </h2>
      <p className="subtitle">
        Tap as many falling hearts as you can in 20 seconds.
      </p>
      <div className="game-hud">
        <div>
          <small>HEARTS CAUGHT</small>
          <strong>
            {score.toString().padStart(2, "0")}{" "}
            <Heart size={16} fill="currentColor" />
          </strong>
        </div>
        <div className={`timer ${time <= 5 ? "urgent" : ""}`}>
          <small>TIME LEFT</small>
          <strong>00:{time.toString().padStart(2, "0")}</strong>
        </div>
        <button className="sound-toggle" onClick={() => setSound(!sound)}>
          {sound ? <Volume2 size={15} /> : <VolumeX size={15} />}{" "}
          {sound ? "sound on" : "muted"}
        </button>
      </div>
      <div className={`game-board ${active && !done ? "playing" : ""}`}>
        {Array.from({ length: 9 }, (_, i) => (
          <button
            key={i}
            className={`falling-heart heart-${i}`}
            style={{
              "--delay": `${(i % 5) * 0.58}s`,
              "--duration": `${2.8 + (i % 4) * 0.45}s`,
            }}
            onClick={collect}
            aria-label="Catch heart"
          >
            ♥
          </button>
        ))}
        {!active && !done && (
          <div className="game-overlay">
            <span>♡</span>
            <strong>Ready, catcher?</strong>
            <Button
              onClick={() => {
                setActive(true);
                setTime(20);
              }}
            >
              START CATCHING
            </Button>
          </div>
        )}
        {done && (
          <div className="game-overlay result">
            <span>💝</span>
            <strong>
              {score >= 10
                ? "Wow! You collected my heart too! ❤️"
                : "Every heart counts. Mine included! ❤️"}
            </strong>
            <Button onClick={next}>
              CONTINUE <ArrowRight size={15} />
            </Button>
          </div>
        )}
      </div>
      <p className="game-footnote">
        Catch 10 hearts to win — or just enjoy the chaos.
      </p>
    </section>
  );
}
const story = [
  {
    n: "01",
    title: "The Beginning",
    text: "Every beautiful story starts somewhere.",
    img: "photo-one",
    caption: "a little hello",
  },
  {
    n: "02",
    title: "Your Smile",
    text: "One smile can make an ordinary day special.",
    img: "photo-two",
    caption: "your kind of magic",
  },
  {
    n: "03",
    title: "Your Happiness",
    text: "Your happiness is something worth celebrating.",
    img: "photo-three",
    caption: "all the good things",
  },
  {
    n: "04",
    title: "My Favourite Person",
    text: "Some people make life a little brighter.",
    img: "photo-four",
    caption: "you, obviously",
  },
];
function Story({ next }) {
  return (
    <section className="story-page">
      <div className="story-heading">
        <div className="eyebrow">CHAPTER 03 · A FEW LITTLE THINGS</div>
        <h2>
          Our little <span className="serif pink">love story</span>
        </h2>
        <p className="subtitle">
          The things that make this story feel like ours.
        </p>
      </div>
      <div className="story-list">
        {story.map((item, i) => (
          <motion.article
            className={`story-card ${i % 2 ? "reverse" : ""}`}
            key={item.n}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55 }}
          >
            <div className={`story-visual ${item.img}`}>
              <div className="visual-orb">{["🌷", "☀️", "🦋", "✨"][i]}</div>
              <span className="visual-caption">
                {item.caption} <Heart size={11} />
              </span>
              <span className="visual-number">{item.n}</span>
            </div>
            <div className="story-copy">
              <span className="story-kicker">LITTLE THING {item.n}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span className="scribble">
                with a little love <span>♡</span>
              </span>
            </div>
          </motion.article>
        ))}
      </div>
      <div className="story-next">
        <Button onClick={next}>
          NEXT LITTLE THING <ArrowRight size={15} />
        </Button>
      </div>
    </section>
  );
}
const questions = [
  {
    q: "Who is the cutest person here?",
    options: ["Me", "Obviously you ❤️"],
    correct: 1,
    reactions: ["Bold answer. I respect it 😂", "Correct. The judges agree."],
  },
  {
    q: "Who wins an argument?",
    options: ["Me", "You", "Nobody, because we both need snacks 😂"],
    correct: 2,
    reactions: [
      "Interesting theory 😏",
      "You may be right...",
      "A diplomatic genius!",
    ],
  },
  {
    q: "What is my favourite notification?",
    options: ["Instagram", "WhatsApp", "Your message ❤️"],
    correct: 2,
    reactions: [
      "Not even close 😂",
      "Good app, wrong answer",
      "Ding ding! That’s the one.",
    ],
  },
  {
    q: "What happens when you smile?",
    options: ["Nothing", "My day gets better."],
    correct: 1,
    reactions: ["Incorrect, but cute try.", "See? You get me. 💗"],
  },
];
function LoveQuiz({ next, quizDone, setQuizDone }) {
  const [index, setIndex] = useState(0),
    [chosen, setChosen] = useState(null);
  const pick = (i) => {
    if (chosen !== null) return;
    setChosen(i);
    if (index === questions.length - 1)
      setTimeout(() => setQuizDone(true), 950);
    else
      setTimeout(() => {
        setIndex(index + 1);
        setChosen(null);
      }, 950);
  };
  if (quizDone)
    return (
      <section className="hero">
        <div className="trophy">🏆</div>
        <div className="eyebrow">CHAPTER 04 · OFFICIAL RESULTS</div>
        <h2>
          Congratulations!
          <br />
          <span className="serif pink">You passed the Love Test!</span>
        </h2>
        <p className="subtitle">
          Your prize is... absolutely more of me. Lucky you. 😂
        </p>
        <Button onClick={next}>
          CLAIM YOUR PRIZE <ArrowRight size={15} />
        </Button>
      </section>
    );
  const item = questions[index];
  return (
    <section className="hero quiz">
      <div className="eyebrow">CHAPTER 04 · THE LOVE QUIZ 😂</div>
      <div className="quiz-progress">
        {questions.map((_, i) => (
          <span key={i} className={i <= index ? "active" : ""} />
        ))}
      </div>
      <div className="question-count">
        QUESTION {String(index + 1).padStart(2, "0")} <i>/ 04</i>
      </div>
      <h2>{item.q}</h2>
      <div className="answers">
        {item.options.map((option, i) => (
          <button
            key={option}
            className={`answer ${chosen === i ? "selected" : ""} ${chosen !== null && i === item.correct ? "correct" : ""}`}
            onClick={() => pick(i)}
          >
            <span className="answer-letter">{String.fromCharCode(65 + i)}</span>
            {option}
            <span className="answer-arrow">↗</span>
          </button>
        ))}
      </div>
      <div className="reaction quiz-reaction">
        {chosen !== null
          ? item.reactions[chosen]
          : "Pick the answer your heart tells you."}
      </div>
    </section>
  );
}
function GiftBox({ next, open, setOpen }) {
  return (
    <section className="hero gift-page">
      <div className="eyebrow">CHAPTER 05 · THE SECRET STASH</div>
      <h2>
        Wait... I have <span className="serif pink">one more surprise</span> for
        you!
      </h2>
      <p className="subtitle">
        A little something, wrapped up with a lot of heart.
      </p>
      <button
        className={`gift-illustration ${open ? "is-open" : ""}`}
        onClick={() => setOpen(true)}
        aria-label="Open your gift"
      >
        <div className="gift-glow" />
        <div className="gift-lid">
          <span className="bow">♡</span>
        </div>
        <div className="gift-body">
          <div className="ribbon-v" />
          <div className="ribbon-h" />
        </div>
        <span className="gift-spark s1">✦</span>
        <span className="gift-spark s2">✧</span>
        <span className="gift-spark s3">♡</span>
      </button>
      {open ? (
        <motion.div
          className="gift-message"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="eyebrow">JUST FOR YOU</div>
          <p>
            You are someone special, and I wanted to make something special just
            for you. <span>♡</span>
          </p>
          <Button onClick={next}>
            NEXT <ArrowRight size={15} />
          </Button>
        </motion.div>
      ) : (
        <div className="tap-hint">
          TAP TO OPEN <span>↑</span>
        </div>
      )}
    </section>
  );
}
function Fireworks({ active }) {
  return active ? (
    <div className="fireworks" aria-hidden="true">
      {Array.from({ length: 9 }, (_, i) => (
        <span
          key={i}
          style={{
            "--x": `${10 + ((i * 31) % 82)}%`,
            "--y": `${12 + ((i * 19) % 70)}%`,
            "--delay": `${(i % 5) * 0.35}s`,
            "--hue": `${330 + i * 7}`,
          }}
        >
          ✦
        </span>
      ))}
    </div>
  ) : null;
}
function Proposal({ yes, setYes, maybe, setMaybe, next }) {
  return (
    <section className={`hero proposal ${yes ? "celebrating" : ""}`}>
      <Fireworks active={yes} />
      {yes ? (
        <motion.div
          className="celebration"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="celebration-icon">💗</div>
          <div className="eyebrow">THE BEST PLOT TWIST</div>
          <h2>
            YOU JUST MADE THIS LITTLE WEBSITE THE HAPPIEST PLACE!{" "}
            <span>❤️</span>
          </h2>
          <p className="subtitle">Thank you for making this moment special.</p>
          <p className="signoff">
            I have a feeling this is the start of something lovely. ✨
          </p>
          <Button
            variant="soft"
            onClick={() => {
              setYes(false);
              setMaybe(false);
            }}
          >
            READ IT AGAIN <RotateCcw size={15} />
          </Button>
        </motion.div>
      ) : (
        <>
          <div className="eyebrow">CHAPTER 06 · THE BIG QUESTION</div>
          <div className="proposal-orbit">
            <span>♡</span>
            <span>✦</span>
            <span>♡</span>
            <div className="proposal-heart">💗</div>
          </div>
          <p className="question-pre">I have one important question...</p>
          <h2 className="proposal-title">
            Will you <span className="serif">be mine?</span>{" "}
            <span className="pink">❤️</span>
          </h2>
          <p className="subtitle">
            No pressure, just a little piece of my heart.
          </p>
          <div className="proposal-actions">
            <Button
              onClick={() => {
                setYes(true);
                setMaybe(false);
              }}
            >
              YES! <Heart size={16} fill="currentColor" />
            </Button>
            <Button variant="soft" onClick={() => setMaybe(true)}>
              I NEED A MOMENT 🥺
            </Button>
          </div>
          {maybe && (
            <motion.div
              className="supportive"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span>🌷</span>No pressure. Take all the time you need. Your
              answer matters. 💗
            </motion.div>
          )}
          <button className="restart-link" onClick={next}>
            Let’s start over, please <RotateCcw size={12} />
          </button>
        </>
      )}
    </section>
  );
}
function MusicController({ enabled }) {
  useEffect(() => {
    if (!enabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      ctx.resume();
      const melody = [
        523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46,
      ];
      let note = 0;
      const playNote = () => {
        const osc = ctx.createOscillator(),
          gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = melody[note++ % melody.length];
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.018, ctx.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.56);
      };
      playNote();
      const interval = window.setInterval(playNote, 650);
      return () => {
        window.clearInterval(interval);
        ctx.close();
      };
    } catch {}
  }, [enabled]);
  return null;
}
function App() {
  const saved = useRef(loadSave()).current;
  const [step, setStep] = useState(Math.min(saved.step || 0, TOTAL - 1));
  const [score, setScore] = useState(saved.score || 0);
  const [done, setDone] = useState(saved.done || false);
  const [quizDone, setQuizDone] = useState(saved.quizDone || false);
  const [open, setOpen] = useState(saved.open || false);
  const [yes, setYes] = useState(false);
  const [maybe, setMaybe] = useState(false);
  const [sound, setSound] = useState(true);
  const [music, setMusic] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 950);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    localStorage.setItem(
      "little-love-story",
      JSON.stringify({ step, score, done, quizDone, open }),
    );
  }, [step, score, done, quizDone, open]);
  const go = (i) => {
    setStep(Math.max(0, Math.min(TOTAL - 1, i)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const restart = () => {
    localStorage.removeItem("little-love-story");
    setStep(0);
    setScore(0);
    setDone(false);
    setQuizDone(false);
    setOpen(false);
    setYes(false);
    setMaybe(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const pages = [
    <Intro next={() => go(1)} />,
    <Funny next={() => go(2)} />,
    <HeartGame
      next={() => go(3)}
      score={score}
      setScore={setScore}
      done={done}
      setDone={setDone}
      sound={sound}
      setSound={setSound}
    />,
    <Story next={() => go(4)} />,
    <LoveQuiz
      next={() => go(5)}
      quizDone={quizDone}
      setQuizDone={setQuizDone}
    />,
    <GiftBox next={() => go(6)} open={open} setOpen={setOpen} />,
    <Proposal
      yes={yes}
      setYes={setYes}
      maybe={maybe}
      setMaybe={setMaybe}
      next={restart}
    />,
  ];
  return (
    <>
      <div className="loading-screen" data-done={!loading}>
        {loading && (
          <div>
            <span className="load-heart">♥</span>
            <small>something lovely is loading</small>
          </div>
        )}
      </div>
      <div className="site-shell">
        <FloatingHearts />
        <MusicController enabled={music} />
        <Topbar
          step={step}
          onBack={() => go(step - 1)}
          sound={sound}
          setSound={setSound}
          music={music}
          setMusic={setMusic}
          restart={restart}
        />
        <main>
          <Progress step={step} go={go} />
          <AnimatePresence mode="wait">
            <PageTransition step={step}>{pages[step]}</PageTransition>
          </AnimatePresence>
        </main>
        <footer className="footer">
          <span>
            made with a little extra <b>♡</b>
          </span>
          <span>FOR SOMEONE SPECIAL</span>
        </footer>
      </div>
    </>
  );
}

export default App;
