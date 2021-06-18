let panZoom
let modal
let currentId
let player
let g4
var arm = document.getElementById("mapa-svg");
let pinTemplate = `
  <circle
    style="opacity:1;fill:none;fill-opacity:1;stroke:#000000;stroke-width:0.26458332;stroke-opacity:0.98770495"
    id="cfuera"
    cx="7.7296023"
    cy="11.269995"
    r="3.7545586" />
  <path
    style="fill:#0000ff;stroke:#000000;stroke-width:0.26458332px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
    d="m 4.083102,12.088154 c -0.060839,-0.243356 0.6828418,3.832564 3.7011229,6.886632 0,0 2.7780481,-3.217259 3.6188381,-6.885852 z"
    id="pico"
    inkscape:connector-curvature="0"
    sodipodi:nodetypes="cccc" />
  <circle
    style="display:inline;opacity:1;fill:#0000ff;fill-opacity:1;stroke:none;stroke-width:0.20770426;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.98770495"
    id="cdentro"
    cx="7.7029576"
    cy="11.226443"
    r="3.5907812" />
  <circle
    style="opacity:1;fill:#ff7300;fill-opacity:1;stroke:#000000;stroke-width:0.16500001;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.98770495"
    id="c2"
    cx="7.76752"
    cy="11.25738"
    r="2.8563013" />
  <circle
    style="opacity:1;fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.15077798;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.98770495"
    id="c3"
    cx="7.7629108"
    cy="11.257379"
    r="2.2120845" />
  <text
    x="6.5629108"
    y="12.157379"
    style="font-size: .2rem;"
  >TEXT</text>
`
const hidePins = false;
let playingRandom = false;
let showPins = []
let showLaterPins = []

const toggleNav = () => {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

const abreModalComoFunciona = () => {
  console.log('abreModalComoFunciona')
  // TODO
} 
const abreModalInfo = () => {
  console.log('abreModalComoFunciona')
  // TODO
} 

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
    fit: 1,
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

  // document.getElementById('reset').addEventListener('click', function(ev){
  //   ev.preventDefault()
  //   panZoom.resetZoom()
  // });
}

const insertPins = () => {
  const svg = document.getElementById('mapa-svg').contentDocument
  g4 = svg.getElementById('g4')
  g4.style.cursor = 'grab'
  g4.addEventListener('click', () => {
    document.getElementById('info-box').classList.add('hidden')
  })
  g4.addEventListener('touchstart', (e) => {
    e.preventDefault()
    document.getElementById('info-box').classList.add('hidden')
  }, {passive: true})
  g4.addEventListener('mousedown', () => {
    document.getElementById('info-box').classList.add('hidden')
    g4.style.cursor = 'grabbing'
  })
  g4.addEventListener('mouseup', () => {
    g4.style.cursor = 'grab'
  })
  setInterval(() => {
    showLaterPins.forEach((p,i) => {
      if( moment(p.date) < moment() ) {
        showPins.push(p)
        showLaterPins = showLaterPins.filter(sl => sl != p)
        addPinsToSvg(p, 0)
      }
    })
  }, 60000)
  pins.forEach((p,i) => {
    if( hidePins && moment(p.date) > moment() ) {
      showLaterPins.push(p)
    } else {
      showPins.push(p)
      addPinsToSvg(p, (i+1)*300 + 500)
    }
  })
}

const addPinsToSvg = (p, time) => {
  let obj = document.createElementNS('http://www.w3.org/2000/svg','g')
  // if (p.foro) {
  //   obj.setAttribute('transform', `translate(${p.x},${p.y}) scale(15 15)`)
  // } else {
  //   obj.setAttribute('transform', `translate(${p.x},${p.y}) scale(10 10)`)
  // }
  obj.setAttribute('transform', `translate(${p.x},${p.y}) scale(10 10)`)
  obj.style.cursor = 'pointer'
  obj.innerHTML = pinTemplate.replace('TEXT', p.number )
  obj.id = p.id
  obj.getElementsByTagName('circle')[1].style.fill=  p.fill
  obj.getElementsByTagName('path')[0].style.fill=  p.fill
  // obj.getElementsByTagName('circle')[3].classList.add('pin')
  obj.getElementsByTagName('circle')[3].addEventListener('mouseover', (e) => {
    e.target.style.fill = 'black'
  })
  obj.getElementsByTagName('circle')[3].addEventListener('mouseleave', (e) => {
    e.target.style.fill = 'white'
  })
  obj.addEventListener('click', (e) => {
    if (p.foro) {
      showInfoBox(e, e.target.parentElement.id)
    } else {
      showVideo(p.id)
    }
  })
  obj.addEventListener('touchstart', (e) => {
    e.preventDefault()
    if (p.foro) {
      showInfoBox(e, e.target.parentElement.id)
    } else {
      showVideo(p.id)
    }
  }, {passive: true})
  setTimeout(() => {
    g4.append(obj)
  }, 10)
  // }, time)
}

const showInfoBox = (e, pinId) => {
  let info = document.getElementById('info-box')
  info.innerHTML = `
    <div class="box">
      <div id="box-title">
        ${pins.find(p => p.id == pinId).foro}
      </div>
      <div id="box-links"> 
        <div><button onclick="showVideo('${pinId}')">
          CONCIERTO
        </button></div>
        <div><button>
          VISÍTALO
        </button></div>
      </div>
    </div>`
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
  if (currentId) document.getElementsByClassName('frame-container')[0].innerHTML = '<div id="player"></div>'
  currentId = pinId
  let pin = pins.find(p => p.id == pinId)
  const video = pin.video
  modal = document.getElementById('modal')
  modal.classList.remove('hidden')
  if (pin.foro) {
    modal.querySelector("#titulo1").innerHTML = pin.foro
    modal.querySelector("#titulo2").innerHTML = pin.artista
  } else {
    modal.querySelector("#titulo1").innerHTML = pin.artista
    modal.querySelector("#titulo2").innerHTML = pin.pieza
  }

  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: video,
    playerVars: {
      'playsinline': 1,
      'modestbranding': 1,
      'showinfo': 0,
      // 'fs': 0,
      'rel': 0,

    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

const playPrevVideo = () => {
  let currentIndex = showPins.indexOf(pins.find(p => p.id == currentId))
  let prevIndex = currentIndex > 0 ? currentIndex-1 : showPins.length-1
  let id = showPins[prevIndex].id
  showVideo(id)
}

const playNextVideo = () => {
  let currentIndex = showPins.indexOf(pins.find(p => p.id == currentId))
  let nextIndex = currentIndex == showPins.length-1 ? 0 : currentIndex+1  
  let id = showPins[nextIndex].id
  showVideo(id)
}

const playRandom = () => {
  playingRandom = true
  showVideo(showPins[Math.floor(Math.random() * showPins.length)].id)
}

const onPlayerReady = (event) => {
  setTimeout(() => {
    player.playVideo();
  }, 300)
}

const onPlayerStateChange = (event) => {
  if (event.data == 0) {
    if (playingRandom) {
      playNextVideo()
    } else {
      closeModal() 
    }
  }
}

const closeModal = () => {
  modal.classList.add('hidden')
  playingRandom = false
  document.getElementsByClassName('frame-container')[0].innerHTML = '<div id="player"></div>'
  if (player.stopVideo) {
    player.stopVideo()
  }
}


  