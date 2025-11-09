import {
  css,
  CSSResultGroup,
  html,
  LitElement,
  nothing,
  PropertyValues,
  TemplateResult,
} from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { stateBlockManager } from "../utils/state-block-manager";

const getPercentageFromEvent = (e: PointerEvent, target: HTMLElement) => {
  const x = e.clientX;
  const rect = target.getBoundingClientRect();
  const offset = rect.left;
  const total = rect.width;
  return Math.max(Math.min(1, (x - offset) / total), 0);
};

export const DEFAULT_SLIDER_THRESHOLD = 10;

@customElement("mushroom-slider")
export class SliderItem extends LitElement {
  @property({ type: Boolean }) public disabled: boolean = false;

  @property({ type: Boolean }) public inactive: boolean = false;

  @property({ type: Boolean, attribute: "show-active" })
  public showActive?: boolean;

  @property({ type: Boolean, attribute: "show-indicator" })
  public showIndicator?: boolean;

  @property({ attribute: false, type: Number, reflect: true })
  public value?: number;

  @property({ type: Number })
  public step: number = 5;

  @property({ type: Number })
  public min: number = 0;

  @property({ type: Number })
  public max: number = 100;

  @property({ type: String, attribute: "entity-id" })
  public entityId?: string;

  private _isDragging: boolean = false;
  private _startValue?: number;
  private _pointerId?: number;

  // Bound event handlers to avoid binding issues
  private _boundPointerDown = this._handlePointerDown.bind(this);
  private _boundPointerMove = this._handlePointerMove.bind(this);
  private _boundPointerUp = this._handlePointerUp.bind(this);
  //private _boundClick = this._handleClick.bind(this);

  @state() controlled: boolean = false;

  valueToPercentage(value: number) {
    return (value - this.min) / (this.max - this.min);
  }

  percentageToValue(value: number) {
    const rawValue = (this.max - this.min) * value + this.min;
    // Round to step size immediately
    return Math.round(rawValue / this.step) * this.step;
  }

  protected firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);
    this.setupListeners();
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.setupListeners();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.destroyListeners();
  }

  @query("#slider")
  private slider;

  setupListeners() {
    if (this.slider) {
      // Add event listeners for pointer events
      this.slider.addEventListener('pointerdown', this._boundPointerDown);
      //this.slider.addEventListener('click', this._boundClick);
      
      // Set CSS to prevent default touch actions
      this.slider.style.touchAction = 'none'; // Prevent all default behaviors
    }
  }

  destroyListeners() {
    if (this.slider) {
      this.slider.removeEventListener('pointerdown', this._boundPointerDown);
      //this.slider.removeEventListener('click', this._boundClick);
    }
    // Always clean up global listeners
    this._removeGlobalListeners();
  }

  private _removeGlobalListeners() {
    document.removeEventListener('pointermove', this._boundPointerMove);
    document.removeEventListener('pointerup', this._boundPointerUp);
    document.removeEventListener('pointercancel', this._boundPointerUp);
  }

  private _handlePointerDown(e: PointerEvent) {
    if (this.disabled || this._isDragging) return;
    
    // Only handle primary pointer (left mouse button, first finger)
    if (!e.isPrimary) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    this._isDragging = true;
    this.controlled = true;
    this._startValue = this.value;
    this._pointerId = e.pointerId;
    
    // Block external state updates for this entity during slider interaction
    if (this.entityId) {
      stateBlockManager.blockEntityUpdates(this.entityId, this.value);
    }
    
    // Add global listeners for move and up events
    document.addEventListener('pointermove', this._boundPointerMove, { passive: false });
    document.addEventListener('pointerup', this._boundPointerUp);
    document.addEventListener('pointercancel', this._boundPointerUp);
    
    // Capture the pointer to this element for reliable tracking
    try {
      this.slider.setPointerCapture(e.pointerId);
    } catch (error) {
      // Ignore errors from setPointerCapture
    }
  }

  private _handlePointerMove(e: PointerEvent) {
    if (!this._isDragging || this.disabled) return;
    
    // Only handle the pointer we're tracking
    if (e.pointerId !== this._pointerId) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const percentage = getPercentageFromEvent(e, this.slider);
    this.value = this.percentageToValue(percentage);
    
    if (this.entityId) {
      stateBlockManager.updateSliderValue(this.entityId, this.value);
    }
    
    this.dispatchEvent(
      new CustomEvent("current-change", {
        detail: { value: this.value },
      })
    );
  }

  private _handlePointerUp(e: PointerEvent) {
    if (!this._isDragging || this.disabled) return;
    
    // Only handle the pointer we're tracking
    if (e.pointerId !== this._pointerId) return;
    
    this._isDragging = false;
    this.controlled = false;
    
    // Calculate final value
    const percentage = getPercentageFromEvent(e, this.slider);
    this.value = this.percentageToValue(percentage);
    
    // Unblock external state updates before final events
    if (this.entityId) {
      stateBlockManager.unblockEntityUpdates(this.entityId);
    }
    
    // Clean up
    this._removeGlobalListeners();
    this._pointerId = undefined;
    
    // Release pointer capture if it was set
    try {
      if (this.slider.hasPointerCapture(e.pointerId)) {
        this.slider.releasePointerCapture(e.pointerId);
      }
    } catch (error) {
      // Ignore errors
    }
    
    // Dispatch final events
    this.dispatchEvent(
      new CustomEvent("current-change", {
        detail: { value: undefined },
      })
    );
    
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: this.value },
      })
    );
  }

  /*
  private _handleClick(e: PointerEvent) {
    // Prevent click after drag
    if (this.disabled || this._isDragging) return;
    
    // Small delay to ensure we're not in the middle of a drag operation
    setTimeout(() => {
      if (this._isDragging) return;
      
      const percentage = getPercentageFromEvent(e, this.slider);
      this.value = Math.round(this.percentageToValue(percentage) / this.step) * this.step;
      
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: { value: this.value },
        })
      );
    }, 10);
  }
  */

  protected render(): TemplateResult {
    return html`
      <div
        class=${classMap({
          container: true,
          inactive: this.inactive || this.disabled,
          controlled: this.controlled,
        })}
      >
        <div
          id="slider"
          class="slider"
          style=${styleMap({
            "--value": `${this.valueToPercentage(this.value ?? 0)}`,
          })}
        >
          <div class="slider-track-background"></div>
          ${this.showActive
            ? html`<div class="slider-track-active"></div>`
            : nothing}
          ${this.showIndicator
            ? html`<div class="slider-track-indicator"></div>`
            : nothing}
        </div>
      </div>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        --main-color: rgba(var(--rgb-secondary-text-color), 1);
        --bg-gradient: none;
        --bg-color: rgba(var(--rgb-secondary-text-color), 0.2);
        --main-color-inactive: rgb(var(--rgb-disabled));
        --bg-color-inactive: rgba(var(--rgb-disabled), 0.2);
      }
      .container {
        display: flex;
        flex-direction: row;
        height: var(--control-height);
      }
      .slider {
        position: relative;
        height: 100%;
        width: 100%;
        border-radius: var(--control-border-radius);
        transform: translateZ(0);
        overflow: hidden;
        cursor: pointer;
      }
      .slider * {
        pointer-events: none;
      }
      .slider .slider-track-background {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: var(--bg-color);
        background-image: var(--gradient);
      }
      .slider .slider-track-active {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        transform: scale3d(var(--value, 0), 1, 1);
        transform-origin: left;
        background-color: var(--main-color);
        transition: transform 180ms ease-in-out;
      }
      .slider .slider-track-indicator {
        position: absolute;
        top: 0;
        bottom: 0;
        left: calc(var(--value, 0) * (100% - 10px));
        width: 10px;
        border-radius: 3px;
        background-color: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
        transition: left 180ms ease-in-out;
      }
      .slider .slider-track-indicator:after {
        display: block;
        content: "";
        background-color: var(--main-color);
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        height: 20px;
        width: 2px;
        border-radius: 1px;
      }
      .inactive .slider .slider-track-background {
        background-color: var(--bg-color-inactive);
        background-image: none;
      }
      .inactive .slider .slider-track-indicator:after {
        background-color: var(--main-color-inactive);
      }
      .inactive .slider .slider-track-active {
        background-color: var(--main-color-inactive);
      }
      .controlled .slider .slider-track-active {
        transition: none;
      }
      .controlled .slider .slider-track-indicator {
        transition: none;
      }
    `;
  }
}
