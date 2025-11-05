import { assign, boolean, object, optional, string } from "superstruct";
import { ActionConfig, actionConfigStruct } from "../../ha";
import {
  ActionsSharedConfig,
  actionsSharedConfigStruct,
} from "../../shared/config/actions-config";
import {
  appearanceSharedConfigStruct,
  AppearanceSharedConfig,
} from "../../shared/config/appearance-config";
import {
  entitySharedConfigStruct,
  EntitySharedConfig,
} from "../../shared/config/entity-config";
import { lovelaceCardConfigStruct } from "../../shared/config/lovelace-card-config";
import { LovelaceCardConfig } from "../../ha";

export type EntityCardConfig = LovelaceCardConfig &
  EntitySharedConfig &
  AppearanceSharedConfig &
  ActionsSharedConfig & {
    icon_color?: string;
    icon_tap_action?: ActionConfig;
    icon_hold_action?: ActionConfig;
    icon_double_tap_action?: ActionConfig;
  };

export const entityCardConfigStruct = assign(
  lovelaceCardConfigStruct,
  assign(
    entitySharedConfigStruct,
    appearanceSharedConfigStruct,
    actionsSharedConfigStruct
  ),
  object({
    icon_color: optional(string()),
    icon_tap_action: optional(actionConfigStruct),
    icon_hold_action: optional(actionConfigStruct),
    icon_double_tap_action: optional(actionConfigStruct),
  })
);
