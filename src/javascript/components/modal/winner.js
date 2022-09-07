import { createFighterImage } from '../fighterPreview';
import { showModal } from '../modal/modal'

export function showWinnerModal(fighter) {
 
  const title = `Congratulation the winner is ${fighter.name}`
  const winnerImg = createFighterImage(fighter)

  const onClose = () => document.location.reload(true)
 showModal({title, bodyElement:winnerImg, onClose})
  // call showModal function 
}
