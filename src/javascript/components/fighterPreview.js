import { createElement } from '../helpers/domHelper';


export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });  
  console.log('fighter', fighter)
      const { name, health, defense, attack   } = fighter

    const showFighterInfo = createElement({
      tagName: 'div',
      className: `fighter-preview___root-info ${positionClassName}`,
    });

    const stats = [{statName:'Name', statValue: name }, {statName:'Health', statValue: health}, {statName:'Defense', statValue: defense}, {statName:'Attack', statValue: attack}]

    const infoList = createElement({
      tagName: 'ul',
      className: 'infoList',
    });

    stats.forEach(item =>{
      const row = createElement({tagName: 'li', className: 'infoListItem'})
      row.innerText = `${item.statName}: ${item.statValue}`
      infoList.append(row)
    })

    showFighterInfo.append(infoList) 
    
  fighterElement.append(createFighterImage(fighter), showFighterInfo)
  // todo: show fighter info (image, name, health, etc.)

  return fighterElement;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = { 
    src: source, 
    title: name,
    alt: name 
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });

  return imgElement;
}
