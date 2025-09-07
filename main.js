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
    color: '#4A90E2',  // Professional blue
    opacity: 0.8,
    scale: 1
  },
  hover: {
    color: '#FFFFFF',  // Pure white
    opacity: 1,
    scale: 1.5
  },
  active: {
    color: '#FFD700',  // Bright gold
    opacity: 1,
    scale: 1.8
  }
}

const topicColors = {
  'Technological Advancements': '#6366F1',
  'Climate Change': '#10B981', 
  'Economic Uncertainty': '#F59E0B',
  'Demographic Shifts': '#EC4899',
  'Global Health': '#EF4444',
  'Political Change': '#8B5CF6',
  'Resource Scarcity': '#84CC16'
}

// News headlines for each global trend
const headlines = {
  'Technological Advancements': [
    "Federal Reserve Tests AI-Powered Interest Rate Models",
    "Goldman Sachs Reports 40% Trading Efficiency Gain from Machine Learning",
    "NYSE Implements Quantum Computing for Real-Time Risk Assessment",
    "JPMorgan's AI Chatbot Handles 85% of Customer Inquiries",
    "Blockchain Infrastructure Bill Passes Senate Banking Committee",
    "Wall Street Firms Invest $12B in Generative AI This Quarter",
    "SEC Announces New Guidelines for AI Trading Algorithms"
  ],
  'Economic Uncertainty': [
    "UK Inflation Rate Reaches 8.2% Despite BoE Intervention",
    "Brexit Trade Deal Modifications Proposed by Parliament",
    "London Financial District Sees 15% Office Space Vacancy",
    "Sterling Volatility Hits 3-Year High Amid Political Uncertainty",
    "UK Manufacturing Orders Drop 12% in Q3 2025",
    "Energy Costs Force 200+ UK Businesses to Relocate Operations",
    "Chancellor Announces Emergency SME Support Package"
  ],
  'Demographic Shifts': [
    "Japan's Working Population Drops to Historic Low",
    "Tokyo Companies Raise Retirement Age to 70",
    "Robot Caregivers Deployed in 500+ Japanese Nursing Homes",
    "Government Expands Foreign Worker Visa Program",
    "Elder-Tech Startups Raise $2.3B in Venture Funding",
    "Japan's Silver Economy Surpasses $5 Trillion Market Value",
    "Intergenerational Workforce Programs Show 25% Productivity Gains"
  ],
  'Climate Change': [
    "Australia Commits Additional $50B to Renewable Energy Grid",
    "Bushfire Season Starts Two Months Early in NSW",
    "Major Mining Companies Announce Carbon Neutral Operations by 2028",
    "Sydney Implements Mandatory Water Restrictions Citywide",
    "Climate Adaptation Costs Rise to $15B Annually for Australian Business",
    "Great Barrier Reef Tourism Industry Pivots to Conservation Model",
    "Extreme Weather Insurance Claims Up 300% This Year"
  ],
  'Political Change': [
    "EU Announces €300B Strategic Autonomy Investment Plan",
    "Germany Accelerates Energy Independence Timeline to 2027",
    "New Sanctions Package Targets Critical Material Imports",
    "European Parliament Passes Digital Sovereignty Act",
    "NATO Defense Spending Reaches Record High",
    "German Companies Complete Supply Chain Reshoring Initiative",
    "EU-China Trade Relations Enter New Phase of Strategic Competition"
  ],
  'Resource Scarcity': [
    "Mexico City Water Crisis Forces Industrial Relocation",
    "Groundwater Depletion Accelerates Urban Subsidence",
    "Water Recycling Mandate Approved for All Major Industries",
    "Drought Conditions Persist for 8th Consecutive Month",
    "Mexico Launches $20B Water Infrastructure Modernization",
    "Companies Invest in Atmospheric Water Generation Technology",
    "Regional Water Wars Threaten Cross-Border Business Operations"
  ],
  'Global Health': [
    "Singapore Becomes Asia's Digital Health Capital with $4B Investment",
    "WHO Establishes Pandemic Preparedness Hub in Singapore",
    "Health Tech Unicorns Choose Singapore for Regional Headquarters",
    "Advanced Health Monitoring Systems Deployed Across ASEAN",
    "Singapore's Health Passport System Adopted by 12 Countries",
    "Biotech Manufacturing Capacity Increases 400% in Southeast Asia",
    "Telemedicine Regulations Harmonized Across ASEAN Markets"
  ]
}

// Global Business Trends Data
const caseStudies = [
  {
    lat: 40.7128,
    lng: -74.0060,
    title: "Digital Retail Reinvention",
    location: "New York, USA",
    topic: "Technological Advancements",
    summary: "BCG supported a major American retailer in transforming its omnichannel experience through advanced analytics and supply-chain digitization.",
    details: "Working with the client, BCG redesigned inventory systems using predictive demand forecasting and integrated digital fulfillment—boosting click-and-collect volumes by 40% and improving stock availability by 25%."
  },
  {
    lat: 51.5074,
    lng: -0.1278,
    title: "Brexit Readiness & Supply Resilience",
    location: "London, UK",
    topic: "Economic Uncertainty",
    summary: "BCG helped UK manufacturers and distributors prepare for Brexit-related disruption by redesigning supply networks and contingency planning.",
    details: "They implemented dual-sourcing strategies and streamlined border processes—allowing the client to cut border delays by 60% and maintain service levels amid volatile regulatory environments."
  },
  {
    lat: 35.6762,
    lng: 139.6503,
    title: "Aging Population & Healthcare Innovation",
    location: "Tokyo, Japan",
    topic: "Demographic Shifts",
    summary: "BCG advised Japanese healthcare providers on building age-friendly care models in a rapidly aging society.",
    details: "Strategies included deploying telehealth services for elderly patients, optimizing staffing across clinics, and introducing wellness programs—reducing hospital readmissions by 30%."
  },
  {
    lat: -33.8688,
    lng: 151.2093,
    title: "Climate Risk Adaptation Strategy",
    location: "Sydney, Australia",
    topic: "Climate Change",
    summary: "BCG developed a resilience roadmap for Australian coastal infrastructure threatened by rising sea levels and extreme weather.",
    details: "They assessed flooding vulnerabilities, prioritized upgrade investments, and helped structure financing—strengthening infrastructure defense and saving an estimated $200 million in potential damage costs."
  },
  {
    lat: 52.5200,
    lng: 13.4050,
    title: "Energy Transition Business Model",
    location: "Berlin, Germany",
    topic: "Political Change",
    summary: "As Germany shifts toward renewables, BCG advised a utilities firm on transitioning from fossil fuels to green energy delivery.",
    details: "They helped develop a multi-year transition plan including wind and solar investments, stakeholder engagement, and regulatory interface—enabling the client to meet energy policy targets by 2028."
  },
  {
    lat: 19.4326,
    lng: -99.1332,
    title: "Water-Efficient Operations in Mexico City",
    location: "Mexico City, Mexico",
    topic: "Resource Scarcity",
    summary: "With limited water availability, BCG worked with manufacturers to implement water-efficient processes and recycling systems.",
    details: "Through water audits, process redesign, and recycling installations, clients reduced freshwater use by 40% and water costs by 35%—alleviating pressure on scarce municipal supplies."
  },
  {
    lat: 1.3521,
    lng: 103.8198,
    title: "Strengthening Public Health Preparedness",
    location: "Singapore",
    topic: "Global Health",
    summary: "In response to heightened pandemic risk, BCG collaborated with government agencies to enhance disease surveillance and rapid response capabilities.",
    details: "They streamlined data sharing across hospitals, optimized resource allocation, and trained rapid-response teams—shortening outbreak response timeframes by 50% and improving resilience."
  }
];

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp)

function initializeApp() {
  // =========================================
  // DOM Elements Setup
  // =========================================
  const canvas = document.querySelector('.webgl')
  if (!canvas) {
    console.error('Required canvas element is missing')
    return
  }

  const loadingIndicator = document.getElementById('loading-indicator')
  const casePopupElement = document.getElementById('casePopupElement')
  const caseBackdrop = document.getElementById('caseBackdrop') // may or may not exist in user's HTML
  const newsBox = document.getElementById('newsBox')
  const newsContent = document.getElementById('newsContent')
  const newsCloseBtn = document.getElementById('newsCloseBtn')
  const caseTitle = document.querySelector('#caseTitle')
  const caseLocation = document.querySelector('#caseLocation')
  const caseTopic = document.querySelector('#caseTopic')
  const caseSummary = document.querySelector('#caseSummary')
  const caseDetails = document.querySelector('#caseDetails')
  const closeBtn = document.getElementById('closeBtn')

  // helper to safely set style
  const safeSetDisplay = (el, value) => { if (el) el.style.display = value }

  function updateCaseDisplay() {
    const textbox = document.querySelector('.textbox .innertext');
    if (!casePopupElement || (casePopupElement && (casePopupElement.style.display === "none" || casePopupElement.offsetParent === null))) {
      textbox.textContent = "Select a global trend";
      if (casePopupElement) safeSetDisplay(casePopupElement, 'none')
      if (caseBackdrop) safeSetDisplay(caseBackdrop, 'none')
    }
  }

  // =========================================
  // Headlines (news box) functions
  // =========================================
  function showNewsHeadlines(topic) {
    const topicHeadlines = headlines[topic] || []
    if (!newsContent || !newsBox) return

    // clear old
    newsContent.innerHTML = ''

    if (topicHeadlines.length === 0) {
      const none = document.createElement('div')
      none.className = 'news-headline empty'
      none.textContent = 'No headlines found for this topic.'
      newsContent.appendChild(none)
    } else {
      topicHeadlines.forEach(h => {
        const headlineElement = document.createElement('div')
        headlineElement.className = 'news-headline'
        headlineElement.textContent = h
        newsContent.appendChild(headlineElement)
      })
    }

    safeSetDisplay(newsBox, 'block')
  }

  function hideNewsHeadlines() {
    if (newsBox) safeSetDisplay(newsBox, 'none')
  }

  // =========================================
  // Loading Manager
  // =========================================
  const LoadingManager = {
    loadingIndicator,

    showLoading() {
      if (this.loadingIndicator) {
        this.loadingIndicator.classList.remove('loading-hidden')
      }
    },

    hideLoading() {
      if (this.loadingIndicator) {
        this.loadingIndicator.classList.add('loading-hidden')
      }
    }
  }

  // =========================================
  // Three.js Scene Setup
  // =========================================
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  )

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  // =========================================
  // Globe Creation
  // =========================================
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50),
    new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        globeTexture: {
          value: new THREE.TextureLoader().load('/img/globe.jpeg')
        }
      }
    })
  );

  // Initial sphere rotation
  sphere.rotation.y = -Math.PI / 2

  // Atmosphere effect
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

  // =========================================
  // Star Field Creation
  // =========================================
  function createStarField() {
    const starGeometry = new THREE.BufferGeometry()
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff
    })

    const starVertices = []
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000
      const y = (Math.random() - 0.5) * 2000
      const z = -Math.random() * 3000
      starVertices.push(x, y, z)
    }

    starGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starVertices, 3)
    )

    return new THREE.Points(starGeometry, starMaterial)
  }

  scene.add(createStarField())

  function createSecondStarField() {
    const starGeometry = new THREE.BufferGeometry()
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff
    })

    const starVertices = []
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * -2000
      const y = (Math.random() - 0.5) * -2000
      const z = -Math.random() * -3000
      starVertices.push(x, y, z)
    }

    starGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starVertices, 3)
    )

    return new THREE.Points(starGeometry, starMaterial)
  }

  scene.add(createSecondStarField())

  camera.position.z = 15

  // =========================================
  // Case Study Points Creation
  // =========================================
  function createPoint({ lat, lng, title, location, topic, summary, details }) {
    // Create the main box
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.4, 1.0),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(topicColors[topic] || MaterialStates.default.color),
        opacity: MaterialStates.default.opacity,
        transparent: true
      })
    )

    // Position calculation
    const latitude = (lat / 180) * Math.PI
    const longitude = (lng / 180) * Math.PI
    const radius = 5

    const x = radius * Math.cos(latitude) * Math.sin(longitude)
    const y = radius * Math.sin(latitude)
    const z = radius * Math.cos(latitude) * Math.cos(longitude)

    box.position.set(x, y, z)

    box.lookAt(0, 0, 0)
    box.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -0.4))

    // Pulsing animation
    gsap.to(box.scale, {
      z: 1.4,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: 'linear',
      delay: Math.random()
    })

    box.caseData = { title, location, topic, summary, details }

    group.add(box)
    return box
  }

  caseStudies.forEach(createPoint)

  // =========================================
  // Interaction Setup
  // =========================================
  const mouse = {
    x: undefined,
    y: undefined,
    down: false,
    xPrev: undefined,
    yPrev: undefined
  }

  function enhanceLocationMarker(mesh, isHovered, isSelected) {
    const targetState = isSelected ? MaterialStates.active :
      isHovered ? MaterialStates.hover :
        MaterialStates.default

    gsap.to(mesh.material, {
      opacity: targetState.opacity,
      duration: 0.3
    })

    // Keep original topic color unless it's hovered/selected
    if (isHovered || isSelected) {
      mesh.material.color.set(targetState.color)
    } else {
      mesh.material.color.set(topicColors[mesh.caseData.topic] || MaterialStates.default.color)
    }

    gsap.to(mesh.scale, {
      x: targetState.scale,
      y: targetState.scale,
      z: targetState.scale,
      duration: 0.3
    })
  }

  // Show case study information
  function showCaseStudy(caseData) {
    LoadingManager.hideLoading()

    // Update display elements
    if (caseTitle) caseTitle.textContent = `Trend: ${caseData.title}`
    if (caseLocation) caseLocation.textContent = `Location: ${caseData.location}`
    if (caseTopic) {
      caseTopic.textContent = caseData.topic
      // Convert topic name to CSS class (handle spaces and special characters)
      const topicClass = caseData.topic.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      caseTopic.className = `case-topic-badge ${topicClass}`
    }
    if (caseSummary) caseSummary.textContent = caseData.summary
    if (caseDetails) caseDetails.textContent = caseData.details

    // Hide the "Select a global trend" text and show case popup
    const tb = document.querySelector('.textbox .innertext')
    if (tb) tb.textContent = ""

    // Prefer backdrop if available
    if (caseBackdrop) {
      safeSetDisplay(caseBackdrop, 'flex')
      // ensure popup is visible too
      if (casePopupElement) safeSetDisplay(casePopupElement, 'block')
    } else if (casePopupElement) {
      safeSetDisplay(casePopupElement, 'block')
    }

    // Show relevant news headlines
    showNewsHeadlines(caseData.topic)
  }

  // Hide case study and return to default state
  function hideCaseStudy() {
    selectedMarker = null
    updateCaseDisplay()

    // Hide both popup and news box
    if (caseBackdrop) safeSetDisplay(caseBackdrop, 'none')
    if (casePopupElement && !caseBackdrop) safeSetDisplay(casePopupElement, 'none')
    hideNewsHeadlines()

    // Reset all markers to default state
    group.children.forEach((mesh) => {
      if (mesh.geometry.type === 'BoxGeometry') {
        enhanceLocationMarker(mesh, false, false)
      }
    })
  }

  // Controls setup
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.75;
  controls.rotateSpeed = 0.5;
  controls.minPolarAngle = Math.PI * 0.2;
  controls.maxPolarAngle = Math.PI * 0.8;

  const raycaster = new THREE.Raycaster()
  let selectedMarker = null

  // =========================================
  // Animation Loop
  // =========================================
  function animate() {
    requestAnimationFrame(animate);

    controls.update();

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(
      group.children.filter(mesh => mesh.geometry.type === 'BoxGeometry')
    );

    // Reset all markers
    group.children.forEach((mesh) => {
      if (mesh.geometry.type === 'BoxGeometry') {
        const isSelected = mesh === selectedMarker;
        enhanceLocationMarker(mesh, false, isSelected);
      }
    });

    // Handle intersected marker
    if (intersects.length > 0) {
      const marker = intersects[0].object;
      const isSelected = marker === selectedMarker;
      enhanceLocationMarker(marker, true, isSelected);
    }

    renderer.render(scene, camera);
  }

  // =========================================
  // Event Listeners
  // =========================================
  function handleMarkerClick(event) {
    // prevent other handlers from receiving the click if triggered on UI
    // (we rely on canvas receiving click for markers)
    event.preventDefault();

    const x = event.clientX || (event.touches && event.touches[0].clientX);
    const y = event.clientY || (event.touches && event.touches[0].clientY);

    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(
      group.children.filter(mesh => mesh.geometry.type === 'BoxGeometry')
    );

    if (intersects.length > 0) {
      const marker = intersects[0].object;
      selectedMarker = marker;

      LoadingManager.showLoading();

      // Show case study after a brief delay for loading effect
      setTimeout(() => {
        showCaseStudy(marker.caseData);
      }, 300);
    }
  }

  // Canvas click handler for markers
  canvas.addEventListener('click', handleMarkerClick, { passive: false });

  // Close button handlers
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      hideCaseStudy()
    });
    // stop clicks inside popup from bubbling to window listener
    if (casePopupElement) {
      casePopupElement.addEventListener('click', (e) => e.stopPropagation())
    }
  }

  // news close
  if (newsCloseBtn) {
    newsCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      hideNewsHeadlines()
    })
  }
  if (newsBox) {
    newsBox.addEventListener('click', (e) => e.stopPropagation())
  }

  // Backdrop click closes popup (preferred behavior)
  if (caseBackdrop) {
    caseBackdrop.addEventListener('click', (e) => {
      // if user clicked directly on the backdrop (not on popup), close
      if (e.target === caseBackdrop) hideCaseStudy()
    })
    // prevent popup clicks from bubbling
    if (casePopupElement) {
      casePopupElement.addEventListener('click', (e) => e.stopPropagation())
    }
  } else {
    // If no backdrop exists, use a global click listener that closes popup when clicking outside it
    window.addEventListener('click', (e) => {
      // if popup is visible and click target is outside popup and outside newsBox, hide
      const popupVisible = casePopupElement && casePopupElement.style.display && casePopupElement.style.display !== 'none' && casePopupElement.offsetParent !== null
      if (!popupVisible) return
      const target = e.target
      if (casePopupElement && !casePopupElement.contains(target) && newsBox && !newsBox.contains(target)) {
        hideCaseStudy()
      }
    })
  }

  // ESC key closes popup & news
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      hideCaseStudy()
    }
  })

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

      gsap.to(group.rotation, {
        y: group.rotation.offset.y,
        x: group.rotation.offset.x,
        duration: 2
      })
      mouse.xPrev = event.clientX
      mouse.yPrev = event.clientY
    }
  })

  addEventListener('mouseup', () => {
    mouse.down = false
  })

  // Handle window resize
  addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  // Start the application
  LoadingManager.hideLoading()
  animate()
  updateCaseDisplay()
}
