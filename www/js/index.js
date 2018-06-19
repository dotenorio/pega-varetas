var colors = [
  {
    id: 'yellow',
    title: 'Amarelo',
    backgroundColor: 'yellow-300',
    buttonColor: 'yellow-800',
    points: 5
  },
  {
    id: 'green',
    title: 'Verde',
    backgroundColor: 'green-300',
    buttonColor: 'green-800',
    points: 10
  },
  {
    id: 'blue',
    title: 'Azul',
    backgroundColor: 'blue-300',
    buttonColor: 'blue-800',
    points: 35
  },
  {
    id: 'red',
    title: 'Vermelho',
    backgroundColor: 'red-300',
    buttonColor: 'red-800',
    points: 50
  },
  {
    id: 'black',
    title: 'Preto',
    backgroundColor: 'black',
    buttonColor: 'grey-300',
    points: 100
  }
]

var players = [
  {
    name: 'Fernando',
    qty: {
      yellow: 0,
      green: 0,
      blue: 0,
      red: 0,
      black: 0
    },
    active: true
  },
  {
    name: 'Joaquim',
    qty: {
      yellow: 0,
      green: 0,
      blue: 0,
      red: 0,
      black: 0
    },
    active: false
  },
  {
    name: 'Maria',
    qty: {
      yellow: 0,
      green: 0,
      blue: 0,
      red: 0,
      black: 0
    },
    active: false
  }
]

MobileUI.getPlayerFirstLetter = function (name) {
  return name[0]
}

MobileUI.getPlayerClass = function (active) {
  return (active) ? 'player active-player' : 'player'
}

function getColor (colorId) {
  return colors.filter(function (color) {
    return color.id === colorId
  })[0]
}

function setActive (index) {
  var i = 0
  players = players.map(function (player) {
    player.active = false
    if (i === index) {
      player.active = true
    }
    i++
    return player
  })
  document.getElementById('player-' + index).classList.add('active-player')
}

function loadPlayer (index) {
  var player = players[index]
  var totalPoints = 0

  setActive(index)

  for (var colorId in player.qty) {
    var qty = player.qty[colorId]
    var points = getColor(colorId).points
    document.getElementById('player-qty-' + colorId).innerHTML = qty
    totalPoints += (qty * points)
  }
  document.getElementById('player-name').innerHTML = player.name
  document.getElementById('player-total-points').innerHTML = totalPoints + ' pontos'
}

function removeItem (color) {
  alert(color)
}

function addItem (color) {
  alert(color)
}

window.onload = function () {
  loadPlayer(0)
}
