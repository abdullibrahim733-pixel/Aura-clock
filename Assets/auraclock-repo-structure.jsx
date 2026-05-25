import { useState } from "react";

const repo = {
  name: "auraclock-s3",
  desc: "Mechatronic focus enforcement device · ESP32-WROOM-32E · Custom PCB · Arusha, TZ",
  tree: [
    {
      name: "README.md",
      type: "file",
      tag: "MANDATORY",
      tagColor: "#ef4444",
      desc: "Your project story, architecture, photos, BOM table, build instructions. First thing reviewers read.",
      required: true,
      content: `# AuraClock S3
> "Five more minutes." I said that at 9PM. It was midnight before I looked up.

![demo gif]
![front view photo]

## What it does
## How it's built  
## BOM
## Setup & flash instructions`
    },
    {
      name: "BOM.csv",
      type: "file",
      tag: "MANDATORY",
      tagColor: "#ef4444",
      desc: "Every component with quantity, local price, AliExpress reference price, and source.",
      required: true,
      content: `Item,Purpose,Qty,Local Price,AliExpress Ref,Source
ESP32-WROOM-32E,MCU,1,TZS 8000,$2.50,Local shop Arusha
SSD1306 OLED,Face display,1,TZS 12000,$1.80,Local shop Arusha
...`
    },
    {
      name: "journal.md",
      type: "file",
      tag: "MANDATORY",
      tagColor: "#ef4444",
      desc: "Daily build log. Written by you, no AI. Honest record of progress and failures.",
      required: true,
      content: `# Build Journal

## Day 1 — 22 May 2026
**Hours logged:** 8
**What I built:** Completed EasyEDA schematic...
**What broke:** The CH340C boot circuit...
**What I learned:** The DTR/RTS caps need to be...`
    },
    {
      name: "LICENSE",
      type: "file",
      tag: "RECOMMENDED",
      tagColor: "#f59e0b",
      desc: "MIT License. One line. Shows you intend this to be open source — Hack Club loves this.",
      required: false,
    },
    {
      name: "firmware/",
      type: "folder",
      tag: "MANDATORY",
      tagColor: "#ef4444",
      desc: "Full firmware with state machine logic. Not just a blink test — reviewers will read this.",
      required: true,
      children: [
        { name: "platformio.ini", type: "file", desc: "PlatformIO config: board, framework, lib_deps" },
        {
          name: "src/", type: "folder", children: [
            { name: "main.cpp", type: "file", desc: "State machine: FOCUS / BREACH / TAMPER + WebSocket handler" },
            { name: "display.cpp", type: "file", desc: "OLED face animations — calm face, breach face, tamper face" },
            { name: "servo_shutter.cpp", type: "file", desc: "Rack-and-pinion control: open() close() at 50Hz PWM" },
            { name: "haptic.cpp", type: "file", desc: "Buzzer pulse sequences — success, breach, tamper patterns" },
            { name: "mpu6050.cpp", type: "file", desc: "Tamper detection — motion threshold interrupt on GPIO23" },
            { name: "tm1637_clock.cpp", type: "file", desc: "Clock face driver — session timer and current time" },
            { name: "websocket.cpp", type: "file", desc: "AsyncWebServer — receives JSON state from Python daemon" },
          ]
        },
        {
          name: "include/", type: "folder", children: [
            { name: "config.h", type: "file", desc: "All GPIO pin defs, thresholds, WiFi creds (use .gitignore for creds)" },
          ]
        },
      ]
    },
    {
      name: "daemon/",
      type: "folder",
      tag: "MANDATORY",
      tagColor: "#ef4444",
      desc: "Python host daemon. Must run on Linux. Reviewers will test if it actually polls window titles.",
      required: true,
      children: [
        { name: "auraclock-daemon.py", type: "file", desc: "Main daemon — xdotool polling, blocklist eval, WebSocket send" },
        { name: "config.yaml", type: "file", desc: "Blocklist, allowlist, device IP, focus block duration" },
        { name: "requirements.txt", type: "file", desc: "websockets, pyyaml, subprocess — pinned versions" },
        { name: "README.md", type: "file", desc: "How to install and run the daemon (3 commands max)" },
      ]
    },
    {
      name: "PCB/",
      type: "folder",
      tag: "MANDATORY",
      tagColor: "#ef4444",
      desc: "KiCad source files. Gerbers alone = instant rejection. All three .kicad files must be present.",
      required: true,
      children: [
        { name: "auraclock-s3.kicad_pro", type: "file", desc: "KiCad project file — MANDATORY" },
        { name: "auraclock-s3.kicad_sch", type: "file", desc: "Schematic source — MANDATORY" },
        { name: "auraclock-s3.kicad_pcb", type: "file", desc: "PCB layout source — MANDATORY" },
        {
          name: "gerbers/", type: "folder", children: [
            { name: "auraclock-s3-gerbers.zip", type: "file", desc: "Production files for local etcher" },
          ]
        },
      ]
    },
    {
      name: "CAD/",
      type: "folder",
      tag: "MANDATORY",
      tagColor: "#ef4444",
      desc: "Onshape source + STEP export. STL alone = instant rejection. Electronics must be in assembly.",
      required: true,
      children: [
        { name: "auraclock-s3-assembly.step", type: "file", desc: "Full assembly STEP export — MANDATORY" },
        { name: "ONSHAPE-LINK.txt", type: "file", desc: "Public Onshape share link — MANDATORY" },
        { name: "enclosure-base.stl", type: "file", desc: "For reference / 3D printing" },
        { name: "shutter-mask.stl", type: "file", desc: "Rack-driven opaque mask" },
        { name: "rack.stl", type: "file", desc: "Linear gear — 20 tooth" },
        { name: "pinion.stl", type: "file", desc: "Circular gear — 10 tooth, mounts on SG90 horn" },
      ]
    },
    {
      name: "docs/",
      type: "folder",
      tag: "MANDATORY",
      tagColor: "#ef4444",
      desc: "Wiring diagram is required. Schematic export and photos make your submission stand out.",
      required: true,
      children: [
        { name: "wiring-diagram.png", type: "file", desc: "MANDATORY — clearly labeled, not screenshots of parts" },
        { name: "schematic.pdf", type: "file", desc: "EasyEDA / KiCad schematic export" },
        { name: "front-panel-reference.svg", type: "file", desc: "Component position blueprint" },
        { name: "assembly-guide.md", type: "file", desc: "Step-by-step physical assembly with photos" },
        {
          name: "photos/", type: "folder", children: [
            { name: "pcb-front.jpg", type: "file", desc: "Soldered PCB top view" },
            { name: "pcb-back.jpg", type: "file", desc: "Soldered PCB bottom view" },
            { name: "enclosure-assembly.jpg", type: "file", desc: "Components inside enclosure" },
            { name: "finished-front.jpg", type: "file", desc: "Final device — front face" },
            { name: "shutter-open.jpg", type: "file", desc: "OLED + 7-seg visible, shutter open" },
            { name: "shutter-closed.jpg", type: "file", desc: "Shutter mask covering display" },
          ]
        },
      ]
    },
    {
      name: "zine/",
      type: "folder",
      tag: "MANDATORY",
      tagColor: "#ef4444",
      desc: "Fallout magazine page. Must include IRL photos and QR code to YouTube demo video.",
      required: true,
      children: [
        { name: "zine-page.pdf", type: "file", desc: "Submitted Fallout zine page" },
        { name: "qr-code.png", type: "file", desc: "QR to YouTube demo — must be tested and working" },
      ]
    },
    {
      name: ".gitignore",
      type: "file",
      tag: "RECOMMENDED",
      tagColor: "#f59e0b",
      desc: "Ignore WiFi creds, build artifacts, .DS_Store, __pycache__",
      required: false,
      content: `# Credentials
daemon/secrets.yaml
firmware/include/secrets.h

# Build
.pio/
__pycache__/
*.pyc
.DS_Store`
    },
  ]
};

const FileIcon = ({ type }) => (
  <span style={{
    fontSize: "13px", marginRight: "6px",
    color: type === "folder" ? "#f59e0b" : "#94a3b8"
  }}>
    {type === "folder" ? "📁" : "📄"}
  </span>
);

const TagBadge = ({ tag, color }) => (
  <span style={{
    fontSize: "10px", padding: "2px 8px",
    background: color + "18",
    border: `1px solid ${color}44`,
    borderRadius: "10px",
    color: color,
    fontWeight: "600",
    letterSpacing: "0.5px",
    marginLeft: "8px",
    flexShrink: 0,
  }}>{tag}</span>
);

function TreeNode({ node, depth = 0 }) {
  const [open, setOpen] = useState(depth < 2);
  const [showContent, setShowContent] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div style={{ marginLeft: depth === 0 ? 0 : "20px" }}>
      <div
        onClick={() => hasChildren && setOpen(!open)}
        style={{
          display: "flex", alignItems: "center",
          padding: "6px 10px",
          borderRadius: "6px",
          cursor: hasChildren ? "pointer" : "default",
          background: "transparent",
          transition: "background 0.1s",
          gap: "4px",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "#1e293b"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        {hasChildren && (
          <span style={{
            fontSize: "10px", color: "#475569",
            transform: open ? "rotate(90deg)" : "rotate(0)",
            transition: "transform 0.15s", display: "inline-block",
            marginRight: "2px", flexShrink: 0,
          }}>▶</span>
        )}
        {!hasChildren && <span style={{ width: "14px", flexShrink: 0 }} />}
        <FileIcon type={node.type} />
        <span style={{
          fontSize: "13px", fontFamily: "'JetBrains Mono', monospace",
          color: node.type === "folder" ? "#e2e8f0" : "#94a3b8",
          fontWeight: node.type === "folder" ? "600" : "400",
        }}>{node.name}</span>
        {node.tag && <TagBadge tag={node.tag} color={node.tagColor} />}
        {node.desc && (
          <span style={{
            fontSize: "12px", color: "#475569",
            marginLeft: "auto", paddingLeft: "12px",
            whiteSpace: "nowrap", overflow: "hidden",
            textOverflow: "ellipsis", maxWidth: "260px",
          }}>{node.desc}</span>
        )}
      </div>
      {node.content && (
        <div style={{ marginLeft: "34px", marginBottom: "4px" }}>
          <button
            onClick={() => setShowContent(!showContent)}
            style={{
              fontSize: "11px", color: "#475569",
              background: "none", border: "none",
              cursor: "pointer", padding: "2px 0",
            }}
          >{showContent ? "hide template ▲" : "show template ▼"}</button>
          {showContent && (
            <pre style={{
              fontSize: "11px", background: "#0d0d18",
              border: "1px solid #1e293b", borderRadius: "6px",
              padding: "10px 14px", color: "#64748b",
              overflowX: "auto", margin: "4px 0 8px",
            }}>{node.content}</pre>
          )}
        </div>
      )}
      {hasChildren && open && (
        <div>
          {node.children.map((child, i) => (
            <TreeNode key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

const checks = [
  { label: "Public repo (not private)", key: "public" },
  { label: "All 3 KiCad files present (.kicad_pro, .kicad_sch, .kicad_pcb)", key: "kicad" },
  { label: "Onshape link in CAD/ONSHAPE-LINK.txt", key: "onshape" },
  { label: "STEP file exported (not just STL)", key: "step" },
  { label: "Firmware has state machine logic (not blink test)", key: "firmware" },
  { label: "Wiring diagram is labeled PNG (not screenshot)", key: "wiring" },
  { label: "README has story, photos, BOM table", key: "readme" },
  { label: "BOM.csv with prices and sources", key: "bom" },
  { label: "journal.md updated daily", key: "journal" },
  { label: "Zine page with working QR code", key: "zine" },
  { label: "Electronics modeled inside Onshape assembly", key: "electronics" },
  { label: ".gitignore excludes WiFi credentials", key: "gitignore" },
];

export default function RepoStructure() {
  const [tab, setTab] = useState("tree");
  const [checked, setChecked] = useState({});

  const toggle = key => setChecked(p => ({ ...p, [key]: !p[key] }));
  const done = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((done / checks.length) * 100);

  return (
    <div style={{
      background: "#0a0a0f",
      minHeight: "100vh",
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      color: "#e2e8f0",
    }}>
      {/* Header */}
      <div style={{
        background: "#0d0d18",
        borderBottom: "1px solid #1e293b",
        padding: "20px 28px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
          <span style={{ fontSize: "18px" }}>📦</span>
          <span style={{ fontSize: "16px", fontWeight: "700", color: "#f1f5f9" }}>auraclock-s3</span>
          <span style={{
            fontSize: "11px", padding: "2px 10px",
            background: "#1e293b", border: "1px solid #10b98133",
            borderRadius: "12px", color: "#10b981"
          }}>public</span>
        </div>
        <div style={{ fontSize: "12px", color: "#475569" }}>
          {repo.desc}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", marginTop: "16px" }}>
          {[
            { key: "tree", label: "📂 File tree" },
            { key: "checklist", label: "✅ Review checklist" },
            { key: "commits", label: "💬 Commit messages" },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: "6px 16px", fontSize: "12px",
              background: tab === t.key ? "#1e293b" : "transparent",
              border: "1px solid",
              borderColor: tab === t.key ? "#334155" : "transparent",
              borderRadius: "6px", color: tab === t.key ? "#f1f5f9" : "#64748b",
              cursor: "pointer",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 28px" }}>

        {tab === "tree" && (
          <div>
            <div style={{
              display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap"
            }}>
              {[
                { label: "MANDATORY", color: "#ef4444", desc: "Instant rejection if missing" },
                { label: "RECOMMENDED", color: "#f59e0b", desc: "Adds professionalism" },
              ].map(l => (
                <div key={l.label} style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  fontSize: "11px", color: "#64748b"
                }}>
                  <span style={{
                    padding: "2px 8px", background: l.color + "18",
                    border: `1px solid ${l.color}44`, borderRadius: "10px",
                    color: l.color, fontWeight: "600"
                  }}>{l.label}</span>
                  {l.desc}
                </div>
              ))}
            </div>

            <div style={{
              background: "#0d0d18",
              border: "1px solid #1e293b",
              borderRadius: "10px",
              padding: "8px 4px",
            }}>
              {/* Repo root label */}
              <div style={{
                padding: "8px 10px 12px",
                borderBottom: "1px solid #1e293b",
                marginBottom: "4px",
                display: "flex", alignItems: "center", gap: "8px"
              }}>
                <span style={{ fontSize: "14px" }}>🗂</span>
                <span style={{ fontSize: "13px", color: "#f1f5f9", fontWeight: "700" }}>
                  auraclock-s3/
                </span>
                <span style={{ fontSize: "11px", color: "#334155", marginLeft: "auto" }}>
                  github.com/[your-username]/auraclock-s3
                </span>
              </div>
              {repo.tree.map((node, i) => (
                <TreeNode key={i} node={node} depth={0} />
              ))}
            </div>
          </div>
        )}

        {tab === "checklist" && (
          <div>
            <div style={{
              background: "#0d0d18", border: "1px solid #1e293b",
              borderRadius: "10px", padding: "20px", marginBottom: "16px"
            }}>
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: "12px"
              }}>
                <span style={{ fontSize: "13px", color: "#64748b" }}>
                  Submission readiness
                </span>
                <span style={{
                  fontSize: "20px", fontWeight: "700",
                  color: pct === 100 ? "#10b981" : "#f59e0b"
                }}>{pct}%</span>
              </div>
              <div style={{
                height: "6px", background: "#1e293b",
                borderRadius: "3px", overflow: "hidden"
              }}>
                <div style={{
                  height: "6px", borderRadius: "3px",
                  background: pct === 100 ? "#10b981" : "#534AB7",
                  width: pct + "%", transition: "width 0.3s"
                }} />
              </div>
              <div style={{
                fontSize: "11px", color: "#334155",
                marginTop: "8px"
              }}>{done}/{checks.length} items complete</div>
            </div>

            {checks.map(c => (
              <div key={c.key}
                onClick={() => toggle(c.key)}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "12px 16px", cursor: "pointer",
                  background: checked[c.key] ? "#0d1f0d" : "transparent",
                  border: "1px solid",
                  borderColor: checked[c.key] ? "#10b98133" : "#1e293b",
                  borderRadius: "8px", marginBottom: "6px",
                  transition: "all 0.15s",
                }}
              >
                <div style={{
                  width: "20px", height: "20px",
                  borderRadius: "4px",
                  border: `1.5px solid ${checked[c.key] ? "#10b981" : "#334155"}`,
                  background: checked[c.key] ? "#10b981" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all 0.15s",
                }}>
                  {checked[c.key] && (
                    <span style={{ color: "#fff", fontSize: "12px", fontWeight: "700" }}>✓</span>
                  )}
                </div>
                <span style={{
                  fontSize: "13px",
                  color: checked[c.key] ? "#475569" : "#e2e8f0",
                  textDecoration: checked[c.key] ? "line-through" : "none",
                }}>{c.label}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "commits" && (
          <div>
            <div style={{
              fontSize: "12px", color: "#475569", marginBottom: "16px"
            }}>
              Use these exact commit message patterns. Professional commit history impresses reviewers.
            </div>
            {[
              {
                hash: "a1b2c3d", time: "tonight",
                msg: "init: project scaffold and folder structure",
                detail: "Add README, BOM.csv, journal.md, .gitignore, empty folder structure",
                color: "#8b5cf6"
              },
              {
                hash: "b2c3d4e", time: "tonight",
                msg: "pcb: complete schematic with DRC passing",
                detail: "Add KiCad files — ESP32, CH340C, AMS1117, OLED, TM1637, servo, MPU-6050, buzzer",
                color: "#06b6d4"
              },
              {
                hash: "c3d4e5f", time: "Sat",
                msg: "cad: add electronics to Onshape assembly",
                detail: "Import ESP32 + SG90 STEP files, model rack-and-pinion, export STEP",
                color: "#10b981"
              },
              {
                hash: "d4e5f6g", time: "Sun",
                msg: "firmware: state machine with OLED face and servo shutter",
                detail: "Add display.cpp, servo_shutter.cpp, haptic.cpp, main.cpp state machine",
                color: "#8b5cf6"
              },
              {
                hash: "e5f6g7h", time: "Mon",
                msg: "firmware: websocket handler and tamper detection",
                detail: "Add websocket.cpp, mpu6050.cpp — full breach/tamper logic",
                color: "#8b5cf6"
              },
              {
                hash: "f6g7h8i", time: "Mon",
                msg: "daemon: python window poller with blocklist eval",
                detail: "Add auraclock-daemon.py, config.yaml, requirements.txt",
                color: "#f97316"
              },
              {
                hash: "g7h8i9j", time: "Tue",
                msg: "pcb: finalize layout and export gerbers",
                detail: "Route all traces, generate gerbers + drill files for local etcher",
                color: "#06b6d4"
              },
              {
                hash: "h8i9j0k", time: "Tue",
                msg: "cad: polish — chamfers, engraving, vent slots",
                detail: "Add 1.5mm chamfers, AURACLOCK S3 engraving, bottom ventilation slots",
                color: "#10b981"
              },
              {
                hash: "i9j0k1l", time: "Wed",
                msg: "docs: wiring diagram, schematic PDF, assembly guide",
                detail: "Add labeled wiring-diagram.png, schematic.pdf, assembly-guide.md",
                color: "#ec4899"
              },
              {
                hash: "j0k1l2m", time: "Wed",
                msg: "docs: zine page and QR code for demo video",
                detail: "Add zine-page.pdf, qr-code.png pointing to YouTube demo",
                color: "#ec4899"
              },
              {
                hash: "k1l2m3n", time: "Thu",
                msg: "build: soldered PCB — all subsystems tested",
                detail: "Add build photos to docs/photos/, update README with IRL images",
                color: "#f59e0b"
              },
              {
                hash: "l2m3n4o", time: "Thu",
                msg: "release: v1.0 — design + build submission ready",
                detail: "All Fallout requirements met. Submitting for review.",
                color: "#10b981"
              },
            ].map((c, i) => (
              <div key={i} style={{
                display: "flex", gap: "12px", alignItems: "flex-start",
                padding: "12px 16px",
                background: "#0d0d18",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                marginBottom: "6px",
              }}>
                <span style={{
                  fontSize: "11px", fontFamily: "monospace",
                  color: c.color, flexShrink: 0,
                  background: c.color + "18",
                  padding: "2px 8px", borderRadius: "4px",
                  marginTop: "1px",
                }}>{c.hash}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", color: "#e2e8f0", fontWeight: "600" }}>
                    {c.msg}
                  </div>
                  <div style={{ fontSize: "12px", color: "#475569", marginTop: "2px" }}>
                    {c.detail}
                  </div>
                </div>
                <span style={{
                  fontSize: "11px", color: "#334155", flexShrink: 0
                }}>{c.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
