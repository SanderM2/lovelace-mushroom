import {
  css,
  CSSResultGroup,
  html,
  LitElement,
  TemplateResult,
} from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { computeRTL, HomeAssistant, isAvailable } from "../../../ha";
import { LightEntity } from "../../../ha/data/light";
import "../../../shared/button";
import "../../../shared/button-group";
import { LightCardConfig } from "../light-card-config";

interface LightPreset {
  icon: string;
  entity?: string;
}

@customElement("mushroom-light-preset-control")
export class LightPresetControl extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public entity!: LightEntity;

  @property({ attribute: false }) public config!: LightCardConfig;

  @property({ type: Boolean, reflect: true }) public fill = false;

  private get presets(): LightPreset[] {
    return [
      {
        icon: this.config.preset_button_1_icon || "mdi:numeric-1-circle",
        entity: this.config.preset_button_1_entity,
      },
      {
        icon: this.config.preset_button_2_icon || "mdi:numeric-2-circle", 
        entity: this.config.preset_button_2_entity,
      },
      {
        icon: this.config.preset_button_3_icon || "mdi:numeric-3-circle",
        entity: this.config.preset_button_3_entity,
      },
    ];
  }

  private onPresetClick(preset: LightPreset): void {
    if (preset.entity) {
      // Toggle the switch entity
      this.hass.callService("switch", "toggle", {
        entity_id: preset.entity,
      });
    }
  }

  private isPresetActive(preset: LightPreset): boolean {
    if (!preset.entity) return false;
    
    const switchState = this.hass.states[preset.entity];
    return switchState?.state === "on";
  }

  protected render(): TemplateResult {
    const disabled = !isAvailable(this.entity);
    const rtl = computeRTL(this.hass);

    return html`
      <mushroom-button-group .fill=${this.fill} ?rtl=${rtl}>
        ${this.presets.map(
          (preset) => html`
            <mushroom-button
              class=${classMap({
                active: this.isPresetActive(preset),
              })}
              .disabled=${disabled || !preset.entity}
              @click=${() => this.onPresetClick(preset)}
              title=${preset.entity ? `Toggle ${preset.entity}` : "No entity configured"}
            >
              <ha-icon .icon=${preset.icon}></ha-icon>
            </mushroom-button>
          `
        )}
      </mushroom-button-group>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      mushroom-button.active {
        --main-color: var(--slider-color, var(--rgb-state-light));
        --bg-color: var(--slider-bg-color, rgba(var(--rgb-state-light), 0.2));
      }
    `;
  }
}