import { html, nothing, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import memoizeOne from "memoize-one";
import { assert } from "superstruct";
import { LocalizeFunc, LovelaceCardEditor, fireEvent } from "../../ha";
import setupCustomlocalize from "../../localize";
import { computeActionsFormSchema } from "../../shared/config/actions-config";
import { APPEARANCE_FORM_SCHEMA } from "../../shared/config/appearance-config";
import { MushroomBaseElement } from "../../utils/base-element";
import { GENERIC_LABELS } from "../../utils/form/generic-fields";
import { HaFormSchema } from "../../utils/form/ha-form";
import { loadHaComponents } from "../../utils/loader";
import { GAUGE_CARD_EDITOR_NAME, SENSOR_ENTITY_DOMAINS } from "./const";
import { GaugeCardConfig, gaugeCardConfigStruct, GaugeCardSegment } from "./gauge-card-config";

export const GAUGE_LABELS = ["min", "max", "unit", "needle", "needle_color", "fill"];

const computeSchema = memoizeOne((): HaFormSchema[] => [
  { 
    name: "entity", 
    selector: { 
      entity: { 
        domain: SENSOR_ENTITY_DOMAINS,
        device_class: ["temperature", "humidity", "pressure", "power", "energy"]
      } 
    } 
  },
  { name: "name", selector: { text: {} } },
  {
    type: "grid",
    name: "",
    schema: [
      {
        name: "icon",
        selector: { icon: {} },
        context: { icon_entity: "entity" },
      },
      { name: "icon_color", selector: { mush_color: {} } },
    ],
  },
  ...APPEARANCE_FORM_SCHEMA,
  {
    type: "grid",
    name: "",
    schema: [
      { name: "min", selector: { number: { step: 1 } } },
      { name: "max", selector: { number: { step: 1 } } },
    ],
  },
  { name: "unit", selector: { text: {} } },
  {
    type: "grid", 
    name: "",
    schema: [
      { name: "needle", selector: { boolean: {} } },
      { name: "needle_color", selector: { mush_color: {} } },
    ],
  },
  { name: "fill", selector: { boolean: {} } },
  ...computeActionsFormSchema(),
]);

@customElement(GAUGE_CARD_EDITOR_NAME)
export class GaugeCardEditor
  extends MushroomBaseElement
  implements LovelaceCardEditor
{
  @state() private _config?: GaugeCardConfig;

  connectedCallback() {
    super.connectedCallback();
    void loadHaComponents();
  }

  public setConfig(config: GaugeCardConfig): void {
    assert(config, gaugeCardConfigStruct);
    this._config = config;
  }

  private _computeLabel = (schema: HaFormSchema) => {
    const customLocalize = setupCustomlocalize(this.hass!);

    if (GAUGE_LABELS.includes(schema.name)) {
      return customLocalize(`editor.card.gauge.${schema.name}`);
    }

    if (GENERIC_LABELS.includes(schema.name)) {
      return customLocalize(`editor.card.generic.${schema.name}`);
    }

    if (schema.name === "gauge_settings") {
      return customLocalize("editor.card.gauge.gauge_settings");
    }

    return this.hass!.localize(
      `ui.panel.lovelace.editor.card.generic.${schema.name}`
    );
  };

  private _valueChanged(ev: CustomEvent): void {
    fireEvent(this, "config-changed", { config: ev.detail.value });
  }

  private _addSegment(): void {
    if (!this._config) return;
    
    const severity = [...(this._config.severity || [])];
    const newSegment: GaugeCardSegment = {
      from: severity.length > 0 ? severity[severity.length - 1].from + 100 : this._config.min || 0,
      color: "red"
    };
    
    severity.push(newSegment);
    
    fireEvent(this, "config-changed", { 
      config: { ...this._config, severity } 
    });
  }

  private _removeSegment(index: number): void {
    if (!this._config) return;
    
    const severity = [...(this._config.severity || [])];
    severity.splice(index, 1);
    
    fireEvent(this, "config-changed", { 
      config: { ...this._config, severity } 
    });
  }

  private _updateSegment(index: number, field: keyof GaugeCardSegment, value: any): void {
    if (!this._config) return;
    
    const severity = [...(this._config.severity || [])];
    severity[index] = { ...severity[index], [field]: value };
    
    fireEvent(this, "config-changed", { 
      config: { ...this._config, severity } 
    });
  }

  private _renderSeverityEditor(): TemplateResult {
    if (!this._config) return html``;

    const segments = this._config.severity || [];

    return html`
      <div class="severity-editor">
        <div class="severity-header">
          <h3>Color Segments</h3>
          <mwc-button @click=${this._addSegment}>Add Segment</mwc-button>
        </div>
        ${segments.map((segment, index) => html`
          <div class="severity-item">
            <ha-textfield
              .label=${"From value"}
              .value=${segment.from}
              type="number"
              @change=${(e: any) => this._updateSegment(index, 'from', Number(e.target.value))}
            ></ha-textfield>
            <ha-selector
              .hass=${this.hass}
              .selector=${{ mush_color: {} }}
              .value=${segment.color}
              .label=${"Color"}
              @value-changed=${(e: any) => this._updateSegment(index, 'color', e.detail.value)}
            ></ha-selector>
            <mwc-button @click=${() => this._removeSegment(index)}>Remove</mwc-button>
          </div>
        `)}
      </div>
    `;
  }

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    const customLocalize = setupCustomlocalize(this.hass);
    const schema = computeSchema();

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${schema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
      ${this._renderSeverityEditor()}
      
      <style>
        .severity-editor {
          margin-top: 16px;
          padding: 16px;
          border: 1px solid var(--divider-color);
          border-radius: 8px;
        }
        
        .severity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .severity-header h3 {
          margin: 0;
          font-size: 16px;
        }
        
        .severity-item {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 12px;
          align-items: center;
          margin-bottom: 12px;
          padding: 12px;
          border: 1px solid var(--divider-color);
          border-radius: 8px;
          background: var(--card-background-color);
        }
        
        .severity-item mwc-button {
          --mdc-theme-primary: var(--error-color);
        }
      </style>
    `;
  }
}