/**
 * Per-entity state blocking manager for Mushroom cards
 * Prevents external state updates during slider interactions for specific entities
 */

interface StateBlockManager {
  blockEntityUpdates(entityId: string, sliderValue?: number): void;
  unblockEntityUpdates(entityId: string): void;
  isEntityBlocked(entityId: string): boolean;
  getSliderValue(entityId: string): number | undefined;
  updateSliderValue(entityId: string, value: number): void;
  forceRenderStateInfo(element: any, stateObj: any, appearance: any, name: string, state?: string): any;
}

class MushroomStateBlockManager implements StateBlockManager {
  private blockedEntities: Map<string, { sliderValue?: number }> = new Map();

  blockEntityUpdates(entityId: string, sliderValue?: number): void {
    this.blockedEntities.set(entityId, { sliderValue });
  }

  unblockEntityUpdates(entityId: string): void {
    this.blockedEntities.delete(entityId);
  }

  isEntityBlocked(entityId: string): boolean {
    return this.blockedEntities.has(entityId);
  }

  getSliderValue(entityId: string): number | undefined {
    return this.blockedEntities.get(entityId)?.sliderValue;
  }

  updateSliderValue(entityId: string, value: number): void {
    const entityData = this.blockedEntities.get(entityId);
    if (entityData) {
      entityData.sliderValue = value;
    }
  }

  forceRenderStateInfo(element: any, stateObj: any, appearance: any, name: string, state?: string): any {
    // This allows internal updates even when blocked
    if (element && element.renderStateInfo) {
      return element.renderStateInfo(stateObj, appearance, name, state, false); // allowExternalUpdate = false bypasses external block
    }
    return null;
  }

  // Get all blocked entities (for debugging)
  getBlockedEntities(): string[] {
    return Array.from(this.blockedEntities.keys());
  }
}

// Global singleton instance
export const stateBlockManager = new MushroomStateBlockManager();

// Make it globally available
(window as any).mushroomStateBlockManager = stateBlockManager;