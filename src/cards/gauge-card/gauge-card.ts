import { HassEntity } from "home-assistant-js-websocket";
import {
  CSSResultGroup,
  PropertyValues,
  TemplateResult,
  css,
  html,
  nothing,
} from "lit";
import { customElement, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import {
  ActionHandlerEvent,
  HomeAssistant,
  LovelaceCard,
  LovelaceCardEditor,
  actionHandler,
  hasAction,
  handleAction,
  computeRTL as haComputeRTL,
  isActive,
} from "../../ha";
import "../../shared/badge-icon";
import "../../shared/card";
import "../../shared/shape-avatar";
import "../../shared/shape-icon";
import "../../shared/state-info";
import "../../shared/state-item";
import { computeAppearance } from "../../utils/appearance";
import { MushroomBaseCard } from "../../utils/base-card";
import { cardStyle } from "../../utils/card-styles";
import { computeRgbColor } from "../../utils/colors";
import { registerCustomCard } from "../../utils/custom-cards";
import { computeEntityPicture } from "../../utils/info";
import { GAUGE_CARD_EDITOR_NAME, GAUGE_CARD_NAME, SENSOR_ENTITY_DOMAINS } from "./const";
import { GaugeCardConfig, GaugeCardSegment } from "./gauge-card-config";

type GaugeMode = "horizontal" | "vertical";

registerCustomCard({
  type: GAUGE_CARD_NAME,
  name: "Mushroom Gauge Card",
  description: "Card to display gauge with severity",
});

@customElement(GAUGE_CARD_NAME)
export class GaugeCard
  extends MushroomBaseCard<GaugeCardConfig>
  implements LovelaceCard
{
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("./gauge-card-editor");
    return document.createElement(GAUGE_CARD_EDITOR_NAME) as LovelaceCardEditor;
  }

  public static async getStubConfig(hass: HomeAssistant): Promise<GaugeCardConfig> {
    const entities = Object.keys(hass.states);
    const sensorEntities = entities.filter((e) =>
      SENSOR_ENTITY_DOMAINS.includes(e.split(".")[0])
    );
    
    return {
      type: `custom:${GAUGE_CARD_NAME}`,
      entity: sensorEntities[0],
      min: 0,
      max: 1000,
      needle: true,
      fill: false,
      severity: [
        { from: 0, color: "red" },
        { from: 500, color: "green" },
        { from: 800, color: "red" },
      ]
    };
  }

  protected get hasControls(): boolean {
    return true;
  }

  @state() protected _config?: GaugeCardConfig;

  getCardSize(): number {
    return 1;
  }

  setConfig(config: GaugeCardConfig): void {
    this._config = {
      tap_action: {
        action: "more-info",
      },
      hold_action: {
        action: "more-info",
      },
      ...config,
    };
  }

  private _handleAction(ev: ActionHandlerEvent) {
    handleAction(this, this.hass!, this._config!, ev.detail.action!);
  }

  private _getValue(): number {
    const stateObj = this._stateObj;
    
    if (!stateObj || isNaN(Number(stateObj.state))) {
      return 0;
    }
    
    return Number(stateObj.state);
  }

  private _getMin(): number {
    return this._config?.min ?? 0;
  }

  private _getMax(): number {
    return this._config?.max ?? 1000;
  }

  private _getUnit(): string {
    const stateObj = this._stateObj;
    
    if (this._config?.unit) {
      return this._config.unit;
    }
    
    return stateObj?.attributes?.unit_of_measurement || "";
  }

  private _getValueColor(value: number): string {
    const segments = this._config?.severity || [];
    
    // Sort segments by 'from' value in descending order
    const sortedSegments = [...segments].sort((a, b) => b.from - a.from);
    
    // Find the first segment where value >= from
    for (const segment of sortedSegments) {
      if (value >= segment.from) {
        return segment.color;
      }
    }
    
    // Default color if no segment matches
    return "var(--primary-color)";
  }

  private _getValuePercentage(): number {
    const value = this._getValue();
    const min = this._getMin();
    const max = this._getMax();
    
    return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  }

  private _renderGauge(): TemplateResult {
    const percentage = this._getValuePercentage();
    const value = this._getValue();
    const color = this._getValueColor(value);
    
    const segments = this._config?.severity || [];
    const min = this._getMin();
    const max = this._getMax();
    
    return html`
      <div class="gauge">
        <div class="gauge-track">
          ${segments.length > 0 ? segments.map((segment, index) => {
            const nextSegment = segments[index + 1];
            const segmentStart = Math.max(0, Math.min(100, ((segment.from - min) / (max - min)) * 100));
            const segmentEnd = nextSegment 
              ? Math.max(0, Math.min(100, ((nextSegment.from - min) / (max - min)) * 100))
              : 100;
            const segmentWidth = Math.max(0, segmentEnd - segmentStart);
            
            if (segmentWidth <= 0) return nothing;
            
            return html`
              <div 
                class="gauge-segment"
                style=${styleMap({
                  left: `${segmentStart}%`,
                  width: `${segmentWidth}%`,
                  backgroundColor: segment.color,
                })}
              ></div>
            `;
          }) : html`
            <div 
              class="gauge-segment"
              style=${styleMap({
                left: '0%',
                width: '100%',
                backgroundColor: 'var(--primary-color)',
              })}
            ></div>
          `}
        </div>
        ${this._config?.fill !== false ? html`
          <div 
            class="gauge-fill"
            style=${styleMap({
              width: `${Math.max(0, Math.min(100, percentage))}%`,
              backgroundColor: color,
            })}
          ></div>
        ` : nothing}
        ${this._config?.needle !== false ? html`
          <div 
            class="gauge-needle-container"
            style=${styleMap({
              left: `${Math.max(0, Math.min(100, percentage))}%`,
            })}
          >
            <svg class="gauge-needle-svg" viewBox="-6 -16 12 16">
              <path 
                class="needle" 
                d="M -5 0 L 0 -8 L 5 0 z" 
                fill=${this._config?.needle_color || 'black'}
              />
            </svg>
          </div>
          <div 
            class="gauge-needle-container-top"
            style=${styleMap({
              left: `${Math.max(0, Math.min(100, percentage))}%`,
            })}
          >
            <svg class="gauge-needle-svg" viewBox="-6 0 12 16">
              <path 
                class="needle" 
                d="M -5 0 L 0 8 L 5 0 z" 
                fill=${this._config?.needle_color || 'black'}
              />
            </svg>
          </div>
        ` : nothing}
      </div>
    `;
  }

  protected render() {
    if (!this._config || !this.hass || !this._config.entity) {
      return nothing;
    }

    const stateObj = this._stateObj;

    if (!stateObj) {
      return this.renderNotFound(this._config);
    }

    const name = this._config.name || stateObj.attributes.friendly_name || "";
    const icon = this._config.icon;
    const appearance = computeAppearance(this._config);
    const picture = computeEntityPicture(stateObj, appearance.icon_type);

    const value = this._getValue();
    const unit = this._getUnit();
    let stateDisplay = `${value}${unit ? ` ${unit}` : ""}`;

    const rtl = haComputeRTL(this.hass);

    const gaugeStyle = {};
    const iconColor = this._config?.icon_color;
    if (iconColor) {
      const iconRgbColor = computeRgbColor(iconColor);
      gaugeStyle["--gauge-color"] = `rgb(${iconRgbColor})`;
      gaugeStyle["--gauge-bg-color"] = `rgba(${iconRgbColor}, 0.2)`;
    }

    return html`
      <ha-card
        class=${classMap({ "fill-container": appearance.fill_container })}
      >
        <mushroom-card .appearance=${appearance} ?rtl=${rtl}>
          <mushroom-state-item
            ?rtl=${rtl}
            .appearance=${appearance}
            @action=${this._handleAction}
            .actionHandler=${actionHandler({
              hasHold: hasAction(this._config.hold_action),
              hasDoubleClick: hasAction(this._config.double_tap_action),
            })}
          >
            ${picture
              ? this.renderPicture(picture)
              : this.renderIcon(stateObj, icon)}
            ${this.renderBadge(stateObj)}
            ${this.renderStateInfo(stateObj, appearance, name, stateDisplay)};
          </mushroom-state-item>
          <div class="actions" ?rtl=${rtl}>
            <div class="gauge-container" style=${styleMap(gaugeStyle)}>
              ${this._renderGauge()}
            </div>
          </div>
        </mushroom-card>
      </ha-card>
    `;
  }

  renderIcon(stateObj: HassEntity, icon?: string): TemplateResult {
    const active = isActive(stateObj);
    const iconStyle = {};
    const iconColor = this._config?.icon_color;
    if (iconColor) {
      const iconRgbColor = computeRgbColor(iconColor);
      iconStyle["--icon-color"] = `rgb(${iconRgbColor})`;
      iconStyle["--shape-color"] = `rgba(${iconRgbColor}, 0.2)`;
    }
    return html`
      <mushroom-shape-icon
        slot="icon"
        .disabled=${!active}
        style=${styleMap(iconStyle)}
      >
        <ha-state-icon
          .hass=${this.hass}
          .stateObj=${stateObj}
          .icon=${icon}
        ></ha-state-icon>
      </mushroom-shape-icon>
    `;
  }

  static get styles(): CSSResultGroup {
    return [
      super.styles,
      cardStyle,
      css`
        mushroom-state-item {
          cursor: pointer;
        }
        
        mushroom-shape-icon {
          --icon-color: rgb(var(--rgb-state-sensor));
          --shape-color: rgba(var(--rgb-state-sensor), 0.2);
        }
        
        .gauge-container {
          flex: 1;
        }
        
        .gauge {
          position: relative;
          height: var(--control-height, 40px);
          background: rgba(var(--rgb-secondary-text-color), 0.2);
          border-radius: var(--control-border-radius, 10px);
          overflow: visible;
        }
        
        .gauge-track {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
        
        .gauge-segment {
          position: absolute;
          top: 0;
          bottom: 0;
        }
        
        .gauge-segment:first-child {
          border-radius: var(--control-border-radius, 10px) 0 0 var(--control-border-radius, 10px);
        }
        
        .gauge-segment:last-child {
          border-radius: 0 var(--control-border-radius, 10px) var(--control-border-radius, 10px) 0;
        }
        
        .gauge-segment:only-child {
          border-radius: var(--control-border-radius, 10px);
        }
        
        .gauge-fill {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          border-radius: var(--control-border-radius, 10px);
          transition: width 0.3s ease-in-out;
          background: var(--gauge-color, rgb(var(--rgb-state-sensor)));
          z-index: 2;
        }
        
        .gauge-needle-container {
          position: absolute;
          bottom: 0;
          width: 16px;
          height: 20px;
          transform: translateX(-50%);
          transition: left 0.3s ease-in-out;
          z-index: 3;
          pointer-events: none;
        }
        
        .gauge-needle-container-top {
          position: absolute;
          top: 0;
          width: 16px;
          height: 20px;
          transform: translateX(-50%);
          transition: left 0.3s ease-in-out;
          z-index: 3;
          pointer-events: none;
        }
        
        .gauge-needle-svg {
          width: 100%;
          height: 100%;
        }
        
        .needle {
          transition: fill 0.3s ease-in-out;
        }
      `,
    ];
  }
}

function handleActionHandler(_ev: ActionHandlerEvent, _config: GaugeCardConfig) {
  // Handle actions here if needed
}