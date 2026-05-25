# Aura Clock
### *The desk that fight back*

> "Five more minutes"
> i said that at 9:05
> it was 11:47 pm before i looked up

---

## The problem that built This

i was a 18 years old building hardware in Arusha 

i have a robot to build, a simulator to build, a hackerthon to qualify for 

and yet i know what youtube autoplay algorithm looks like in 2AM i know the exact moment a quick break becomes a 2hr detour i know that interanl voice say i will work on this after this one video and just five more minutes and i will work better late at night

That voice is a liar.

Software timers dont fix this. i dismissed paradogm apps with in a week grayscale modes lasted several days website bloockers tool 30 secondsevery solution i have made has the same flaw it could be ignored,**

A notification can be swiped, A popup can be closed, An allert can be muted.

**A physical shutter can not.**

AuraClock is an opensource mechatronics IOT hub that enforces deep work by creating an **undeniable physical-digital feedback loop.**

it watches your active window, it watches your active window title silently in the background. If your working - coding, writting, Designing the device displays a calm OLED face and everything is quite.

The momment you navigate to a blacklisted website or window the machine responds physicaly and also software where it closses mandatory the blacklisted sites and window

1. **The shutter closses.** A micro-servo drives a rack and pinion transmition rotating an opaque mask across the oled display behind a smoked screen the screen physically disaprears

2. **The heptic fires** An LRA vibration mottor pulls 3 Agresive pulses not a gentle buzz, a strucuted allert your hand feels through the desk 

3. **The Aura ledger** records the breach and drops your points in the dashboard

Return your Work. The shutter opens the calm face returns. the session resumes 

there is no dissmiss buttons and no snooze there is no "Remind me later"

there is only: **get back to work**

---

# System Architecture

---

┌─────────────────────────────────────────────────────────┐
│                     HOST MACHINE                        │
│                                                         │
│   ┌──────────────────────────────────────────────┐      │
│   │          auraclock-daemon.py                 │      │
│   │                                              │      │
│   │  Active window title polling (500ms)         │      │
│   │  Allowlist / blocklist evaluation            │      │
│   │  Session timer + Aura ledger                 │      │
│   │  WebSocket client (ws://auraclock.local)     │      │
│   └──────────────────────┬───────────────────────┘      │
│                           │ Local WiFi                  │
└───────────────────────────┼─────────────────────────────┘
                            │ WebSocket (async JSON)
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  ESP32-WROOM-32E                        │
│               (Custom PCB, local fab)                   │
│                                                         │
│   WebSocket Server ──► State Machine                    │
│                              │                          │
│              ┌───────────────┼───────────────┐          │
│              ▼               ▼               ▼          │
│         SSD1306 OLED   SG90 Servo       ERM Motor       │
│         (OLED face)  (Shutter drive)  (Haptic pulse)    │
│                            │                            │
│                    Rack-and-Pinion                      │
│                    Transmission                         │
│                            │                            │
│                    Opaque Shutter Mask                  │
└─────────────────────────────────────────────────────────┘
```
## hardware

### Custom PCB

Designed in kicad fabricated localy in Arusha, Tanzania.
single sided, 0.5mm minimum trace width, hand etched and assembled

**Core components**

 Component | Part | Purpose |
|-----------|------|---------|
| MCU | ESP32-WROOM-32E | Main brain, WiFi, WebSocket server |
| USB Bridge | CH340C (SOIC-16) | Programming interface |
| Regulator | AMS1117-3.3 (SOT-223) | 3.3V power rail |
| Display | SSD1306 OLED 0.96" (I2C) | OLED face + Aura score |
| Actuator | SG90 Micro Servo | Drives rack-and-pinion shutter |
| Haptic | ERM Coin Vibration Motor | Tactile feedback |
| Driver | S8050 NPN + 1N4148 | Motor switching circuit |
| Power | USB-C connector | 5V input |