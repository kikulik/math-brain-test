# Math Brain Test

A math puzzle game for children aged 6 to 12, in three age groups (6–8, 9–10, 11–12) picked
on the start screen. Each age has its own bank of thousands of questions and five skills.
Every test draws 20 questions, 4 from each skill, ordered from warm-up to tricky. Children
can have each question read aloud, get a short explanation when they miss one, play with no
timer, a stopwatch or "Beat the clock" (40/50/60 seconds a question), and finish with a score
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
| `js/core.js` | Age groups and skills, seeded random numbers, answer options, saved settings |
| `js/draw.js` | SVG pictures shared by all ages: shapes, blocks, clocks, balance scale, number line… |
| `js/ages-6-8/`, `js/ages-9-10/`, `js/ages-11-12/` | Puzzle templates, one file per skill; `draw.js` there holds that age's own pictures |
| `js/pool.js` | Picks the 20 questions for a test and avoids recent repeats |
| `js/picker.js` | The chunky button rows on the start screen (age, timer) |
| `js/timer.js` | No timer / Stopwatch / Beat the clock |
| `js/app.js` | Screens, answering, scoring, read-aloud |
| `tests/check-bank.cjs` | Checks every question in the bank |
| `img/share.png` | Link preview picture for Facebook, WhatsApp… |
| `tools/share-card.html` | Source of the preview picture |

## Share picture

`img/share.png` (1200×630) is the picture Facebook, Messenger and WhatsApp show when the
link is shared. Its source is `tools/share-card.html`. After changing that page, render it again:

```bash
google-chrome --headless=new --hide-scrollbars --window-size=1200,630 --virtual-time-budget=8000 \
  --screenshot="$PWD/img/share.png" "file://$PWD/tools/share-card.html"
```

Facebook keeps old previews for a while. After pushing, open
https://developers.facebook.com/tools/debug/?q=https://kikulik.github.io/math-brain-test/
and press **Scrape Again**.

## Adding a puzzle type

Add a template to the right file in `js/ages-…/`. The skill decides the age group
(skill names are listed in `M.SKILLS` in `js/core.js`, e.g. `sums` for 6–8, `times9` for 9–10,
`algebra11` for 11–12). Ids for 9–10 start with `a9-`, for 11–12 with `a11-`.

```js
M.add({
  id: 'double',                         // unique, never reuse an old id
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
updates by itself. For answers that can be negative or decimal use `M.valOpts` and write
negatives with the real minus sign (−5). Run `node tests/check-bank.cjs` afterwards, or
`node tests/check-bank.cjs 9-10` to check one age. A new file only counts once it has a
`<script>` tag in `index.html`; the checker reads its file list from there.
