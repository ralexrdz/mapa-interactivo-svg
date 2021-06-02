let panZoom
let modal
let currentId
let player
var arm = document.getElementById("mapa-svg");
arm.addEventListener('load', function(){
  initializeNavigator()
  insertPins()
  loadIframeApi()
  window.addEventListener('resize', () => {
    panZoom.resize();
    panZoom.fit();
    panZoom.center();
  });
});

const loadIframeApi = () => {
  var tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

const initializeNavigator = () => {
  panZoom = svgPanZoom('#mapa-svg', {
    zoomEnabled: true,
    controlIconsEnabled: false,
    center: 1,
    fit: 0,
    contain: 1,
    eventsHandler: eventsHandler,
    minZoom: 0.5
  });

  document.getElementById('zoom-in').addEventListener('click', function(ev){
    ev.preventDefault()
    panZoom.zoomIn()
  });

  document.getElementById('zoom-out').addEventListener('click', function(ev){
    ev.preventDefault()
    panZoom.zoomOut()
  });

  document.getElementById('reset').addEventListener('click', function(ev){
    ev.preventDefault()
    panZoom.resetZoom()
  });
}

const insertPins = () => {
  const svg = document.getElementById('mapa-svg').contentDocument
  let g4 = svg.getElementById('g4')
  g4.style.cursor = 'grab'
  g4.addEventListener('click', () => {
    document.getElementById('info-box').classList.add('hidden')
  })
  g4.addEventListener('touchstart', (e) => {
    document.getElementById('info-box').classList.add('hidden')
  })
  g4.addEventListener('mousedown', () => {
    document.getElementById('info-box').classList.add('hidden')
    g4.style.cursor = 'grabbing'
  })
  g4.addEventListener('mouseup', () => {
    g4.style.cursor = 'grab'
  })
  pins.forEach((p,i) => {

    let obj = document.createElementNS('http://www.w3.org/2000/svg','g')
    obj.setAttribute('transform', `translate(${p.x},${p.y})`)
    obj.style.cursor = 'pointer'
    obj.innerHTML = p.svg
    obj.id = p.id
    obj.firstElementChild.setAttribute('fill', p.fill)
    obj.firstElementChild.setAttribute('stroke-width', '10')
    obj.firstElementChild.setAttribute('stroke', 'white')
    obj.firstElementChild.setAttribute('fill-opacity', '80%')
    // obj.firstElementChild.classList.add('pin')
    obj.firstElementChild.addEventListener('mouseover', (e) => {
      e.target.setAttribute('stroke', 'black')
      e.target.setAttribute('fill-opacity', '100%')
    })
    obj.firstElementChild.addEventListener('mouseleave', (e) => {
      e.target.setAttribute('stroke', 'white')
      e.target.setAttribute('fill-opacity', '80%')
    })
    obj.addEventListener('click', (e) => {
      let t = e.target.parentElement.getAttribute('transform')

      showInfoBox(e, e.target.parentElement.id)
    })
    obj.addEventListener('touchstart', (e) => {
      let t = e.target.parentElement.getAttribute('transform')

      showInfoBox(e, e.target.parentElement.id)
    })
    setTimeout(() => {
      g4.append(obj)
    }, (i+1)*500)
  })
}

const showInfoBox = (e, pinId) => {
  let info = document.getElementById('info-box')
  info.innerHTML = `<div class="box"><button onclick="showVideo('${pinId}')">ver video</button><button>ver info</button></div>`
  let pageX = e.pageX || e.changedTouches[0].pageX 
  let pageY = e.pageY || e.changedTouches[0].pageY 
  setTimeout(()=> {
    info.classList.remove('hidden')
    let x =  pageX-(info.clientWidth/2)
    let y = pageY-(info.clientHeight+50)
    info.style.top = `${y}px`
    info.style.left = `${x}px`
  }, 500)
}

const showVideo = (pinId) => {
  const video = pins.find(p => p.id == pinId).video
  modal = document.getElementById('modal')
  modal.classList.remove('hidden') 

  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: video,
    playerVars: {
      'playsinline': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

const onPlayerReady = (event) => {
  setTimeout(() => {
    player.playVideo();
  }, 500)
}

const onPlayerStateChange = (event) => {
  if (event.data == 0) {
    closeModal() 
  }
}

const closeModal = () => {
  modal.classList.add('hidden')
  document.getElementsByClassName('frame-container')[0].innerHTML = '<div id="player"></div>'
  if (player.stopVideo) {
    player.stopVideo()
  }
}
// function stopVideo() {
//   player.stopVideo();
// }

  