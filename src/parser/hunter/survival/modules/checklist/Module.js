import React from 'react';

import BaseChecklist from 'parser/shared/modules/features/Checklist/Module';
import CastEfficiency from 'parser/shared/modules/CastEfficiency';
import Combatants from 'parser/shared/modules/Combatants';
import PreparationRuleAnalyzer from 'parser/shared/modules/features/Checklist/PreparationRuleAnalyzer';

import Component from './Component';
import AlwaysBeCasting from '../features/AlwaysBeCasting';
import TimeFocusCapped from '../../../shared/modules/features/TimeFocusCapped';
import MongooseBite from '../../modules/talents/MongooseBite';
import BirdOfPrey from '../../modules/talents/BirdOfPrey';


class Checklist extends BaseChecklist {
  static dependencies = {
    combatants: Combatants,
    castEfficiency: CastEfficiency,
    preparationRuleAnalyzer: PreparationRuleAnalyzer,
    alwaysBeCasting: AlwaysBeCasting,
    timeFocusCapped: TimeFocusCapped,
    mongooseBite: MongooseBite,
    birdOfPrey: BirdOfPrey,
  };
  render() {
    return (
      <Component
        combatant={this.combatants.selected}
        castEfficiency={this.castEfficiency}
        thresholds={{
          ...this.preparationRuleAnalyzer.thresholds,
          downtimeSuggestionThresholds: this.alwaysBeCasting.suggestionThresholds,
          focusCappedSuggestionThresholds: this.timeFocusCapped.suggestionThresholds,
          mongooseBiteAverageFocusThreshold: this.mongooseBite.focusOnMongooseWindowThreshold,
          mongooseBite5StackHitPercentageThreshold: this.mongooseBite.mongoose5StackHitThreshold,
          birdPercentEffectiveness: this.birdOfPrey.birdPercentEffectiveness,
        }}
      />
    );
  }
}

export default Checklist;
