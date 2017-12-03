# Nameless Game (as of now)
### By Garrett Allen

## Description
This game was created for Ludum Dare 40 (Compo specifically).  The Theme was *The more you have, the worse it is*.

This game fits that theme by giving players the option to obtain temporary allies via an "antidote" to dead mutants.  When an ally is revived via this method, they convert back to being a monster after a small amount of time and come back as an even stronger enemy.  The idea was, you can use allies, but the more you have the worse the difficulty.

## Controls
- WASD to move
- E to inject antidote into a dead mutant (only green bodies can be revived)
- C to destroy a body (beat to a pulp)
- Mouse to aim, left click to shoot
- P pauses and un-pauses


## Issues
- Bagger enemy has no sfx
- Bagger run animations are hit or miss if they work
- Allies do not have a run animation
- The body beat functionality is extremely timid looking


## Planned features (In order of what will be worked on in the last day)
- Game director-esque feature to send enemies as you progress through the level
- More objects to spawn in the road (some bullet blocking)
- Bagger evolution implementation
    - The bagger enemy (Guy that steals bodies) is supposed to morph into a stronger aggressive enemy when he gathers so many bodies.   Right now that second version of him is not done.
- Snek implementation
    - Basic drawing is in the assets folder for this, I feel like the game needs a ranged enemy which he will be if time permits
- Atleast one boss 
- Background music
- Better menu graphics (Or like any sort of not eye bleed)
- Local score tracking/leaderboard
- Random events throughout level progression (i.e. helicopter crash)
- Weapon pickups
    - These would be ammo limited unlike the default gun
- Try out reloading mechanism


## Technical details
This was my first ever Game Jam, and it was awesome!  I opted for the Compo to challenge myself and force more creativity by exploring every aspect of game dev (sounds I'm looking at you).

I created this using CraftyJS (http://craftyjs.com/).  I had never used this library prior to this game, so I lost some time learning it, but what's the point of the LD if not to learn?

http://sfbgames.com/chiptone was used for sfx creation.  Great tool for quick sounds.

I used Piskel (https://www.piskelapp.com/) to create all of my sprites.  It did a **fantastic** job and was a life saver.

Github is obviously hosting the code, the game can be played directly at https://adrenallen.github.io/ld40/