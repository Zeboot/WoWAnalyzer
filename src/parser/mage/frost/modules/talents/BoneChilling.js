import React from 'react';
import SPELLS from 'common/SPELLS';
import Statistic from 'interface/statistics/Statistic';
import UptimeIcon from 'interface/icons/Uptime';
import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';
import Analyzer from 'parser/core/Analyzer';
import { SELECTED_PLAYER, SELECTED_PLAYER_PET } from 'parser/core/EventFilter';
import calculateEffectiveDamage from 'parser/core/calculateEffectiveDamage';

import Events from 'parser/core/Events';
import { formatNumber, formatPercentage } from 'common/format';

const WHITELIST = [
  SPELLS.ICICLE_DAMAGE,
  SPELLS.ICE_LANCE_DAMAGE,
  SPELLS.BLIZZARD_DAMAGE,
  SPELLS.FLURRY_DAMAGE,
  SPELLS.FROSTBOLT_DAMAGE,
  SPELLS.FROZEN_ORB_DAMAGE,
  SPELLS.COMET_STORM_DAMAGE,
  SPELLS.GLACIAL_SPIKE_DAMAGE,
  SPELLS.FROST_NOVA,
  SPELLS.EBONBOLT_DAMAGE,
  SPELLS.GLACIAL_ASSAULT_DAMAGE,
  SPELLS.CONE_OF_COLD,
  SPELLS.RAY_OF_FROST_TALENT,
  SPELLS.ICE_NOVA_TALENT,
  SPELLS.WATERBOLT,
];

const MOD_PER_STACK = 0.005;
class BoneChilling extends Analyzer {

  totalDamage = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.BONE_CHILLING_TALENT.id);
    if (this.active) {
      this.addEventListener(Events.damage.by(SELECTED_PLAYER | SELECTED_PLAYER_PET).spell(WHITELIST), this.onAffectedDamage);
    }
  }

  onAffectedDamage(event) {
    const buffInfo = this.selectedCombatant.getBuff(SPELLS.BONE_CHILLING_BUFF.id);
    if (!buffInfo) {
      return;
    }
    const mod = buffInfo.stacks * MOD_PER_STACK;
    const increase = calculateEffectiveDamage(event, mod);
    this.totalDamage += increase;
  }

  get uptime() {
		return this.selectedCombatant.getBuffUptime(SPELLS.BONE_CHILLING_BUFF.id) / this.owner.fightDuration;
	}

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.CORE(90)}
        size="flexible"
        tooltip={`Total damage increase: ${formatNumber(this.totalDamage)}`}
      >
        <BoringSpellValueText spell={SPELLS.BONE_CHILLING_TALENT}>
          <UptimeIcon /> {formatPercentage(this.uptime)}% <small>Buff uptime</small><br />
          {this.owner.formatItemDamageDone(this.totalDamage)}
        </BoringSpellValueText>
      </Statistic>
    );
  }

}

export default BoneChilling;
