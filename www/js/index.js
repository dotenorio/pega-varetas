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
  var user = ''

  if (name[0]) {
    user += name[0].toUpperCase()
  }

  if (name[1]) {
    user += name[1].toLowerCase()
  }

  return user
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

function noPlayerContent () {
  MobileUI.hide('player-content')
  MobileUI.hide('first-players-content')
  MobileUI.show('no-player-content')
}

function firstPlayers () { // eslint-disable-line
  MobileUI.hide('player-content')
  MobileUI.show('first-players-content')
  MobileUI.hide('no-player-content')
}

function playerContent () {
  MobileUI.show('player-content')
  MobileUI.hide('first-players-content')
  MobileUI.hide('no-player-content')
}

function savePlayer (nameElement) {
  playerContent()

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
  closeMenu('menu')
  if (players.length === 6) {
    alert({
      title: 'Atenção',
      message: 'Já temos 6 jogadores!',
      class: 'indigo',
      buttons: [
        {
          label: 'Ok',
          class: 'text-white',
          onclick: function () {
            closeAlert()
          }
        }
      ]
    })
  } else {
    MobileUI.hide('button-delete-player')
    alertPlayer()
    playerIndexEditing = null
  }
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
          if (players.length === 0) {
            noPlayerContent()
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
  alert({
    title: 'Atenção',
    message: 'Você tem certeza que quer reiniciar a pontuação?',
    class: 'red',
    buttons: [
      {
        label: 'Sim',
        class: 'text-white',
        onclick: function () {
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
  closeMenu('menu')
}

function removeAllPlayers () { // eslint-disable-line
  alert({
    title: 'Atenção',
    message: 'Você tem certeza que quer excluir todos os jogadores?',
    class: 'red',
    buttons: [
      {
        label: 'Sim',
        class: 'text-white',
        onclick: function () {
          players = []
          window.localStorage.removeItem('players')
          noPlayerContent()
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
  closeMenu('menu')
}

function addPlayerInput () { // eslint-disable-line
  var inputPlayersCount = document.querySelectorAll('#input-players input').length

  if (inputPlayersCount === 6) return
  if (inputPlayersCount === 5) {
    MobileUI.hide('add-player-input')
  }

  var inputPlayers = document.getElementById('input-players')
  var div = document.createElement('div')
  var button = document.createElement('button')
  var input = document.createElement('input')

  button.className = 'text-red icon ion-trash-b'
  button.onclick = function () {
    removePlayerInput(this)
  }

  input.type = 'text'
  input.placeholder = 'Jogador ' + (inputPlayersCount + 1)

  div.appendChild(button)
  div.appendChild(input)
  inputPlayers.appendChild(div)
}

function removePlayerInput (el) {
  var parent = el.parentElement
  parent.parentNode.removeChild(parent)

  var inputPlayers = document.querySelectorAll('#input-players input')

  inputPlayers.forEach(function (input, i) {
    input.placeholder = 'Jogador ' + (i + 1)
  })

  if (inputPlayers.length < 6) {
    MobileUI.show('add-player-input')
  }
}

window.onload = function () {
  var length = players.length
  if (length > 0) {
    loadPlayer(0)
    players.forEach(function (player) {
      setTotal(player)
    })
    getWinner()
  } else {
    noPlayerContent()
  }
}
