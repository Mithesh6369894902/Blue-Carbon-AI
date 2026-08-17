import os
import sys
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

PAGE_WIDTH, PAGE_HEIGHT = landscape(letter) # 792 x 612 pt

class DocumentCanvas(canvas.Canvas):
    """Custom Canvas for Header/Footer styling"""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.pages = []

    def showPage(self):
        self.pages.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self.pages)
        for page in self.pages:
            self.__dict__.update(page)
            self.draw_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_decorations(self, total_pages):
        page_num = self._pageNumber
        if page_num > 1:
            # Bottom footer bar
            self.setFillColor(colors.HexColor('#0284c7')) # Cyan/Blue
            self.rect(0, 0, PAGE_WIDTH, 26, fill=True, stroke=False)
            
            # Footer text
            self.setFillColor(colors.white)
            self.setFont("Helvetica-Bold", 8.5)
            self.drawString(30, 8, "BlueCarbon AI — Complete Application Feature & Tool Master Reference Manual")
            self.drawRightString(PAGE_WIDTH - 30, 8, f"Page {page_num} of {total_pages}")
            
            # Top-right header label
            self.setFillColor(colors.HexColor('#0f172a'))
            self.setFont("Helvetica-Bold", 8.5)
            self.drawRightString(PAGE_WIDTH - 30, PAGE_HEIGHT - 28, "BLUECARBON AI ALL TOOLS & FEATURES MANUAL")

def generate_pdf():
    pdf_path = r"c:\Users\MITHESH D\Downloads\Blue carbon SIH\BlueCarbon_AI_Platform_Complete_Documentation.pdf"
    
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=landscape(letter),
        leftMargin=30,
        rightMargin=30,
        topMargin=30,
        bottomMargin=30
    )

    styles = getSampleStyleSheet()

    # Color Palette
    PRIMARY = colors.HexColor('#0284c7')
    DARK_TEXT = colors.HexColor('#0f172a')
    EMERALD = colors.HexColor('#059669')
    PURPLE = colors.HexColor('#7c3aed')
    BG_CARD = colors.HexColor('#f8fafc')
    BORDER_COLOR = colors.HexColor('#cbd5e1')

    # Typography Styles
    cover_title_style = ParagraphStyle(
        'CoverTitle',
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=PRIMARY,
        alignment=1,
        spaceAfter=6
    )

    cover_subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        fontName='Helvetica-Bold',
        fontSize=13.5,
        leading=17,
        textColor=DARK_TEXT,
        alignment=1,
        spaceAfter=12
    )

    heading_style = ParagraphStyle(
        'SectionHeading',
        fontName='Helvetica-Bold',
        fontSize=14.5,
        leading=18,
        textColor=DARK_TEXT,
        spaceBefore=6,
        spaceAfter=6
    )

    subheading_style = ParagraphStyle(
        'SectionSubHeading',
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=PRIMARY,
        spaceBefore=4,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=DARK_TEXT,
        spaceAfter=4
    )

    body_bold = ParagraphStyle(
        'BodyBoldCustom',
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=12,
        textColor=DARK_TEXT
    )

    story = []

    # -------------------------------------------------------------
    # PAGE 1: TITLE & COMPREHENSIVE PLATFORM ARCHITECTURE
    # -------------------------------------------------------------
    story.append(Spacer(1, 8))
    story.append(Paragraph("BLUECARBON AI PLATFORM", cover_title_style))
    story.append(Paragraph("Master Technical Specification & Complete Feature-by-Feature Operational Manual", cover_subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY, spaceAfter=10))

    exec_text = (
        "<b>Platform Overview:</b> BlueCarbon AI is a full-stack, enterprise-grade Measurement, Reporting, and Verification (MRV) platform "
        "designed for coastal blue carbon ecosystems (mangroves, seagrasses, salt marshes) and adaptable to inland terrestrial forests. "
        "The system combines high-resolution GIS satellite multispectral imaging, IoT ocean buoy sensor streaming, AI explainable carbon & reversal risk prediction, "
        "and Web3 Polygon POS blockchain evidence ledgering. It provides tailored operational interfaces for Ministry of Earth Sciences (MoES) auditors, NGO project developers, "
        "and the general public."
    )
    story.append(Paragraph(exec_text, body_style))
    story.append(Spacer(1, 6))

    overview_data = [
        [Paragraph("<b>Component / Module</b>", body_bold), Paragraph("<b>Tech Stack & Libraries</b>", body_bold), Paragraph("<b>Operational Functionality</b>", body_bold)],
        [Paragraph("<b>Top Navigation Bar</b>", body_style), Paragraph("React + Lucide Icons + TailwindCSS", body_style), Paragraph("Role switching, site dropdown, live stream toggle, raw dataset exports & IST clock", body_style)],
        [Paragraph("<b>GIS Digital Twin Map</b>", body_style), Paragraph("Leaflet.js + Esri World Imagery + Carto Voyager", body_style), Paragraph("Real satellite map tiles, 4 spectral layer modes, pin popups & custom ROI drawing tool", body_style)],
        [Paragraph("<b>IoT Sensor Stream</b>", body_style), Paragraph("Digital Twin WebSocket/Timer + Recharts", body_style), Paragraph("6 sensor metric gauges, 30s live history LineChart & automated anomaly detection", body_style)],
        [Paragraph("<b>AI Carbon Engine</b>", body_style), Paragraph("IPCC Tier 3 Equations + SHAP Explainable AI", body_style), Paragraph("AGB/BGB/SOC pool breakdown BarChart, risk scoring (0-100%) & 2020-2026 forecast", body_style)],
        [Paragraph("<b>Stress Simulator</b>", body_style), Paragraph("Stochastic Hazard Engine + Smart Contract Triggers", body_style), Paragraph("Simulates Cyclone, Oil Spill, Deforestation & Heatwave hazards with carbon loss math", body_style)],
        [Paragraph("<b>Web3 Evidence Ledger</b>", body_style), Paragraph("CryptoJS SHA-256 + Canvas Confetti + Polygon POS", body_style), Paragraph("256-bit hashing, Merkle root proofs, searchable tx log & printable MRV certificate modal", body_style)],
        [Paragraph("<b>MoES Verifier Portal</b>", body_style), Paragraph("Temporal Change Differencing + Fraud Audit Check", body_style), Paragraph("2020 Baseline vs 2026 Present satellite differencing, double-counting audit & credit sign-off", body_style)],
        [Paragraph("<b>Backend REST Server</b>", body_style), Paragraph("Node.js + Express + CORS + FS Static Middleware", body_style), Paragraph("Serves REST APIs (/api/hotspots, /api/telemetry, /api/simulate-disaster) & production build", body_style)],
    ]

    t_overview = Table(overview_data, colWidths=[120, 240, 370])
    t_overview.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e0f2fe')),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
    ]))
    story.append(t_overview)
    story.append(PageBreak())

    # -------------------------------------------------------------
    # PAGE 2: COMPLETE FEATURE BREAKDOWN (MODULES 1 TO 3)
    # -------------------------------------------------------------
    story.append(Paragraph("1. Exhaustive Tool & Feature Operational Breakdown (Part 1)", heading_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceAfter=8))

    part1_features = [
        ("Header Navigation Toolbar (Navbar.jsx)", [
            ("Brand Title Logo", "Renders BlueCarbon AI brand icon with pulsing green status indicator."),
            ("Forest Hotspot Selector", "Dropdown allowing users to switch between 5 coastal blue carbon ecosystems. Dynamically updates all maps, charts, sensors, and audit logs."),
            ("Project NGO Role Button", "Activates DEVELOPER mode. Grants full access to custom polygon drawing, disaster stress testing, telemetry controls, and system parameters."),
            ("MoES Auditor Role Button", "Activates AUDITOR mode and automatically navigates to the MoES Verifier Workflow tab for government verification and credit minting."),
            ("Public Registry Role Button", "Activates PUBLIC transparency mode and navigates to the Web3 Evidence Ledger tab for open credit verification and public ledger inspection."),
            ("IoT Streaming Toggle Button", "Toggles live telemetry streaming updates on or off. Pausing freezes gauge readings for static analysis."),
            ("Raw Datasets Export Menu", "Provides direct download links for master GeoJSON dataset (JSON), IoT sensor logs (CSV), and IPCC biomass factors (CSV)."),
            ("System Clock Display", "Displays live Indian Standard Time (IST) clock updated every second."),
            ("6 Main Navigation Tabs", "Tabs for GIS Digital Twin, IoT Ocean Buoy Stream, AI Carbon Engine, Disaster Simulator, Web3 Ledger, and MoES Verifier Portal.")
        ]),
        ("GIS Digital Twin Map (DigitalTwinMap.jsx)", [
            ("Leaflet Map Renderer", "Loads Esri World Imagery satellite tiles and Carto labels centered on exact GPS coordinates of the selected forest site."),
            ("Hotspot Map Pins", "Custom animated map markers for all 5 hotspots; clicking any marker switches the active forest location."),
            ("Active Hotspot Info Card", "Displays site name, state, ecosystem type, area hectarage, NDVI, canopy height, and total carbon stock."),
            ("True Color Spectral Layer", "Renders standard satellite natural color view."),
            ("NDVI Spectral Layer", "Renders Normalized Difference Vegetation Index highlighting canopy vegetation health and leaf density."),
            ("NDWI Spectral Layer", "Renders Normalized Difference Water Index highlighting surface water and leaf moisture content."),
            ("LiDAR Height Mesh Layer", "Visualizes canopy height structure and 3D forest profile."),
            ("Draw Custom ROI Polygon Tool", "Simulates drawing a custom region of interest boundary and calculates custom area hectarage, estimated carbon stock, average NDVI, and reversal risk."),
            ("Disaster Warning Banner", "Displays animated emergency alert overlay across the map whenever a disaster event is active.")
        ]),
        ("IoT Ocean Telemetry Stream (TelemetryStream.jsx)", [
            ("Telemetry Stream Banner", "Displays buoy node ID, stream frequency (2.5s), and IPFS mesh connectivity status."),
            ("Salinity Gauge", "Displays real-time water salinity in parts per thousand (ppt) with baseline reference."),
            ("Soil Organic Carbon (SOC) Gauge", "Displays soil organic carbon percentage down to 1-meter sediment depth."),
            ("Water Temperature Gauge", "Monitors submerged water temperature probe readings in °C."),
            ("Sediment pH Gauge", "Monitors soil alkalinity/acidity balance."),
            ("Sea Level Anomaly Gauge", "Displays tidal gauge sea level anomaly in mm."),
            ("Dissolved Oxygen Gauge", "Displays dissolved marine oxygen concentration in mg/L."),
            ("Live Telemetry Stream LineChart", "Recharts graph rendering past 30-second live streaming history for salinity, temp, and SOC %."),
            ("Automated Anomaly Log Table", "Logs high temp (>31°C), hypersaline (>40 ppt), or SOC drop (<2.5%) alerts automatically."),
            ("Dynamic Site Reset", "Automatically resets gauge baselines and telemetry arrays when switching forest locations.")
        ]),
    ]

    for section_title, tools in part1_features:
        story.append(Paragraph(f"<b>{section_title}</b>", subheading_style))
        t_rows = [[Paragraph("<b>Tool / Feature Name</b>", body_bold), Paragraph("<b>Detailed Operational Explanation</b>", body_bold)]]
        for name, desc in tools:
            t_rows.append([Paragraph(name, body_style), Paragraph(desc, body_style)])
        
        t_feat = Table(t_rows, colWidths=[170, 550])
        t_feat.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f8fafc')),
            ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 3),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ]))
        story.append(t_feat)
        story.append(Spacer(1, 3))

    story.append(PageBreak())

    # -------------------------------------------------------------
    # PAGE 3: COMPLETE FEATURE BREAKDOWN (MODULES 4 TO 7)
    # -------------------------------------------------------------
    story.append(Paragraph("2. Exhaustive Tool & Feature Operational Breakdown (Part 2)", heading_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceAfter=8))

    part2_features = [
        ("AI Carbon Engine (CarbonAiEngine.jsx)", [
            ("Scientific Methodology Banner", "Displays IPCC Tier 3 methodology standard, total baseline stock (k tCO₂e), and annual sequestration rate (t/ha/yr)."),
            ("Carbon Pool Breakdown BarChart", "Horizontal BarChart rendering Above-Ground Biomass (AGB), Below-Ground Biomass (BGB), and Soil Organic Carbon (SOC)."),
            ("Quick Pool Metric Cards", "Cards showing exact t/ha values for AGB, BGB, and SOC pools."),
            ("Carbon Reversal Risk Progress Bar", "Visual progress bar displaying risk score (0-100%) and risk tier (LOW, MEDIUM, HIGH, CRITICAL)."),
            ("SHAP Explainable AI Attribution", "Breaks down feature drivers influencing reversal risk (coastal erosion, canopy trend, storm surge, salinity)."),
            ("Sequestration Forecast AreaChart", "Multi-year carbon stock trajectory graph from 2020 to 2026.")
        ]),
        ("Environmental Stress Simulator (DisasterSimulator.jsx)", [
            ("Category 4 Cyclone Card", "Simulates 185 km/h winds, defoliation, 15% carbon loss, and triggers EMERGENCY_FREEZE_CYCLONE_DAMAGE."),
            ("Coastal Oil Spill Card", "Simulates petroleum slick smothering roots, 8% carbon loss, and triggers ALERT_POLLUTION_SOIL_TOXICITY."),
            ("Illegal Deforestation Card", "Simulates aquaculture clearing, 22% carbon loss, and triggers CRITICAL_FRAUD_ILLEGAL_CLEARING."),
            ("Marine Heatwave Card", "Simulates sea temp >33.5°C, thermal bleaching, 5% carbon loss, and triggers WARNING_THERMAL_BLEACHING_RISK."),
            ("Reset Ecosystem Baseline Button", "Restores ecosystem health parameters and clears active disaster state."),
            ("Active Disaster Response Panel", "Displays digital twin reaction, AI risk score jump, and smart contract emission freeze status.")
        ]),
        ("Web3 Evidence Ledger (BlockchainLedger.jsx)", [
            ("Generate MRV Certificate Button", "Triggers canvas-confetti animation and opens printable certificate modal."),
            ("SHA-256 Payload Hash Card", "Displays 256-bit cryptographic hash, payload origin, and verification match status."),
            ("Merkle Root Proof Card", "Displays tree height 4 Merkle root proof hash derived from 4,096 telemetry blocks."),
            ("Blockchain Network Stats Card", "Displays Polygon POS block height #19,842,105, block time (2.1s), ERC-1155 standard & state tamper check."),
            ("Smart Contract Log Table", "Searchable table filtering block, timestamp, event, txHash, signer, and gas used."),
            ("Printable MRV Certificate Modal", "Displays project details, total verified carbon, SHA-256 hash, QR code, and Print/Save PDF action (window.print()).")
        ]),
        ("MoES Verifier Workflow (AuditorWorkflow.jsx)", [
            ("Temporal Satellite Differencing", "Side-by-side comparison of 2020 Baseline vs 2026 Present satellite imagery with active growth calculation and vegetation expansion %."),
            ("Automated AI Fraud Checks", "Validates double-counting prevention against Verra & Gold Standard, spectral match, and permanence threshold."),
            ("Official Assessment Notes Textarea", "Allows government auditors to enter field inspection comments, saved independently per forest location."),
            ("Approve & Mint Carbon Credits Button", "Triggers confetti, records digital sign-off, and marks claim APPROVED."),
            ("Reject Claim Button", "Marks claim REJECTED.")
        ]),
        ("Host Server & Backend REST APIs (server.js)", [
            ("GET /api/health", "Returns system online status, platform title, uptime, and port."),
            ("GET /api/hotspots", "Returns master GeoJSON dataset for all 5 blue carbon hotspots."),
            ("GET /api/telemetry", "Returns live ocean buoy sensor stream data."),
            ("POST /api/simulate-disaster", "Executes disaster hazard calculations and returns blockchain event codes."),
            ("POST /api/verify-mrv", "Hashes MRV payloads using SHA-256 and returns Merkle root proofs.")
        ]),
    ]

    for section_title, tools in part2_features:
        story.append(Paragraph(f"<b>{section_title}</b>", subheading_style))
        t_rows = [[Paragraph("<b>Tool / Feature Name</b>", body_bold), Paragraph("<b>Detailed Operational Explanation</b>", body_bold)]]
        for name, desc in tools:
            t_rows.append([Paragraph(name, body_style), Paragraph(desc, body_style)])
        
        t_feat = Table(t_rows, colWidths=[170, 550])
        t_feat.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f8fafc')),
            ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 3),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ]))
        story.append(t_feat)
        story.append(Spacer(1, 3))

    story.append(PageBreak())

    # -------------------------------------------------------------
    # PAGE 4: COMPLETE TECHNICAL & DOMAIN GLOSSARY OF TERMS
    # -------------------------------------------------------------
    story.append(Paragraph("3. Complete Technical & Scientific Glossary of Terms & Definitions", heading_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceAfter=8))

    glossary_terms = [
        ("Blue Carbon", "Carbon captured and stored by coastal and marine ecosystems, primarily mangroves, seagrass meadows, and tidal salt marshes."),
        ("MRV (Measurement, Reporting & Verification)", "A multi-step scientific and auditing framework used to measure carbon stocks, report findings, and verify credit claims before issuance."),
        ("GIS (Geographic Information System)", "A framework for gathering, managing, and analyzing spatial satellite and geographic data linked to exact Earth coordinates."),
        ("Digital Twin", "A dynamic virtual replica of a physical real-world ecosystem updated continuously using live IoT sensor streams and satellite data."),
        ("NDVI (Normalized Difference Vegetation Index)", "A multispectral satellite index (NIR - Red)/(NIR + Red) measuring green vegetation density, chlorophyll absorption, and canopy health."),
        ("NDWI (Normalized Difference Water Index)", "A satellite index (Green - NIR)/(Green + NIR) used to monitor surface water extent, leaf moisture content, and inundation."),
        ("LiDAR (Light Detection and Ranging)", "An optical remote sensing technology using pulsed laser light to measure exact 3D vegetation canopy height and vertical forest structure."),
        ("AGB (Above-Ground Biomass)", "All living plant matter located above the soil surface, including tree trunks, branches, bark, and foliage (measured in t/ha)."),
        ("BGB (Below-Ground Biomass)", "All living root biomass located beneath the soil surface that anchors trees and transfers carbon into sediments (measured in t/ha)."),
        ("SOC (Soil Organic Carbon)", "Carbon stored in organic matter within coastal muddy sediment layers down to 1-meter depth (representing 70-80% of total blue carbon)."),
        ("tCO₂e (Metric Tons of CO₂ Equivalent)", "The standard universal unit for measuring greenhouse gas emissions and carbon sequestration offset credits."),
        ("IPCC Tier-3 Methodology", "The highest accuracy level defined by the Intergovernmental Panel on Climate Change utilizing high-resolution spatial mapping and species-specific allometric models."),
        ("SHAP (SHapley Additive exPlanations)", "A game-theoretic Explainable AI (XAI) technique that quantifies the exact percentage contribution of individual climate drivers to risk predictions."),
        ("Reversal Risk", "The probability (0-100%) that stored carbon will be accidentally released back into the atmosphere due to natural disasters (cyclones, heatwaves) or human clearing."),
        ("SHA-256 Cryptographic Hash", "A 256-bit cryptographic hash algorithm that transforms data into an irreversible 64-character string, guaranteeing data tamper-proofing."),
        ("Merkle Root Proof", "A cryptographic hash tree where every leaf node represents a telemetry block, allowing large datasets to be verified with a single root hash on-chain."),
        ("Polygon POS Blockchain", "A high-speed, eco-friendly Layer-2 Ethereum-compatible blockchain network used for immutable audit logs and carbon credit smart contracts."),
        ("ERC-1155 Token Standard", "A multi-token blockchain standard supporting environmental carbon credits, fractional certification, and cryptographic minting."),
        ("Double-Counting Fraud", "The fraudulent practice where the exact same carbon credit offset is claimed or sold twice across different registries."),
        ("MoES (Ministry of Earth Sciences)", "The Indian government ministry governing oceanography, meteorology, atmospheric sciences, and coastal ecosystem monitoring."),
        ("ISRO (Indian Space Research Organisation)", "India's national space agency providing multispectral Earth observation satellite imagery (Sentinel-2 / EOS series)."),
        ("Salinity (ppt)", "Concentration of dissolved salts in water measured in parts per thousand (ppt), critical for mangrove root respiration and growth."),
        ("Dissolved Oxygen (mg/L)", "The volume of free oxygen dissolved in water essential for marine organisms and submerged seagrass photosynthesis.")
    ]

    t_glossary_rows = [[Paragraph("<b>Term / Concept</b>", body_bold), Paragraph("<b>Scientific & Technical Definition</b>", body_bold)]]
    for term, definition in glossary_terms:
        t_glossary_rows.append([Paragraph(f"<b>{term}</b>", body_style), Paragraph(definition, body_style)])

    t_glossary = Table(t_glossary_rows, colWidths=[180, 540])
    t_glossary.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e0f2fe')),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
    ]))
    story.append(t_glossary)

    doc.build(story, canvasmaker=DocumentCanvas)
    print(f"PDF successfully updated at: {pdf_path}")

if __name__ == "__main__":
    generate_pdf()
