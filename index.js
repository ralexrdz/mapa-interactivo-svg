let panZoom
var arm = document.getElementById("demo-tiger");

arm.addEventListener('load', function(){


  panZoom = svgPanZoom('#demo-tiger', {
    zoomEnabled: true,
    controlIconsEnabled: false,
    center: 1,
    eventsHandler: eventsHandler
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
});
  