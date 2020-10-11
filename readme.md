# Tennis game points

This is a score counter for a game (not an entire match) of tennis. Its using a some sounds which will not work correctly in Safari since it's very picky with sounds outside of interactions.

## Deployed version

[Here](https://tobiasmelen.github.io/tennis-game-points/), deployed from master branch.

## Setup dev environment

Install node and yarn.

```
yarn install
yarn start
//or, to run test
yarn test
//or, to build production distribution
yarn build
```

## Development notes

Uses `parcel` for bundling and `ava` for test. I had to muck around a bit with babel to get support for typescript in both.
The business logic that someone might want to review because it could fulfill a test assignment is located in the file [tennisScoring.ts](/src/tennisScoring.ts). I got a bit carried away with speech synthesing and other stuff so there's a bit of other code here.
