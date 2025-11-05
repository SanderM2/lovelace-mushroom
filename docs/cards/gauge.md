# Gauge Card

![Gauge](../images/gauge-card.png)

## Description

The Gauge card allows you to display sensor values with a horizontal gauge that includes color segments and an optional needle indicator.

## Configuration variables

All the options are available in the lovelace editor but you can use `yaml` if you want.

| Name                     | Type                                                               | Default     | Description                                        |
| ------------------------ | ------------------------------------------------------------------ | ----------- | -------------------------------------------------- |
| `entity`                 | string                                                             | Required    | Entity ID                                          |
| `name`                   | string                                                             | Optional    | Custom name                                        |
| `icon`                   | string                                                             | Optional    | Custom icon                                        |
| `icon_color`             | string                                                             | Optional    | Custom icon color                                  |
| `min`                    | number                                                             | `0`         | Minimum value                                      |
| `max`                    | number                                                             | `1000`      | Maximum value                                      |
| `unit`                   | string                                                             | Optional    | Custom unit of measurement                         |
| `needle`                 | boolean                                                            | `true`      | Show needle indicator                              |
| `needle_color`           | string                                                             | `black`     | Color of the needle                                |
| `fill`                   | boolean                                                            | `false`     | Show progress fill                                 |
| `severity`               | List of [Severity](#severity)                                      | Optional    | Color segments configuration                       |
| `tap_action`             | [Action](../action.md)                                            | `more-info` | Home assistant action to perform on tap           |
| `hold_action`            | [Action](../action.md)                                            | `more-info` | Home assistant action to perform on hold          |
| `double_tap_action`      | [Action](../action.md)                                            | `more-info` | Home assistant action to perform on double_tap    |

## Severity

| Name    | Type   | Default  | Description            |
| ------- | ------ | -------- | ---------------------- |
| `from`  | number | Required | Threshold value        |
| `color` | string | Required | Color for this segment |

## Examples

### Basic gauge

```yaml
type: custom:mushroom-gauge-card
entity: sensor.power_consumption
```

### Advanced gauge with segments

```yaml
type: custom:mushroom-gauge-card
entity: sensor.cpu_temperature
name: CPU Temperature
icon: mdi:thermometer
min: 0
max: 100
unit: "°C"
needle: true
needle_color: red
fill: true
severity:
  - from: 0
    color: green
  - from: 50
    color: yellow
  - from: 80
    color: red
```

### Power consumption gauge

```yaml
type: custom:mushroom-gauge-card
entity: sensor.power_consumption
name: Power Usage
icon: mdi:flash
min: 0
max: 5000
unit: "W"
needle: true
needle_color: black
fill: false
severity:
  - from: 0
    color: green
  - from: 2000
    color: orange
  - from: 4000
    color: red
```