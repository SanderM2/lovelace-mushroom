import { assign, boolean, number, object, optional, string, array } from "superstruct";
import { ActionConfig, actionConfigStruct, LovelaceCardConfig } from "../../ha";
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

export interface GaugeCardSegment {
    from: number;
    color: string;
}

export type GaugeCardConfig = LovelaceCardConfig &
    EntitySharedConfig &
    AppearanceSharedConfig &
    ActionsSharedConfig & {
        name?: string;
        icon?: string;
        icon_color?: string;
        min?: number;
        max?: number;
        unit?: string;
        needle?: boolean;
        needle_color?: string;
        fill?: boolean;
        severity?: GaugeCardSegment[];
    };

export const gaugeCardSegmentStruct = object({
    from: number(),
    color: string(),
});

export const gaugeCardConfigStruct = assign(
    lovelaceCardConfigStruct,
    assign(
        entitySharedConfigStruct,
        appearanceSharedConfigStruct,
        actionsSharedConfigStruct
    ),
    object({
        name: optional(string()),
        icon: optional(string()),
        icon_color: optional(string()),
        min: optional(number()),
        max: optional(number()),
        unit: optional(string()),
        needle: optional(boolean()),
        needle_color: optional(string()),
        fill: optional(boolean()),
        severity: optional(array(gaugeCardSegmentStruct)),
    })
);