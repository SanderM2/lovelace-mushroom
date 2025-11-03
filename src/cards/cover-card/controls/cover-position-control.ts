import { css, CSSResultGroup, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { CoverEntity, HomeAssistant, isAvailable } from "../../../ha";
import "../../../shared/slider";
import { getPosition } from "../utils";
import { CoverCardConfig } from "../cover-card-config";

@customElement("mushroom-cover-position-control")
export class CoverPositionControl extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public entity!: CoverEntity;

  @property({ attribute: false }) public config!: CoverCardConfig;

  @property({ attribute: false }) public currentPosition?: number;

  private onChange(e: CustomEvent<{ value: number }>): void {
    let value = e.detail.value;
    
    // Invert the value if the option is enabled
    if (this.config?.invert_position_slider) {
      value = 100 - value;
    }

    this.hass.callService("cover", "set_cover_position", {
      entity_id: this.entity.entity_id,
      position: value,
    });

    // Clear the current position when change is complete
    this.currentPosition = undefined;
  }

  onCurrentChange(e: CustomEvent<{ value?: number }>): void {
    let value = e.detail.value;
    
    // Store the current dragging position locally
    this.currentPosition = value;
    
    // Don't invert for current change - let the cover card handle display
    this.dispatchEvent(
      new CustomEvent("current-change", {
        detail: {
          value,
        },
      })
    );
  }

  protected render(): TemplateResult {
    let position: number | undefined;
    
    if (this.currentPosition !== undefined) {
      // Use current dragging position (already in slider coordinate space)
      position = this.currentPosition;
    } else {
      // Use entity position and apply inversion if needed
      position = getPosition(this.entity);
      if (this.config?.invert_position_slider && position !== undefined) {
        position = 100 - position;
      }
    }

    const stepSize = this.config?.position_step_size ?? 5;

    return html`
      <mushroom-slider
        .value=${position}
        .disabled=${!isAvailable(this.entity)}
        .showActive=${true}
        .entityId=${this.entity.entity_id}
        .step=${stepSize}
        @change=${this.onChange}
        @current-change=${this.onCurrentChange}
      />
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      mushroom-slider {
        --main-color: var(--slider-color);
        --bg-color: var(--slider-bg-color);
      }
    `;
  }
}
