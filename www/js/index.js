var playerIndexEditing = null
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
var players = []

if (window.localStorage.getItem('players')) {
  players = JSON.parse(window.localStorage.getItem('players'))
}

MobileUI.getPlayerFirstLetter = function (name) {
  return name[0].toUpperCase() + name[1].toLowerCase()
}

MobileUI.getPlayerClass = function (active) {
  return (active) ? 'player active-player' : 'player'
}

MobileUI.setWinner = function (winner) {
  if (winner) return '<i class="icon ion-record"></i>'
  return ''
}

MobileUI.setWinnerBox = function (winner) {
  return winner ? 'winner' : ''
}

function save () {
  window.localStorage.setItem('players', JSON.stringify(players))
}

function getColor (colorId) {
  return colors.filter(function (color) {
    return color.id === colorId
  })[0]
}

function getActivePlayer () {
  return players.filter(function (player, i) {
    player.index = i
    return player.active
  })[0]
}

function getWinner () {
  var ranking = players.slice()
  ranking.sort(function (a, b) {
    if (a.totalPoints < b.totalPoints) { return -1 }
    if (a.totalPoints > b.totalPoints) { return 1 }
    return 0
  })
  ranking.reverse()

  players = players.map(function (player) {
    player.winner = false
    return player
  })

  if (ranking[0].totalPoints > 0) {
    players[ranking[0].index].winner = true
  }
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
  document.getElementById('arrow-active-player').className = 'arrow-up arrow-' + index
}

function setTotal (player) {
  var totalPoints = 0
  for (var colorId in player.qty) {
    var qty = (player.qty[colorId] >= 0) ? player.qty[colorId] : 0
    var points = getColor(colorId).points
    document.getElementById('player-qty-' + colorId).innerHTML = qty
    totalPoints += (qty * points)
  }
  document.getElementById('player-total-points').innerHTML = totalPoints + ' pontos'
  player.totalPoints = totalPoints
  save()
}

function setName (player) {
  document.getElementById('player-name').innerHTML = player.name
  if (player.winner) {
    document.getElementById('player-name').innerHTML += ' - <span class="text-yellow"><i class="icon ion-record"></i> Ganhando </span>'
  }
}

function loadPlayer (index) {
  var player = players[index]

  setTimeout(function () {
    setActive(index)
    setTotal(player)
  }, 100)

  setName(player)
}

function removeItem (colorId) { // eslint-disable-line
  var player = getActivePlayer()
  player.qty[colorId]--
  setTotal(player)
  getWinner()
  setName(player)
}

function addItem (colorId) { // eslint-disable-line
  var player = getActivePlayer()
  player.qty[colorId]++
  setTotal(player)
  getWinner()
  setName(player)
}

function savePlayer (nameElement) {
  MobileUI.show('player-content')
  MobileUI.hide('no-player-content')

  if (playerIndexEditing !== null) {
    players[playerIndexEditing].name = nameElement.value
    loadPlayer(playerIndexEditing)
  } else {
    players.push({
      name: nameElement.value,
      qty: {
        yellow: 0,
        green: 0,
        blue: 0,
        red: 0,
        black: 0
      },
      active: true
    })
    loadPlayer(players.length - 1)
    if (players.length === 6) {
      MobileUI.hide('button-add-player')
    }
  }

  nameElement.value = ''
  playerIndexEditing = null
}

function alertPlayer () {
  alert({
    title: 'Jogador',
    id: 'alert-player-id',
    message: ' ',
    template: 'alert-player',
    buttons: [
      {
        label: 'Salvar',
        class: 'text-green',
        onclick: function () {
          var nameElement = document.querySelector('.alert-mobileui #player-form-name')
          if (!nameElement.value) {
            alert({
              title: 'Oops',
              message: 'Você precisa dar um nome ao jogador.',
              class: 'red',
              buttons: [
                {
                  label: 'OK',
                  class: 'text-white',
                  onclick: function () {
                    closeAlert()
                  }
                }
              ]
            })
          } else {
            savePlayer(nameElement)
            closeAlert()
          }
        }
      },
      {
        label: 'Cancelar',
        class: 'text-gray-600',
        onclick: function () {
          closeAlert()
        }
      }
    ]
  })
  document.querySelector('.alert-mobileui #player-form-name').focus()
}

function addPlayer () { // eslint-disable-line
  MobileUI.hide('button-delete-player')
  alertPlayer()
  playerIndexEditing = null
  closeMenu('menu')
}

function editPlayer () { // eslint-disable-line
  MobileUI.show('button-delete-player')
  var player = getActivePlayer()
  alertPlayer()
  var nameElement = document.querySelector('.alert-mobileui #player-form-name')
  nameElement.value = player.name
  playerIndexEditing = player.index
}

function removePlayer () { // eslint-disable-line
  alert({
    title: 'Atenção',
    message: 'Você tem certeza que quer remover este jogador?',
    class: 'red',
    buttons: [
      {
        label: 'Sim',
        class: 'text-white',
        onclick: function () {
          var player = getActivePlayer()
          players.splice(player.index, 1)
          if (players.length < 6) {
            MobileUI.show('button-add-player')
          }
          if (players.length === 0) {
            MobileUI.hide('player-content')
            MobileUI.show('no-player-content')
          } else {
            loadPlayer(0)
          }
          closeAlert('alert-player-id')
          closeAlert()
        }
      },
      {
        label: 'Não',
        class: 'text-white',
        onclick: function () {
          closeAlert()
        }
      }
    ]
  })
}

function restartPoints () { // eslint-disable-line
  players = players.map(function (player) {
    player.qty = {
      yellow: 0,
      green: 0,
      blue: 0,
      red: 0,
      black: 0
    }
    player.winner = false
    return player
  })
  loadPlayer(0)
  closeMenu('menu')
}

function removeAllPlayers () { // eslint-disable-line
  players = []
  window.localStorage.removeItem('players')
  MobileUI.hide('player-content')
  MobileUI.show('no-player-content')
  closeMenu('menu')
}

window.onload = function () {
  var length = players.length
  if (length > 0) {
    loadPlayer(0)
    if (length === 6) {
      MobileUI.hide('button-add-player')
    }
    players.forEach(function (player) {
      setTotal(player)
    })
    getWinner()
  } else {
    MobileUI.hide('player-content')
    MobileUI.show('no-player-content')
  }
}
