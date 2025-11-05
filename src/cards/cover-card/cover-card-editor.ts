import { html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { assert } from "superstruct";
import { LovelaceCardEditor, fireEvent } from "../../ha";
import setupCustomlocalize from "../../localize";
import { computeActionsFormSchema } from "../../shared/config/actions-config";
import { APPEARANCE_FORM_SCHEMA } from "../../shared/config/appearance-config";
import { MushroomBaseElement } from "../../utils/base-element";
import { GENERIC_LABELS } from "../../utils/form/generic-fields";
import { HaFormSchema } from "../../utils/form/ha-form";
import { loadHaComponents } from "../../utils/loader";
import { COVER_CARD_EDITOR_NAME, COVER_ENTITY_DOMAINS } from "./const";
import { CoverCardConfig, coverCardConfigStruct } from "./cover-card-config";

export const COVER_LABELS = [
  "show_buttons_control",
  "show_position_control",
  "show_tilt_position_control",
  "show_tilt_preset_control",
  "invert_position_slider",
  "position_step_size",
  "tilt_step_size",
  "tilt_preset_button_1_icon",
  "tilt_preset_button_1_entity",
  "tilt_preset_button_2_icon",
  "tilt_preset_button_2_entity",
  "tilt_preset_button_3_icon",
  "tilt_preset_button_3_entity",
];

const SCHEMA: HaFormSchema[] = [
  { name: "entity", selector: { entity: { domain: COVER_ENTITY_DOMAINS } } },
  { name: "name", selector: { text: {} } },
  { name: "icon", selector: { icon: {} }, context: { icon_entity: "entity" } },
  ...APPEARANCE_FORM_SCHEMA,
  {
    type: "grid",
    name: "",
    schema: [
      { name: "show_position_control", selector: { boolean: {} } },
      { name: "show_tilt_position_control", selector: { boolean: {} } },
      { name: "show_tilt_preset_control", selector: { boolean: {} } },
      { name: "show_buttons_control", selector: { boolean: {} } },
    ],
  },
  { name: "invert_position_slider", selector: { boolean: {} } },
  { name: "position_step_size", selector: { number: { min: 1, max: 100, mode: "box" } } },
  { name: "tilt_step_size", selector: { number: { min: 1, max: 100, mode: "box" } } },
  {
    type: "expandable",
    name: "",
    title: "Tilt Preset Buttons",
    schema: [
      { name: "tilt_preset_button_1_icon", selector: { icon: {} } },
      { name: "tilt_preset_button_1_entity", selector: { entity: { domain: ["switch"] } } },
      { name: "tilt_preset_button_2_icon", selector: { icon: {} } },
      { name: "tilt_preset_button_2_entity", selector: { entity: { domain: ["switch"] } } },
      { name: "tilt_preset_button_3_icon", selector: { icon: {} } },
      { name: "tilt_preset_button_3_entity", selector: { entity: { domain: ["switch"] } } },
    ],
  },
  {
    type: "expandable",
    name: "",
    title: "Icon Actions",
    schema: [
      { name: "icon_tap_action", selector: { ui_action: {} } },
      { name: "icon_hold_action", selector: { ui_action: {} } },
      { name: "icon_double_tap_action", selector: { ui_action: {} } },
    ],
  },
  {
    type: "expandable",
    name: "",
    title: "Card Actions",
    schema: computeActionsFormSchema(),
  },
];

@customElement(COVER_CARD_EDITOR_NAME)
export class CoverCardEditor
  extends MushroomBaseElement
  implements LovelaceCardEditor
{
  @state() private _config?: CoverCardConfig;

  connectedCallback() {
    super.connectedCallback();
    void loadHaComponents();
  }

  public setConfig(config: CoverCardConfig): void {
    assert(config, coverCardConfigStruct);
    this._config = config;
  }

  private _computeLabel = (schema: HaFormSchema) => {
    const customLocalize = setupCustomlocalize(this.hass!);

    if (GENERIC_LABELS.includes(schema.name)) {
      return customLocalize(`editor.card.generic.${schema.name}`);
    }
    if (COVER_LABELS.includes(schema.name)) {
      return customLocalize(`editor.card.cover.${schema.name}`);
    }
    return this.hass!.localize(
      `ui.panel.lovelace.editor.card.generic.${schema.name}`
    );
  };

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${SCHEMA}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    fireEvent(this, "config-changed", { config: ev.detail.value });
  }
}
