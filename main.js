// =========================================
// Imports and Initial Setup
// =========================================
import * as THREE from 'three'
import './style.css'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import vertexShader from './shaders/vertex.glsl?raw'
import fragmentShader from './shaders/fragment.glsl?raw'
import atmosphereVertex from './shaders/atmosphereVertex.glsl?raw'
import atmosphereFragment from './shaders/atmosphereFragment.glsl?raw'

// =========================================
// Global Configuration
// =========================================
const MaterialStates = {
  default: {
    color: '#4A90E2',
    opacity: 0.8,
    scale: 1
  },
  hover: {
    color: '#FFFFFF',
    opacity: 1,
    scale: 1.5
  },
  active: {
    color: '#FFD700',
    opacity: 1,
    scale: 1.8
  }
}

const topicColors = {
  'Strategy': '#FF6B6B',
  'Operations': '#4ECDC4', 
  'Technology': '#45B7D1',
  'Marketing': '#96CEB4',
  'Finance': '#FFEAA7'
}

// BCG Case Studies Data
const caseStudies = [
  {
    lat: 40.7128,   // New York
    lng: -74.0060,
    title: "Digital Transformation at Major Bank",
    location: "New York, USA",
    topic: "Technology",
    summary: "A leading financial institution transformed its digital capabilities to compete with fintech startups and improve customer experience.",
    details: "This comprehensive digital transformation involved modernizing legacy systems, implementing cloud infrastructure, and developing new customer-facing applications. The project resulted in 40% faster transaction processing, improved customer satisfaction scores, and positioned the bank as a leader in digital banking innovation."
  },
  {
    lat: 51.5074,   // London
    lng: -0.1278,
    title: "Post-Merger Integration Strategy",
    location: "London, UK", 
    topic: "Strategy",
    summary: "Successfully integrated two pharmaceutical companies following a $12B acquisition, creating synergies and maintaining competitive advantage.",
    details: "The integration program focused on combining R&D capabilities, optimizing manufacturing footprint, and retaining key talent. Synergies exceeded targets by 15% while maintaining product development timelines. The merged entity became a top-3 player in key therapeutic areas."
  },
  {
    lat: 35.6762,   // Tokyo
    lng: 139.6503,
    title: "Supply Chain Optimization",
    location: "Tokyo, Japan",
    topic: "Operations", 
    summary: "Redesigned global supply chain for automotive manufacturer to improve efficiency and reduce costs by $200M annually.",
    details: "Implemented lean manufacturing principles, reduced inventory by 30%, and improved delivery times by 25%. The new supply chain design increased resilience against disruptions and established best-in-class operational metrics across all manufacturing sites."
  },
  {
    lat: -33.8688,  // Sydney
    lng: 151.2093,
    title: "Market Entry Strategy",
    location: "Sydney, Australia",
    topic: "Marketing",
    summary: "Developed comprehensive go-to-market strategy for technology company entering APAC region.",
    details: "Market analysis identified key customer segments and optimal pricing strategy. The launch exceeded revenue targets by 35% in the first year, established strong brand presence, and created foundation for expansion into additional APAC markets."
  },
  {
    lat: 52.5200,   // Berlin
    lng: 13.4050,
    title: "Cost Reduction Program",
    location: "Berlin, Germany",
    topic: "Finance",
    summary: "Implemented organization-wide cost optimization for manufacturing company, achieving $150M in savings.",
    details: "Identified cost savings through process improvements, vendor renegotiation, and organizational restructuring. Maintained service levels while improving profit margins by 8%. Program became template for similar initiatives across industry."
  },
  {
    lat: 19.4326,   // Mexico City
    lng: -99.1332,
    title: "Emerging Market Expansion",
    location: "Mexico City, Mexico",
    topic: "Strategy",
    summary: "Guided retail chain's expansion into Latin American markets with localized business model.",
    details: "Developed business model adapted to regional preferences and economic conditions. Successfully opened 50 stores across 5 countries within 18 months, achieving break-even 6 months ahead of schedule."
  }
]

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp)

function initializeApp() {
  const canvas = document.querySelector('.webgl')
  if (!canvas) {
    console.error('Required canvas element is missing')
    return
  }

  const loadingIndicator = document.getElementById('loading-indicator')
  const caseBackdrop = document.getElementById('caseBackdrop')
  const casePopupElement = document.getElementById('casePopupElement')
  const caseTitle = document.querySelector('#caseTitle')
  const caseLocation = document.querySelector('#caseLocation')
  const caseTopic = document.querySelector('#caseTopic')
  const caseSummary = document.querySelector('#caseSummary')
  const caseDetails = document.querySelector('#caseDetails')
  const closeBtn = document.getElementById('closeBtn')

  function updateCaseDisplay() {
    const textbox = document.querySelector('.textbox .innertext');
    if (!caseBackdrop || caseBackdrop.style.display === "none") {
      textbox.textContent = "Select a case study";
    }
  }

  const LoadingManager = {
    loadingIndicator,
    showLoading() {
      if (this.loadingIndicator) this.loadingIndicator.classList.remove('loading-hidden')
    },
    hideLoading() {
      if (this.loadingIndicator) this.loadingIndicator.classList.add('loading-hidden')
    }
  }

  // Three.js Scene Setup
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 2000)
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50),
    new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { globeTexture: { value: new THREE.TextureLoader().load('/img/globe.jpeg') } }
    })
  )
  sphere.rotation.y = -Math.PI / 2

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(6, 50, 50),
    new THREE.ShaderMaterial({
      vertexShader: atmosphereVertex,
      fragmentShader: atmosphereFragment,
      uniforms: {
        color1: { value: new THREE.Color('#3388ff') },
        color2: { value: new THREE.Color('#ff3388') },
        mixRatio: { value: 0.0 }
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    })
  )
  atmosphere.scale.set(1.1, 1.1, 1.1)
  scene.add(atmosphere)

  const group = new THREE.Group()
  group.add(sphere)
  scene.add(group)

  // Star Field
  function createStarField() {
    const starGeometry = new THREE.BufferGeometry()
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff })
    const starVertices = []
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000
      const y = (Math.random() - 0.5) * 2000
      const z = -Math.random() * 3000
      starVertices.push(x, y, z)
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3))
    return new THREE.Points(starGeometry, starMaterial)
  }
  scene.add(createStarField())

  function createSecondStarField() {
    const starGeometry = new THREE.BufferGeometry()
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff })
    const starVertices = []
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * -2000
      const y = (Math.random() - 0.5) * -2000
      const z = -Math.random() * -3000
      starVertices.push(x, y, z)
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3))
    return new THREE.Points(starGeometry, starMaterial)
  }
  scene.add(createSecondStarField())

  camera.position.z = 15

  // Case Study Points
  function createPoint({ lat, lng, title, location, topic, summary, details }) {
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.4, 1.0),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(topicColors[topic] || MaterialStates.default.color),
        opacity: MaterialStates.default.opacity,
        transparent: true
      })
    )
    const latitude = (lat / 180) * Math.PI
    const longitude = (lng / 180) * Math.PI
    const radius = 5
    const x = radius * Math.cos(latitude) * Math.sin(longitude)
    const y = radius * Math.sin(latitude)
    const z = radius * Math.cos(latitude) * Math.cos(longitude)
    box.position.set(x, y, z)
    box.lookAt(0, 0, 0)
    box.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -0.4))
    gsap.to(box.scale, { z: 1.4, duration: 2, yoyo: true, repeat: -1, ease: 'linear', delay: Math.random() })
    box.caseData = { title, location, topic, summary, details }
    group.add(box)
    return box
  }
  caseStudies.forEach(createPoint)

  // Interaction Setup
  const mouse = { x: undefined, y: undefined, down: false, xPrev: undefined, yPrev: undefined }

  function enhanceLocationMarker(mesh, isHovered, isSelected) {
    const targetState = isSelected ? MaterialStates.active : isHovered ? MaterialStates.hover : MaterialStates.default
    gsap.to(mesh.material, { opacity: targetState.opacity, duration: 0.3 })
    if (isHovered || isSelected) mesh.material.color.set(targetState.color)
    else mesh.material.color.set(topicColors[mesh.caseData.topic] || MaterialStates.default.color)
    gsap.to(mesh.scale, { x: targetState.scale, y: targetState.scale, z: targetState.scale, duration: 0.3 })
  }

  function showCaseStudy(caseData) {
    LoadingManager.hideLoading()
    caseTitle.textContent = `Case: ${caseData.title}`
    caseLocation.textContent = `Location: ${caseData.location}`
    caseTopic.textContent = caseData.topic
    caseTopic.className = `case-topic-badge ${caseData.topic.toLowerCase()}`
    caseSummary.textContent = caseData.summary
    caseDetails.textContent = caseData.details
    document.querySelector('.textbox .innertext').textContent = ""
    caseBackdrop.style.display = "flex"
  }

  function hideCaseStudy() {
    selectedMarker = null
    updateCaseDisplay()
    caseBackdrop.style.display = "none"
    group.children.forEach((mesh) => {
      if (mesh.geometry.type === 'BoxGeometry') enhanceLocationMarker(mesh, false, false)
    })
  }

  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.enablePan = false
  controls.enableZoom = false
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.75
  controls.rotateSpeed = 0.5
  controls.minPolarAngle = Math.PI * 0.2
  controls.maxPolarAngle = Math.PI * 0.8

  const raycaster = new THREE.Raycaster()
  let selectedMarker = null

  function animate() {
    requestAnimationFrame(animate)
    controls.update()
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(group.children.filter(mesh => mesh.geometry.type === 'BoxGeometry'))
    group.children.forEach((mesh) => {
      if (mesh.geometry.type === 'BoxGeometry') enhanceLocationMarker(mesh, false, mesh === selectedMarker)
    })
    if (intersects.length > 0) enhanceLocationMarker(intersects[0].object, true, intersects[0].object === selectedMarker)
    renderer.render(scene, camera)
  }

  function handleMarkerClick(event) {
    event.preventDefault()
    const x = event.clientX || (event.touches && event.touches[0].clientX)
    const y = event.clientY || (event.touches && event.touches[0].clientY)
    mouse.x = (x / window.innerWidth) * 2 - 1
    mouse.y = -(y / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(group.children.filter(mesh => mesh.geometry.type === 'BoxGeometry'))
    if (intersects.length > 0) {
      selectedMarker = intersects[0].object
      LoadingManager.showLoading()
      setTimeout(() => { showCaseStudy(selectedMarker.caseData) }, 300)
    }
  }

  canvas.addEventListener('click', handleMarkerClick, { passive: false })
  if (closeBtn) closeBtn.addEventListener('click', hideCaseStudy)
  if (caseBackdrop) caseBackdrop.addEventListener('click', (e) => { if (e.target === caseBackdrop) hideCaseStudy() })

  canvas.addEventListener('mousedown', ({ clientX, clientY }) => {
    mouse.down = true
    mouse.xPrev = clientX
    mouse.yPrev = clientY
  })

  addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    if (mouse.down) {
      event.preventDefault()
      const deltaX = event.clientX - mouse.xPrev
      const deltaY = event.clientY - mouse.yPrev
      group.rotation.offset = group.rotation.offset || { x: 0, y: 0 }
      group.rotation.offset.x += deltaY * 0.005
      group.rotation.offset.y += deltaX * 0.005
      gsap.to(group.rotation, { y: group.rotation.offset.y, x: group.rotation.offset.x, duration: 2 })
      mouse.xPrev = event.clientX
      mouse.yPrev = event.clientY
    }
  })

  addEventListener('mouseup', () => { mouse.down = false })

  addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  LoadingManager.hideLoading()
  animate()
  updateCaseDisplay()
}
