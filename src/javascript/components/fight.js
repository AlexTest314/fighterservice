import { controls } from '../../constants/controls';
import { debounce } from '../helpers/debounce'

const FIRST_FIGHTER_PREFIX = '_first'
const SECOND_FIGHTER_PREFIX = '_second'
const getFighterId = (id, prefix) => `${id}${prefix}`

const changeHealtSize = function(fighter, healthStat, isSecondFighter) {
  const keyName = isSecondFighter ? FIRST_FIGHTER_PREFIX : SECOND_FIGHTER_PREFIX;
  let healthFighterView = document.querySelector(`#${isSecondFighter ? 'left' : 'right'}-fighter-indicator`);
  const baseHealth = fighter.health
  const currentHealth = healthStat[keyName]

  healthFighterView.style.width = `${currentHealth / baseHealth * 100}%`
}

export async function fight(firstFighter, secondFighter) {

    const healthStat = {  }

    healthStat[FIRST_FIGHTER_PREFIX] = firstFighter.health
    healthStat[SECOND_FIGHTER_PREFIX] = secondFighter.health   

  return new Promise((resolve) => {

    const kick = (fighter, opositeFighter, isFirstFighter) => {
    const keyName = isFirstFighter ? SECOND_FIGHTER_PREFIX : FIRST_FIGHTER_PREFIX
    const hitPower = getHitPower(fighter)

    healthStat[keyName] < hitPower
        ? healthStat[keyName] = 0
        :healthStat[keyName] = healthStat[keyName] - hitPower

        changeHealtSize(opositeFighter, healthStat, !isFirstFighter)

        if (healthStat[keyName] === 0) {
          resolve(fighter)
        }
  };

  const supKick = (fighter, opositeFighter, isFirstFighter) => {
    const keyName = isFirstFighter ? SECOND_FIGHTER_PREFIX : FIRST_FIGHTER_PREFIX

    healthStat[keyName] < getCriticalKick(fighter)
        ? healthStat[keyName] = 0
    :healthStat[keyName] = healthStat[keyName] - getCriticalKick(fighter)

    changeHealtSize(opositeFighter, healthStat, !isFirstFighter)

    if (healthStat[keyName] === 0) {
      resolve(fighter)
    }
  };
  
 const kickBlock = (fighter, opositeFighter, isFirstFighter) => {

  const keyName = isFirstFighter ? SECOND_FIGHTER_PREFIX : FIRST_FIGHTER_PREFIX
  const kickPower = getHitPower(fighter)
  const blockPower = getBlockPower(opositeFighter)
  const damage = blockPower > kickPower ? 0 : kickPower - blockPower

  console.log(healthStat[keyName] - damage)
  healthStat[keyName] < damage
        ? healthStat[keyName] = 0
        :healthStat[keyName] = healthStat[keyName] - damage

        changeHealtSize(opositeFighter, healthStat, !isFirstFighter)
        
        if (healthStat[keyName] === 0) {
          resolve(fighter)
        }
 }

  function actionKeys(fighter, opositeFighter, kickKey, blockKey, opositeBlockKey, superKey) {

      const isFirstFighter = kickKey === controls.PlayerOneAttack
      const pressed = new Set();
      const codesSet = new Set(superKey);
      const kickBlockKeys = new Set([kickKey, opositeBlockKey])
      let canSupKick = true
       const booleanFunc = function() {
        canSupKick = true
       }
          
      const debouncedKeydownHandler1 = debounce(function (event) {

           if (!(kickKey === event.code || blockKey === event.code || codesSet.has(event.code) || kickBlockKeys.has(event.code))) {
               return
           }

           if ([kickKey, opositeBlockKey].every((c) => pressed.has(c))) {
            kickBlock(fighter, opositeFighter, isFirstFighter)
           } else if (event.code === kickKey) {
            if(!pressed.has(blockKey)) {
              kick(fighter, opositeFighter, isFirstFighter);
            }  
           }
           
           if (superKey.every((c) => pressed.has(c))) {
            const delayFunc = function(){
              supKick(fighter, opositeFighter, isFirstFighter)
              canSupKick = false 
              setTimeout(booleanFunc, 10000)
            }
            if (canSupKick) {
              delayFunc()
            }
           }
      });
    
      const keydownHandler2 = function (event) {
          if (!(codesSet.has(event.code) || kickBlockKeys.has(event.code))) {
              return;
          }
          pressed.add(event.code);
      }; 
     
      const keyupHandler = function (event) {
          pressed.delete(event.code);
      };

      document.addEventListener('keydown', debouncedKeydownHandler1);
      document.addEventListener('keydown', keydownHandler2);
      document.addEventListener('keyup', keyupHandler);
  }
  
  actionKeys(firstFighter, secondFighter, controls.PlayerOneAttack, controls.PlayerOneBlock, controls.PlayerTwoBlock, controls.PlayerOneCriticalHitCombination);
  actionKeys(secondFighter, firstFighter, controls.PlayerTwoAttack, controls.PlayerTwoBlock, controls.PlayerOneBlock, controls.PlayerTwoCriticalHitCombination);
  
}
)};

export function getDamage(attacker, defender) {
  return getBlockPower(defender) > getHitPower(attacker) ? 0 : getHitPower(attacker) - getBlockPower(defender)
  
}

const getRandom = () => Math.random() + 1

export function getHitPower(fighter) {

  return fighter.attack * getRandom()  
  
}

export function getCriticalKick(fighter) {
  
    return fighter.attack * 2
    
  }

export function getBlockPower(fighter) {
 
  return fighter.defense * getRandom()
  
}
