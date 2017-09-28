# Hassio NuimoJS

Addon for [Hass.io](https://home-assistant.io/hassio/) to integrate one (or more) [Nuimo controllers](https://www.senic.com/en/nuimo) with Home Assistant.

> tl:dr; Inputs done with the Nuimo controller are translated into MQTT messages.

## Hint / Disclaimer

This is by no means a professional piece of software. It's ugly, incomplete and maybe not even superfluous as there is an [offical HA component](https://home-assistant.io/components/nuimo_controller/) (which at least for me was broken, hence this project. See FAQ.)

I will not be responsible if your Nuimo catches fire if you use this. Same goes for partnerships which come to an end because of too much time spent on tinkering with this (or Home Assistant).

## FAQ

### There is an [offical component](https://home-assistant.io/components/nuimo_controller/)! Why this?

A: The official component didn't work OOB for me. See [issue #6277](https://github.com/home-assistant/home-assistant/issues/6277) in the Home Assistant repository for details.


## Uses

* [NuimoJS](https://github.com/nathankunicki/nuimojs)

## Roadmap / Upcoming features / Wishlist

* Scroll Text / Icons over the Nuimo LED Matrix (Ticker)
* Support multiple input sources (Sound, Light, Heater(?)...)
  * Input source should be switchable by Swipe gesture (left/right)
* Visual feedback for current setting (e.g. light level/volume when rotating)