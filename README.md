# 🍄 Mushroom KNUTS

[![hacs][hacs-badge]][hacs-url]
[![release][release-badge]][release-url]
![downloads][downloads-badge]
![build][build-badge]

> **This is an extended version of the original Mushroom Cards by piitaya with additional cover tilt preset functionality by KNUTS.**

![Overview](https://user-images.githubusercontent.com/5878303/152332130-760cf616-5c40-4825-a482-bb8f1f0f5251.png)

## What's New in This Extended Version?

### ✨ Enhanced Cover Card Features
- **Tilt preset buttons** with configurable switch entities and custom button names
- **Position inversion option** for inverted cover position display and control
- **Improved state display** showing percentages for intermediate positions
- **Better tilt control** with visual feedback and toggle functionality
- **Separate icon actions** allowing different actions for icon vs card body (e.g., icon = toggle, card = more-info)

### 🎛️ Enhanced Light Card Features  
- **Preset control buttons** with configurable switch entities
- **Configurable control icons** for brightness and preset controls
- **Improved slider behavior** with better value retention during interactions
- **Separate icon actions** allowing different actions for icon vs card body (e.g., icon = toggle, card = more-info)

### 🎯 Enhanced Entity Card Features
- **Separate icon actions** allowing different actions for icon vs card body (e.g., icon = more-info, card = more-info)
- **Configurable tap, hold, and double-tap actions** for icons independent of card actions

### 🔧 Universal Slider Improvements
- **Configurable step sizes** for all sliders (brightness, volume, humidity, etc.) with default of 5
- **Enhanced dragging behavior** with per-entity state blocking to prevent value jumping
- **Smooth slider interactions** that maintain values during drag operations

### 🛠️ Technical Enhancements
- **Per-entity state blocking manager** prevents external Home Assistant updates from interfering with slider interactions
- **Improved HACS compatibility** with proper configuration
- **Built-in distribution** with pre-compiled mushroom.js file
- **All features are backward compatible** - original functionality remains intact

## What is mushroom ?

Mushroom is a collection of cards for [Home Assistant][home-assistant] Dashboard UI.

Mushroom mission is to propose easy to use components to build your [Home Assistant][home-assistant] dashboard.

### Features

- 🛠 Editor for **all cards** and and **all options** (no need to edit `yaml`)
- 😍 Icon picker
- 🖌 Color picker
- 🚀 0 dependencies : no need to install another card.
- 🌈 Based on Material UI colors
- 🌓 Light and dark theme support
- 🎨 Optional theme customization
- 🌎 Internationalization
- **🆕 Enhanced cover controls** with tilt presets and position inversion (Extended version)
- **🆕 Light preset controls** with configurable switch entities (Extended version)
- **🆕 Configurable slider step sizes** for all cards (Extended version)
- **🆕 Improved slider behavior** with anti-interference protection (Extended version)
- **🆕 Separate icon actions** for Light, Cover, and Entity cards allowing different behaviors for icon vs card (Extended version)

The goal of Mushroom is not to provide custom card for deep customization. You can use the excellent [UI Lovelace Minimalist][ui-lovelace-minimalist] and [Button card][button-card] plugins for this.

## Installation

### HACS (Custom Repository)

1. Install HACS if you don't have it already
2. Go to HACS → Frontend
3. Click the three dots in the top right corner
4. Select "Custom repositories"
5. Add this repository URL: `https://github.com/SanderM2/lovelace-mushroom`
6. Select category: "Lovelace"
7. Click "Add"
7. Find "Mushroom KNUTS" and install it

1. Download `mushroom.js` file from the [latest release][release-url].
2. Put `mushroom.js` file into your `config/www` folder.
3. Add reference to `mushroom.js` in Dashboard. There's two way to do that:
   - **Using UI:** _Settings_ → _Dashboards_ → _More Options icon_ → _Resources_ → _Add Resource_ → Set _Url_ as `/local/mushroom.js` → Set _Resource type_ as `JavaScript Module`.
     **Note:** If you do not see the Resources menu, you will need to enable _Advanced Mode_ in your _User Profile_
   - **Using YAML:** Add following code to `lovelace` section.
     ```yaml
     resources:
       - url: /local/mushroom.js
         type: module
     ```

## Extended Features Usage

### Cover Card Enhancements

#### Tilt Presets
Add preset buttons for quick tilt positioning:

```yaml
type: custom:mushroom-cover-card
entity: cover.your_cover
show_tilt_preset_control: true
tilt_preset_1:
  name: "Closed"
  entity: switch.cover_preset_closed
tilt_preset_2: 
  name: "Half"
  entity: switch.cover_preset_half
tilt_preset_3:
  name: "Open"
  entity: switch.cover_preset_open
```

#### Position Inversion
Invert position display and control for covers that report inverted values:

```yaml
type: custom:mushroom-cover-card
entity: cover.your_cover
show_position_control: true
invert_position: true
```

#### Enhanced State Display
The cover card now shows:
- "Closed" for 0% position
- "Open" for 100% position  
- Percentage values for intermediate positions
- Properly inverted display when `invert_position` is enabled

### Light Card Enhancements

#### Preset Controls
Add preset buttons for quick scene/mood activation:

```yaml
type: custom:mushroom-light-card
entity: light.your_light
show_preset_control: true
preset_1:
  name: "Bright"
  entity: switch.light_preset_bright
preset_2:
  name: "Dim" 
  entity: switch.light_preset_dim
preset_3:
  name: "Night"
  entity: switch.light_preset_night
```

#### Configurable Control Icons
Customize the icons for brightness and preset controls:

```yaml
type: custom:mushroom-light-card
entity: light.your_light
show_brightness_control: true
show_preset_control: true
brightness_icon: mdi:brightness-6
preset_icon: mdi:palette
```

### Universal Slider Step Configuration

Configure step sizes for all slider controls across different card types:

```yaml
type: custom:mushroom-light-card
entity: light.your_light
show_brightness_control: true
brightness_step: 10  # 10% steps instead of default 5%
```

```yaml
type: custom:mushroom-media-player-card
entity: media_player.your_player
show_volume_control: true
volume_step: 5  # 5% volume steps
```

This works for:
- **Light cards**: `brightness_step`
- **Media player cards**: `volume_step`  
- **Fan cards**: `percentage_step`
- **Humidifier cards**: `humidity_step`
- **Number cards**: `number_step`
- **Cover cards**: `position_step`, `tilt_step`

### Combined Example

```yaml
type: custom:mushroom-cover-card
entity: cover.bedroom_blinds
show_position_control: true
show_tilt_position_control: true  
show_tilt_preset_control: true
show_buttons_control: true
invert_position: true
position_step: 10
tilt_step: 25
tilt_preset_1:
  name: "Privacy"
  entity: switch.blinds_privacy_mode
tilt_preset_2:
  name: "Light"
  entity: switch.blinds_light_mode
tilt_preset_3:
  name: "Open"
  entity: switch.blinds_open_mode
```

### Icon Actions (Light, Cover & Entity Cards)

Configure separate actions for the card icon vs the card body, enabling different behaviors:

#### Light Card Icon Actions
```yaml
type: custom:mushroom-light-card
entity: light.bedroom
# Card actions (when clicking card body)
tap_action:
  action: more-info
hold_action:
  action: more-info
# Icon actions (when clicking the light icon)
icon_tap_action:
  action: toggle  # Quick toggle on/off
icon_hold_action:
  action: more-info
icon_double_tap_action:
  action: none
```

#### Cover Card Icon Actions  
```yaml
type: custom:mushroom-cover-card
entity: cover.bedroom_blinds
# Card actions (when clicking card body)
tap_action:
  action: more-info
hold_action:
  action: more-info
# Icon actions (when clicking the cover icon)
icon_tap_action:
  action: more-info  # Show cover details
icon_hold_action:
  action: none
icon_double_tap_action:
  action: call-service
  service: cover.stop_cover
  target:
    entity_id: cover.bedroom_blinds
```

#### Entity Card Icon Actions
```yaml
type: custom:mushroom-entity-card
entity: switch.living_room_lamp
# Card actions (when clicking card body)  
tap_action:
  action: more-info
hold_action:
  action: more-info
# Icon actions (when clicking the entity icon)
icon_tap_action:
  action: toggle  # Quick toggle switch
icon_hold_action:
  action: more-info
icon_double_tap_action:
  action: none
```

**Benefits:**
- **Separate controls**: Icon and card body can perform different actions
- **No visual feedback circle**: Clean desktop experience without unwanted visual effects  
- **Cross-platform compatibility**: Works seamlessly on both desktop and mobile
- **Customizable actions**: Support for tap, hold, and double-tap actions on icons

## Usage

All the Mushroom cards can be configured using Dashboard UI editor.

1. In Dashboard UI, click 3 dots in top right corner.
2. Click _Edit Dashboard_.
3. Click Plus button to add a new card.
4. Find one of the _Custom: Mushroom_ card in the list.

### Cards

Different cards are available for differents entities :

- 🚨 [Alarm card](docs/cards/alarm-control-panel.md)
- 🔔 [Chips card](docs/cards/chips.md)
- 🌡 [Climate card](docs/cards/climate.md)
- 🪟 [Cover card](docs/cards/cover.md)
- 🪄 [Entity card](docs/cards/entity.md)
- 🕳 [Empty card](docs/cards/empty.md)
- 💨 [Fan card](docs/cards/fan.md)
- 💧 [Humidifier card](docs/cards/humidifier.md)
- 💡 [Light card](docs/cards/light.md)
- 🔒 [Lock card](docs/cards/lock.md)
- 📺 [Media card](docs/cards/media-player.md)
- 🔢 [Number card](docs/cards/number.md)
- 🙋 [Person card](docs/cards/person.md)
- 📑 [Select card](docs/cards/select.md)
- 🛠 [Template card](docs/cards/template.md)
- ✏️ [Title card](docs/cards/title.md)
- 📦 [Update card](docs/cards/update.md)
- 🧹 [Vacuum card](docs/cards/vacuum.md)

### Legacy cards

Some cards are considered as legacy, are not available in the card picker but you can still use them :

- 🛠 [Legacy Template card](docs/cards/legacy-template.md)

### Badges

A [template badge](docs/badges/template.md) is available if you're using at least Home Assistant 2024.8.

### Theme customization

Mushroom works without theme but you can add a theme for better experience by installing the [Mushroom Themes](https://github.com/piitaya/lovelace-mushroom-themes). If you want more information about themes, check out the official [Home Assistant documentation about themes][home-assitant-theme-docs].

## Development server

### Home assistant demo

You can run a demo instance of Home Assistant with docker by running:

```sh
npm run start:hass
```

Once it's done, go to Home Assistant instance [http://localhost:8123](http://localhost:8123) and start configuration.

#### Windows Users

If you are on Windows, either run the above command in Powershell, or use the below if using Command Prompt:

```sh
npm run start:hass-cmd
```

### Development

In another terminal, install dependencies and run development server:

```sh
npm install
npm start
```

Server will start on port `4000`.

### Build

You can build the `mushroom.js` file in `dist` folder by running the build command.

```sh
npm run build
```

### Translations

If you want to help translating Mushroom, you can translate it directly from your browser using [Weblate][weblate-url].

### Maintainer steps to add a new language

1. To be compatible with Home Assistant, language tags have to follow [BCP 47](https://www.rfc-editor.org/info/bcp47). A list of most language tags can be found here: [IANA subtag registry](http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry). Examples: `fr`, `fr-CA`, `zh-Hans`.
2. Create a new file `{language_code}.json` with your language code in the [translation folder](https://github.com/piitaya/lovelace-mushroom/tree/main/src/translations). Examples: `fr.json`.
3. Import your file into the [`localize.ts file`](https://github.com/piitaya/lovelace-mushroom/blob/main/src/localize.ts) and add your language in the `languages` record.
4. Don't forget to test locally with the development server by choosing the language with the Home Assistant UI in your profile.

## Troubleshooting

### I don't see the last changes

1. Check that your Home Assistant version is the latest. Some new Mushroom features can only be visible for the latest Home Assistant version.
2. Check that you have the latest Mushroom version on HACS
3. Check that you have the latest Mushroom version by checking the browser console
4. Clear your cache :
   - delete mushroom resources (https://my.home-assistant.io/redirect/lovelace_resources/)
   - uninstall Mushroom from HACS
   - reinstall Mushroom from HACS

### My card mod configuration doesn't work.

Help about card mod configuration is not provided in this repository. More info in the [state of card mod support](https://github.com/piitaya/lovelace-mushroom/issues/1366).

## Credits

The design is inspired by [7ahang’s work][7ahang] on Behance and [Ui Lovelace Minimalist][ui-lovelace-minimalist].

<!-- Badges -->

[hacs-url]: https://github.com/hacs/integration
[hacs-badge]: https://img.shields.io/badge/hacs-default-orange.svg?style=flat-square
[release-badge]: https://img.shields.io/github/v/release/piitaya/lovelace-mushroom?style=flat-square
[downloads-badge]: https://img.shields.io/github/downloads/piitaya/lovelace-mushroom/total?style=flat-square
[build-badge]: https://img.shields.io/github/actions/workflow/status/piitaya/lovelace-mushroom/build.yml?branch=main&style=flat-square
[translations-badge]: https://hosted.weblate.org/widget/mushroom/svg-badge.svg

<!-- References -->

[home-assistant]: https://www.home-assistant.io/
[home-assitant-theme-docs]: https://www.home-assistant.io/integrations/frontend/#defining-themes
[hacs]: https://hacs.xyz
[ui-lovelace-minimalist]: https://ui-lovelace-minimalist.github.io/UI/
[button-card]: https://github.com/custom-cards/button-card
[7ahang]: https://www.behance.net/gallery/88433905/Redesign-Smart-Home
[release-url]: https://github.com/piitaya/lovelace-mushroom/releases
[weblate-url]: https://hosted.weblate.org/engage/mushroom/
