# Math Brain Test

A math puzzle game for children aged 6 to 8. Every test draws 20 questions from a bank of
thousands: 4 from each of five skills (number sense, patterns, adding & taking away,
shapes & time, thinking puzzles), ordered from warm-up to tricky. Children can have each
question read aloud, get a short explanation when they miss one, and finish with a score
for each skill plus a suggestion for what to practise next.

It is a practice quiz, not an IQ test.

**Play online:** https://kikulik.github.io/math-brain-test/ (GitHub Pages, updates on every push to `main`).

## Run it

```bash
./deploy.sh                 # builds the image and starts it
# open http://localhost:10360
docker compose down         # stop it
```

Use another port with `MBT_PORT=8080 ./deploy.sh`.

The Docker build runs `tests/check-bank.cjs` first. It builds every question and stops the
build if any question has a repeated option, broken text, or a sum that doesn't add up.
You can run it on its own with `node tests/check-bank.cjs`.

## Files

| Path | What it does |
|---|---|
| `index.html` | The page: start screen, question screen, score screen |
| `css/style.css` | All styles, light and dark themes |
| `js/core.js` | Shared helpers: seeded random numbers, answer options, word helpers |
| `js/draw.js` | SVG pictures: shapes, blocks, clocks, balance scale, number line… |
| `js/bank-*.js` | Puzzle templates, one file per skill |
| `js/pool.js` | Picks the 20 questions for a test and avoids recent repeats |
| `js/app.js` | Screens, answering, scoring, read-aloud |
| `tests/check-bank.cjs` | Checks every question in the bank |

## Adding a puzzle type

Add a template to the right `js/bank-*.js` file:

```js
M.add({
  id: 'double',                         // unique, never reuse an old id
  skill: 'sums',                        // numbers | patterns | sums | shapes | logic
  variants: M.range(2, 10),             // every value the template can take
  level: n => (n <= 5 ? 1 : 2),         // 1 warm-up, 2 thinking, 3 tricky
  make: (n, r) => ({                    // r is a seeded random function
    text: `What is ${n} + ${n}?`,
    ...M.numOpts(r, n * 2, [n * 2 + 1, n * 2 - 1, n + 1]),
    why: `${n} + ${n} = ${n * 2}.`
  })
});
```

Each variant becomes one question in the bank, and the bank count on the start screen
updates by itself. Run `node tests/check-bank.cjs` afterwards.
