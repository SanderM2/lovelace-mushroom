import {
  css,
  CSSResultGroup,
  html,
  LitElement,
  TemplateResult,
} from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { computeRTL, CoverEntity, HomeAssistant, isAvailable } from "../../../ha";
import "../../../shared/button";
import "../../../shared/button-group";
import { CoverCardConfig } from "../cover-card-config";

interface TiltPreset {
  icon: string;
  entity?: string;
}

@customElement("mushroom-cover-tilt-preset-control")
export class CoverTiltPresetControl extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public entity!: CoverEntity;

  @property({ attribute: false }) public config!: CoverCardConfig;

  @property({ type: Boolean, reflect: true }) public fill = false;

  private get presets(): TiltPreset[] {
    return [
      {
        icon: this.config.tilt_preset_button_1_icon || "mdi:minus",
        entity: this.config.tilt_preset_button_1_entity,
      },
      {
        icon: this.config.tilt_preset_button_2_icon || "mdi:slash-forward", 
        entity: this.config.tilt_preset_button_2_entity,
      },
      {
        icon: this.config.tilt_preset_button_3_icon || "mdi:tally-mark-1",
        entity: this.config.tilt_preset_button_3_entity,
      },
    ];
  }

  private onPresetClick(preset: TiltPreset): void {
    if (preset.entity) {
      // Toggle the switch entity
      this.hass.callService("switch", "toggle", {
        entity_id: preset.entity,
      });
    }
  }

  private isPresetActive(preset: TiltPreset): boolean {
    if (!preset.entity) return false;
    const switchEntity = this.hass.states[preset.entity];
    return switchEntity?.state === "on";
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
        --main-color: var(--slider-color, var(--rgb-state-cover));
        --bg-color: var(--slider-bg-color, rgba(var(--rgb-state-cover), 0.2));
      }
    `;
  }
}