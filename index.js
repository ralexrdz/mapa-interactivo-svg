let panZoom
let modal
let currentId
let player
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
`

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
    obj.setAttribute('transform', `translate(${p.x},${p.y}) scale(10 10)`)
    obj.style.cursor = 'pointer'
    obj.innerHTML = pinTemplate
    obj.id = p.id
    obj.getElementsByTagName('circle')[1].style.fill=  p.fill
    obj.getElementsByTagName('path')[0].style.fill=  p.fill
    // obj.getElementsByTagName('circle')[3].classList.add('pin')
    obj.getElementsByTagName('circle')[3].addEventListener('mouseover', (e) => {
      console.log(e.target)
      e.target.style.fill = 'red'
      // e.target.setAttribute('stroke', 'black')
      // e.target.setAttribute('fill-opacity', '100%')
    })
    obj.getElementsByTagName('circle')[3].addEventListener('mouseleave', (e) => {
      console.log(e.target)
      e.target.style.fill = 'white'
      // e.target.setAttribute('stroke', 'white')
      // e.target.setAttribute('fill-opacity', '80%')
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
  info.innerHTML = `
    <div class="box">
      <div id="box-title">
        ${pins.find(p => p.id == pinId).foro}
      </div>
      <div id="box-links"> 
        <button onclick="showVideo('${pinId}')">
          CONCIERTO
        </button>
        <button>
          VISÍTALO
        </button>
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
  const video = pins.find(p => p.id == pinId).video
  modal = document.getElementById('modal')
  modal.classList.remove('hidden') 

  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: video,
    playerVars: {
      'playsinline': 1,
      'modestbranding': 1,
      'showinfo': 0,
      'fs': 0,
      'rel': 0
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
  }, 300)
}

const onPlayerStateChange = (event) => {
  if (event.data == 0) {
    closeModal() 
  }
}

const closeModal = () => {
  modal.classList.add('hidden')
  modal.innerHTML = '<div id="player"></div>'
  // document.getElementsByClassName('frame-container')[0].innerHTML = '<div id="player"></div>'
  if (player.stopVideo) {
    player.stopVideo()
  }
}
// function stopVideo() {
//   player.stopVideo();
// }

  