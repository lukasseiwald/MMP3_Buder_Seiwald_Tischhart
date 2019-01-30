export const centerGameObjects = (objects) => {
  objects.forEach(function (object) {
    object.anchor.setTo(0.5)
  })
}

export function isTouchDevice(){
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
}

export function addImage(game, x, y, name, width, height){
  let bg = game.add.image(x, y, name);
  bg.width = width;
  bg.height = height;
  return bg;
}

export function getPlayerNicknames(){
  let names = new Array();
  for (let [playerId, player] of window.game.global.players){
    names.push(player.nickname);
  }
  return names;
}
