# Mutoid
### By Garrett Allen

![Mutoid Cover](/assets/cover.png "")

## Description
This game was created for Ludum Dare 40 (Compo specifically).  The Theme was *The more you have, the worse it is*.

This game fits that theme by giving players the option to obtain temporary allies via an "antidote" to dead mutants.  When an ally is revived via this method, they convert back to being a monster after a small amount of time and come back as an even stronger enemy.  The idea was, you can use allies, but the more you have the worse the difficulty.

Everything in this game was created **from scratch** between 9PM Friday (December 1, 2017) and 9PM Sunday (December 3, 2017).

## Controls
- WASD to move
- E to inject antidote into a dead mutant (only green bodies can be revived)
- C to destroy a body (beat to a pulp)
- Mouse to aim, left click to shoot
- P pauses and un-pauses


## Issues
- The body beat functionality is extremely timid looking
- Sound effects may be missing from some actions

## Completed Features
- Game director-esque feature to send enemies as you progress through the level
- Ability to "revive" dead mutants by pressing E to turn them into an ally soldier (see above *Convert* enemy)
- Ability to "beat" dead bodies.  This removes the bodies from the game, so they cannot be consumed by the bagger enemies.  See the bagger enemy features listed under planned features for more details on why this was originally added.
- Blocking objects in road
- Scrolling map
- Finale event
- Game win, lose, and main menu screens
- 4 enemy types
    - Basic Mutant
        - These are the slow green guys that waddle around
    - Bagger
        - A bug like enemy that devours bodies to become stronger.  See below for his original plan.
    - Snek
        - A snake like monster that fires spit at you.  He will attack from range unless he is within a certain distance.
    - Convert
        - A revived ally will "convert" back into a monster after a random amount of time(he has tentacles burst through his stomach)
- Allies that follow you around, including aiming their gun where they shoot
- Animations for anything and everything
- Medkits spawn randomly, pickup for health
- *TurboGun/ChainGun* pickup, greatly increases the rate of fire for a number of bullets
- Score tracking and distance tracking
- Sound effects for various actions and enemies


## Planned features that did not make it
- More objects to spawn in the road (some bullet blocking and some explosive)
- Map was supposed to stop scrolling when the director "fired" events, but it was causing some weird jerkiness if you were standing on the right side when the scroll was re-enabled.  Therefore I just removed the temporary scroll locks and the lock only occurs during the finale.
- Bagger evolution implementation
    - The bagger enemy (Guy that steals bodies) is supposed to morph into a stronger aggressive enemy when he gathers so many bodies. His default behavior is to gather bodies and escape off screen, returning later as a stronger enemy based on the number of bodies he gathered. His escape behaviour is disabled so that he can be found and killed due to the second version of him not being complete.
- Atleast one boss 
    - The finale DOES exist, you CAN win the game if you get to it and kill everything.  Originally there were going to be two bosses, however time did not allow for that to happen.
- Local score tracking/leaderboard
- Random events throughout level progression (i.e. helicopter crash with upgrades)
- Better variety of weapon pickups
- Try out reloading mechanism


## Technical details
This was my first ever Game Jam, and it was awesome!  I opted for the Compo to challenge myself and force more creativity by exploring every aspect of game dev (sounds I'm looking at you).

I created this using CraftyJS (http://craftyjs.com/).  I had never used this library prior to this game, so I lost some time learning it, but what's the point of the LD if not to learn?

http://sfbgames.com/chiptone was used for sfx creation.  Great tool for quick sounds.

http://soundtrap.com was used for creating the background music.

I used Piskel (https://www.piskelapp.com/) to create all of my sprites.  It did a **fantastic** job and was a life saver.

GIMP was used at the end to create quick single images (i.e. box/car objects, menus, and logo)

Github is obviously hosting the code, the game can be played directly at https://adrenallen.github.io/ld40/